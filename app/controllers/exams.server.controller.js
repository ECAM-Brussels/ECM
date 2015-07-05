'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Exam = mongoose.model('Exam'),
	fs = require('fs-extra'),
	path = require('path'),
	process = require('process'),
	child_process = require('child_process'),
	moment = require('moment'),
	_ = require('lodash');

/**
 * Create an exam
 */
exports.create = function(req, res) {
	var exam = new Exam(req.body);
	exam.user = req.user;
	exam.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		res.jsonp(exam);
	});
};

/**
 * Show the current exam
 */
exports.read = function(req, res) {
	res.jsonp(req.exam);
};

/**
 * Update an exam
 */
exports.update = function(req, res) {
	var exam = req.exam;
	exam = _.extend(exam, req.body);
	exam.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		res.jsonp(exam);
	});
};

/**
 * Delete an exam
 */
exports.delete = function(req, res) {
	var exam = req.exam;
	exam.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		res.jsonp(exam);
	});
};

/**
 * List of all exams
 */
exports.list = function(req, res) { 
	Exam.find({}, 'title course examsession date printed ready')
		.populate('course', 'ID name')
		.exec(function(err, exams) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		res.jsonp(exams);
	});
};

/**
 * Exam middleware
 */
exports.examByID = function(req, res, next, id) { 
	Exam.findById(id, 'title course examsession rooms date duration copies affectation ready printed')
		.populate('course', 'ID name coordinator')
		.populate('examsession', 'name')
		.populate('rooms', 'ID')
		.populate('copies', 'exam activity created user series files')
		.exec(function(err, exam) {
		if (err) {
			return next(err);
		}
		if (! exam) {
			return next(new Error('Failed to load Exam ' + id));
		}

		Exam.populate(exam, {path: 'activities.teachers', select: 'username', model: 'User'}, function(err, exam) {
			if (err) {
				return next(err);
			}
			if (! exam) {
				return next(new Error('Failed to load Exam ' + id));
			}

			Exam.populate(exam, {path: 'course.coordinator', select: 'username', model: 'User'}, function (err, exam) {
				if (err) {
					return next(err);
				}
				if (! exam) {
					return next(new Error('Failed to load Exam ' + id));
				}

				Exam.populate(exam, {path: 'copies.user', select: 'username', model: 'User'}, function (err, exam) {
					if (err) {
						return next(err);
					}
					if (! exam) {
						return next(new Error('Failed to load Exam ' + id));
					}

					Exam.populate(exam, {path: 'affectation.room', select: 'ID', model: 'Room'}, function (err, exam) {
						if (err) {
							return next(err);
						}
						if (! exam) {
							return next(new Error('Failed to load Exam ' + id));
						}

						Exam.populate(exam, {path: 'affectation.student', select: 'firstname lastname', model: 'Student'}, function (err, exam) {
							if (err) {
								return next(err);
							}
							if (! exam) {
								return next(new Error('Failed to load Exam ' + id));
							}

							req.exam = exam;
							next();
						});
					});
				});
			});
		});
	});
};

/**
 * Exam authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.exam.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

function isTeacher(teacher, activities) {
	for (var i = 0; i < activities.length; i++) {
		for (var j = 0; j < activities[i].teachers.length; j++) {
			if (activities[i].teachers[j].toString() === teacher) { // == works but === do not work...
				return true;
			}
		}
	}
	return false;
}

exports.listMyExams = function(req, res) { 
	Exam.find({}, 'course activities groups date')
		.populate('course', 'ID name coordinator activities')
		.populate('activities', 'teachers')
		.populate('groups', 'name')
		.sort({'ID': 1})
		.exec(function(err, exams) {
		if (err) {
			return res.status(400).send({
				message: 'Sorry, I failed executing the request'
			});
		}
		Exam.populate(exams, {path: 'activities.teachers', select: 'username', model: 'User'}, function(err, exam) {
			if (err) {
				return res.status(400).send({
					message: 'Sorry, I failed populating your exams'
				});
			}
			Exam.populate(exams, {path: 'course.activities', select: 'ID name teachers', model: 'Activity'}, function(err, exam) {
				if (err) {
					return res.status(400).send({
						message: 'Sorry, I failed populating your exams'
					});
				}
				var tokeep = [];

				for (var i = 0; i < exams.length; i++) {
					if (exams[i].course.coordinator.toString() === req.user.id) { // == works but === do not work...
						tokeep.push(exams[i]);
					} else {
						if (isTeacher(req.user.id, exams[i].course.activities)) {
							tokeep.push(exams[i]);
						}
					}
				}
				res.jsonp(tokeep);
			});
		});
	});
};

// Download a PDF copy for the exam
exports.downloadCopy = function(req, res) {
	var path = require('path');
	var dest = path.dirname(require.main.filename) + '/copies/' + req.body.exam + '/copy_' + req.body.index + '.pdf';
	fs.readFile(dest, function(err, content) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		res.writeHead(200, {'Content-Type': 'application/pdf'});
		res.end(content);
	});
};

exports.downloadCopies = function(req, res) {
	var examid = req.body.exam;
	// Check if zip has already been generated
	var zippath = path.dirname(require.main.filename) + '/copies/copies-' + examid + '.zip';
	if (fs.existsSync(zippath)) {
		return res.sendFile(zippath);
	}
	// Find the exam from which to print the copies
	Exam.findById(examid)
		.populate('copies', 'files')
		.populate('course', 'ID name')
		.exec(function(err, exam) {
		Exam.populate(exam, {path: 'affectation.student', select: 'matricule firstname lastname', model: 'Student'}, function(err, exam) {
			if (err) {
				console.log('Populate student : ' + err);
				return res.status(400).send({
					message: 'Impossible to load registered students'
				});
			}
			Exam.populate(exam, {path: 'affectation.room', select: 'ID', model: 'Room'}, function(err, exam) {
				if (err) {
					console.log('Populate rooms : ' + err);
					return res.status(400).send({
						message: 'Impossible to load rooms'
					});
				}
				// Create directory to store copies
				var copiespath = path.dirname(require.main.filename) + '/copies/' + examid;
				if (! fs.existsSync(copiespath)) {
					fs.mkdirSync (copiespath);
				}
				// For each student, generate his copy
				var copies = exam.copies[0];
				var affectation = exam.affectation;
				var totalGenerated = 0;
				for (var i = 0; i < affectation.length; i++) {
					// Create the final PDF from text file
					var templatesrc = path.dirname(require.main.filename) + '/pdfgen/templates/basic-template.tex';
					var content = fs.readFileSync(templatesrc, {encoding: 'utf8', flag: 'r'}, function(err) {
						if (err) {
							console.log('Template copy failed : ' + err);
							return res.status(400).send({
								message: 'Error while copying the exam copy template'
							});
						}
					});
					// Fill in the template
					content = content.replace(/!filename!/g, copies.files[affectation[i].serie].name);
					content = content.replace(/!filepath!/g, path.dirname(require.main.filename) + '/copies/' + copies._id + '/' + copies.files[affectation[i].serie].name);
					var examdate = moment(exam.date);
					content = content.replace(/!datetime!/g, examdate.format('DD/MM/YYYY HH:mm'));
					content = content.replace(/!date!/g, examdate.format('DD/MM/YYYY'));
					content = content.replace(/!firstname!/g, affectation[i].student.firstname);
					content = content.replace(/!lastname!/g, affectation[i].student.lastname);
					content = content.replace(/!matricule!/g, affectation[i].student.matricule);
					content = content.replace(/!courseid!/g, exam.course.ID);
					content = content.replace(/!coursename!/g, exam.course.name);
					content = content.replace(/!serie!/g, affectation[i].serie + 1);
					content = content.replace(/!classement!/g, affectation[i].number);
					content = content.replace(/!room!/g, affectation[i].room.ID);
					content = content.replace(/!seatnumber!/g, affectation[i].seat);
					var now = moment();
					content = content.replace(/!gendate!/g, now.format('DD/MM/YYYY HH:mm'));
					// Create the .tex file for the student
					var texsrc = copiespath + '/' + (i + 1) + 'copy_' + (affectation[i].serie + 1) + '_student_' + affectation[i].number + '.tex';
					fs.writeFileSync(texsrc, content, {encoding: 'utf8', flag: 'w'}, function(err) {
						if (err) {
							console.log('TeX file write failed : ' + err);
							return res.status(400).send({
								message: 'Error while writing .tex file for a student'
							});
						}
					});
					// Compile the .tex file
					process.chdir(path.dirname(texsrc));
					child_process.execFile('pdflatex', [path.basename(texsrc)], function(err, stdout, stderr) {
						if (err) {
							console.log('pdflatex error : ' + err);
							return res.status(400).send({
								message: 'Error while compiling the .tex file\n' + err
							});
						}
						console.log('Progress: ' + (totalGenerated + 1) + '/' + affectation.length);
						totalGenerated++;
						// All .tex files have been compiled
						if (totalGenerated === affectation.length) {
							// Build a ZIP archive with all copies
							process.chdir(path.dirname(require.main.filename) + '/copies');
							child_process.execFile('zip', ['-r', 'copies-' + examid + '.zip', examid, '-i*.pdf'], function(err, stdout, stderr) {
								if (err) {
									console.log('Zip generation error : ' + err);
									return res.status(400).send({
										message: 'Error while generating the ZIP file'
									});
								}
								res.sendFile(zippath);
							});
						} 
					});
				}
			});
		});
	});
};

// Add a questionnaire for the exam
exports.addCopy = function(req, res) {
	// Check exam
	Exam.findById(req.body.exam, 'copies').exec(function(err, exam) {
		if (err || ! exam) {
			return res.status(400).send({
				message: 'Error while retrieving the specified exam'
			});
		}
		// Add a copy to the exam
		exam.copies.push({
			name: null,
			validated: false
		});
		exam.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			}
			res.send('OK added');
		});
	});
};

// Validate a questionnaire for the exam
exports.validateCopy = function(req, res) {
	// Check exam
	Exam.findById(req.body.exam, 'copies').exec(function(err, exam) {
		if (err || ! exam) {
			return res.status(400).send({
				message: 'Error while retrieving the specified exam'
			});
		}
		// Check arguments
		if (! (0 <= req.body.index && req.body.index < exam.copies.length)) {
			return res.status(400).send({
				message: 'Invalid arguments'
			});
		}
		// Mark the copy as validated
		exam.copies[req.body.index].validated = true;
		exam.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			}
			res.send('OK validated');
		});
	});
};

// Upload a file for a questionnaire
exports.uploadCopy = function(req, res) {
	// Check exam
	Exam.findById(req.body.exam, 'course date copies').populate('course', 'ID name').exec(function(err, exam) {
		if (err || ! exam) {
			return res.status(400).send({
				message: 'Error while retrieving the specified exam'
			});
		}
		// Check arguments
		if (! (0 <= req.body.index && req.body.index < exam.copies.length)) {
			return res.status(400).send({
				message: 'Invalid arguments'
			});
		}
		// Create directory if not existing
		var dest = path.dirname(require.main.filename) + '/copies/' + req.body.exam;
		fs.ensureDirSync(dest);
		// Copy PDF file
		var file = req.files.file;
		dest += '/' + path.basename(file.path);
		fs.copy(file.path, dest, function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			}
			// Delete PDF file from /tmp
			fs.unlinkSync(file.path);
			// Create the final PDF from text file
			var src = path.dirname(require.main.filename) + '/pdfgen/templates/basic-template.tex';
			var content = fs.readFileSync(src, {encoding: 'utf8', flag: 'r'});
			content = content.replace(/!filename!/g, path.basename(file.path));
			content = content.replace(/!filepath!/g, dest);
			var examdate = moment(exam.date);
			content = content.replace(/!datetime!/g, examdate.format('DD/MM/YYYY HH:mm'));
			content = content.replace(/!date!/g, examdate.format('DD/MM/YYYY'));
			content = content.replace(/!firstname!/g, '');
			content = content.replace(/!lastname!/g, '');
			content = content.replace(/!matricule!/g, '');
			content = content.replace(/!courseid!/g, exam.course.ID);
			content = content.replace(/!coursename!/g, exam.course.name);
			content = content.replace(/!serie!/g, parseInt (req.body.index) + 1);
			content = content.replace(/!classement!/g, '\\hspace{1cm}');
			content = content.replace(/!room!/g, '\\hspace{1.5cm}');
			content = content.replace(/!seatnumber!/g, '\\hspace{1cm}');
			var now = new Date();
			content = content.replace(/!gendate!/g, now.getDate() + '/' + now.getMonth() + '/' + now.getFullYear() + ' ' + now.getHours() + ':' + now.getMinutes());
			// Compile the LaTeX file
			dest = path.dirname(require.main.filename) + '/copies/' + req.body.exam + '/copy_' + req.body.index + '.tex';
			fs.writeFileSync(dest, content, {encoding: 'utf8', flag: 'w'});
			process.chdir(path.dirname(dest));
			child_process.execFile('pdflatex', [path.basename(dest)], function(err, stdout, stderr) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				}
				// Update informations about the questionnaire
				var copy = exam.copies[req.body.index];
				copy.created = new Date();
				copy.user = req.user;
				copy.name = path.basename(file.path);
				exam.save(function(err) {
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					}
					res.jsonp(exam);
				});
			});
		});
	});
};
