'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Exam = mongoose.model('Exam'),
	_ = require('lodash');

/**
 * Create a Exam
 */
exports.create = function(req, res) {
	var exam = new Exam(req.body);
	exam.user = req.user;

	exam.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(exam);
		}
	});
};

/**
 * Show the current Exam
 */
exports.read = function(req, res) {
	res.jsonp(req.exam);
};

/**
 * Update a Exam
 */
exports.update = function(req, res) {
	var exam = req.exam ;

	exam = _.extend(exam , req.body);

	exam.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(exam);
		}
	});
};

/**
 * Delete an Exam
 */
exports.delete = function(req, res) {
	var exam = req.exam ;

	exam.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(exam);
		}
	});
};

/**
 * List of Exams
 */
exports.list = function(req, res) { 
	Exam.find().populate('course', 'ID').sort('+course.ID').populate('user', 'displayName').populate('rooms activity').exec(function(err, exams) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(exams);
		}
	});
};

/**
 * Exam middleware
 */
exports.examByID = function(req, res, next, id) { 
	Exam.findById(id).populate('user', 'displayName').populate('rooms activity').exec(function(err, exam) {
		if (err) return next(err);
		if (! exam) return next(new Error('Failed to load Exam ' + id));
		req.exam = exam ;
		next();
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
