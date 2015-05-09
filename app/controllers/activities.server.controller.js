'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Activity = mongoose.model('Activity'),
	User = mongoose.model('User'),
	_ = require('lodash');

/**
 * Create a Activity
 */
exports.create = function(req, res) {
	var activity = new Activity(req.body);
	console.log(activity);
	if (activity.teachers.length === 0) {
		return res.status(400).send({
			message: 'Please specify at least one teacher for the activity'
		});
	}
	activity.user = req.user;
	activity.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		res.jsonp(activity);
	});
};

/**
 * Show the current Activity
 */
exports.read = function(req, res) {
	res.jsonp(req.activity);
};

/**
 * Update a Activity
 */
exports.update = function(req, res) {
	var activity = req.activity;
	activity = _.extend(activity, req.body);
	activity.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		res.jsonp(activity);
	});
};

/**
 * Delete an Activity
 */
exports.delete = function(req, res) {
	var activity = req.activity;
	activity.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		res.jsonp(activity);
	});
};

/**
 * List of Activities
 */
exports.list = function(req, res) {
	Activity.find({}, 'ID name')
			.sort({ID: 1})
			.exec(function(err, activities) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		res.jsonp(activities);
	});
};

/**
 * Activity middleware
 */
exports.activityByID = function(req, res, next, id) {
	if (req.method === 'POST') {
		return next();
	}
	Activity.findOne({ID: id}, 'ID name teachers weight')
			.populate('teachers', 'username')
			.exec(function(err, activity) {
		if (err) {
			return next(err);
		}
		if (! activity) {
			return next(new Error('Failed to load Activity ' + id));
		}
		req.activity = activity;
		next();
	});
};

/**
 * Activity authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.activity.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

exports.listTeachers = function(req, res) { 
	User.find('teacher', 'serial displayName')
		.sort({serial: 1})
		.exec(function(err, users) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		res.jsonp(users);
	});
};
