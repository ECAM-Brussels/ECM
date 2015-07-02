'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	ExamSession = mongoose.model('ExamSession'),
	_ = require('lodash');

/**
 * Create an exam session
 */
exports.create = function(req, res) {
	var examsession = new ExamSession(req.body);
	examsession.user = req.user;
	examsession.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		res.jsonp(examsession);
	});
};

/**
 * Show the current exam session
 */
exports.read = function(req, res) {
	res.jsonp(req.examsession);
};

/**
 * Update an exam session
 */
exports.update = function(req, res) {
	var examsession = req.examsession;
	examsession = _.extend(examsession, req.body);
	examsession.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		res.jsonp(examsession);
	});
};

/**
 * Delete an exam session
 */
exports.delete = function(req, res) {
	var examsession = req.examsession;
	examsession.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		res.jsonp(examsession);
	});
};

/**
 * List exam sessions
 */
exports.list = function(req, res) { 
	ExamSession.find({}, 'name from to').exec(function(err, examsessions) {
		if (err) {
			console.log('ERRRROR : ' + err);
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		res.jsonp(examsessions);
	});
};

/**
 * Exam session middleware
 */
exports.examSessionByID = function(req, res, next, id) { 
	ExamSession.findById(id).populate('name').exec(function(err, examsession) {
		if (err) {
			return next(err);
		}
		if (! examsession) {
			return next(new Error('Failed to load session ' + id));
		}
		req.examsession = examsession;
		next();
	});
};
