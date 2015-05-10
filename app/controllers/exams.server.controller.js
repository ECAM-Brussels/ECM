'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Exam = mongoose.model('Exam'),
	Copy = mongoose.model('Copy'),
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
		.populate('copies', 'activity created user')
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

/**
 * Create a copy
 */
exports.createCopy = function(req, res) {
	var copy = new Copy(req.body);
	copy.user = req.user;
	copy.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		res.jsonp(copy);
	});
};
