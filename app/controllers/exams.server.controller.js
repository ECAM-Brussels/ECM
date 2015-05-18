'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Exam = mongoose.model('Exam'),
	Copy = mongoose.model('Copy'),
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
	Exam.find({}, 'course groups date printed ready')
		.populate('course', 'ID name')
		.populate('groups', 'name')
		.sort({'date': 1})
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
	Exam.findById(id, 'course activities rooms groups date split copies affectation')
		.populate('course', 'ID name coordinator')
		.populate('rooms', 'ID')
		.populate('activities', 'ID teachers')
		.populate('groups', 'name')
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
			if (activities[i].teachers[j]._id.toString() === teacher) { // == works but === do not work...
				return true;
			}
		}
	}
	return false;
}

exports.listMyExams = function(req, res) { 
	Exam.find({}, 'course activities groups date')
		.populate('course', 'ID name coordinator')
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
			var tokeep = [];

			for (var i = 0; i < exams.length; i++) {
				if (exams[i].course.coordinator.toString() === req.user.id) { // == works but === do not work...
					tokeep.push(exams[i]);
				} else {
					if (isTeacher(req.user.id, exams[i].activities)) {
						tokeep.push(exams[i]);
					}
				}
			}
			res.jsonp(tokeep);
		});
	});
};

/**
 * Create a copy
 */
exports.createCopy = function(req, res) {
	var copy = new Copy(req.body);
	copy.user = req.user;
	copy.files = new Array(copy.series);
	for (var i = 0; i < copy.series; i++) {
		copy.files[i] = null;
	}
	copy.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		res.jsonp(copy);
	});
};

// Download a PDF copy for the exam
exports.downloadCopy = function(req, res) {
	var path = require('path');
	var dest = path.dirname(require.main.filename) + '/copies/' + req.body.copy + '/copy_' + req.body.index + '.pdf';
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

exports.validateCopy = function(req, res) {
	Copy.findById(req.body.copy)
		.exec(function(err, copy) {
		copy.files[req.body.index].validated = true;
		Copy.update({_id: copy._id}, {$set: {files: copy.files}}, function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			}
			res.send('OK');
		});
	});
};

// Upload a PDF copy for the exam
exports.uploadCopy = function(req, res) {
	// Check exam
	Exam.findById(req.body.exam, 'course date')
		.populate('course', 'ID name')
		.exec(function(err, exam) {
		// Create directory if not existing
		var dest = path.dirname(require.main.filename) + '/copies/' + req.body.copy;
		if (! fs.existsSync(dest)) {
			fs.mkdirSync (dest);
		}
		// Copy PDF file
		var file = req.files.file;
		dest = dest + '/' + path.basename(file.path);
		fs.copy(file.path, dest, function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			}
			// Delete PDF file from /tmp
			fs.unlink(file.path, function(err){});
			// Create the final PDF from text file
			var src = path.dirname(require.main.filename) + '/pdfgen/templates/basic-template.tex';
			var content = fs.readFileSync(src, {encoding: 'utf8', flag: 'r'}, function(err){});
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
			dest = path.dirname(require.main.filename) + '/copies/' + req.body.copy + '/copy_' + req.body.index + '.tex';
			fs.writeFileSync(dest, content, {encoding: 'utf8', flag: 'w'}, function(err){});
			process.chdir(path.dirname(dest));
			child_process.execFile('pdflatex', [path.basename(dest)], function(err, stdout, stderr) {
				if (err) {
					console.log('ERROR : ' + err);
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				}
				// Update database
				Copy.findById(req.body.copy)
					.exec(function(err, copy) {
					copy.files[req.body.index] = {
						created: new Date(),
						user: req.user
					};
					Copy.update({_id: copy._id}, {$set: {files: copy.files}}, function(err) {
						if (err) {
							return res.status(400).send({
								message: errorHandler.getErrorMessage(err)
							});
						}
						res.jsonp(copy.files[req.body.index]);
					});
				});
			});
		});
	});
};
