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
	Exam.find({}, 'course groups date')
		.populate('course', 'ID name')
		.populate('groups', 'name')
		.sort({'ID': 1})
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
	Exam.findById(id, 'course activities rooms groups date split copies')
		.populate('course', 'ID name coordinator')
		.populate('rooms', 'ID')
		.populate('activities', 'ID teachers')
		.populate('groups', 'name')
		.populate('copies', 'activity created user series files')
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

					req.exam = exam;
					next();
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

exports.listMyExams = function(req, res) { 
	Exam.find({}, 'course activities groups date')
		.populate('course', 'ID name coordinator')
		.populate('activities', 'teachers')
		.populate('groups', 'name')
		.sort({'ID': 1})
		.exec(function(err, exams) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		Exam.populate(exams, {path: 'activities.teachers', select: 'username', model: 'User'}, function(err, exam) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			}
			var tokeep = [];
			for (var i = 0; i < exams.length; i++) {
				if (exams[i].course.coordinator == req.user.id) { // == works but === do not work...
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

function isTeacher(teacher, activities) {
	for (var i = 0; i < activities.length; i++) {
		for (var j = 0; j < activities[i].teachers.length; j++) {
			if (activities[i].teachers[j]._id == teacher) { // == works but === do not work...
				return true;
			}
		}
	}
	return false;
}

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

// Upload a PDF copy for the exam
exports.uploadCopy = function(req, res) {
	// Create directory if not existing
	var dest = path.dirname(require.main.filename) + '/copies/' + req.body.copy;
	if (! fs.existsSync(dest)) {
		fs.mkdirSync (dest);
	}
	// Copy PDF file
	var file = req.files.file;
	dest = dest + '/copy_' + req.body.index + '.pdf';
	fs.copy(file.path, dest, function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		// Delete PDF file from /tmp
		fs.unlink(file.path, function(err){});
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
};
