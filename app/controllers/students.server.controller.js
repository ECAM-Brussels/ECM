'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Student = mongoose.model('Student'),
	_ = require('lodash');

/**
 * Create a Student
 */
exports.create = function(req, res) {
	var student = new Student(req.body);
	student.user = req.user;

	student.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(student);
		}
	});
};

/**
 * Show the current Student
 */
exports.read = function(req, res) {
	res.jsonp(req.student);
};

/**
 * Update a Student
 */
exports.update = function(req, res) {
	var student = req.student ;

	student = _.extend(student , req.body);

	student.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(student);
		}
	});
};

/**
 * Delete an Student
 */
exports.delete = function(req, res) {
	var student = req.student ;

	student.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(student);
		}
	});
};

/**
 * List of Students
 */
exports.list = function(req, res) { 
	Student.find().sort('-created').populate('user', 'displayName').exec(function(err, students) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(students);
		}
	});
};

/**
 * Student middleware
 */
exports.studentByID = function(req, res, next, id) { 
	Student.findById(id).populate('user', 'displayName').exec(function(err, student) {
		if (err) return next(err);
		if (! student) return next(new Error('Failed to load Student ' + id));
		req.student = student ;
		next();
	});
};

/**
 * Student authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.student.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
