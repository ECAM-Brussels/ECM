'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Group = mongoose.model('Group'),
	_ = require('lodash');

/**
 * Create a group
 */
exports.create = function(req, res) {
	var group = new Group(req.body);
	group.user = req.user;
	group.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		res.jsonp(group);
	});
};

/**
 * Show the current group
 */
exports.read = function(req, res) {
	res.jsonp(req.group);
};

/**
 * Update a group
 */
exports.update = function(req, res) {
	var group = req.group;
	group = _.extend(group, req.body);
	group.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		res.jsonp(group);
	});
};

/**
 * Delete a group
 */
exports.delete = function(req, res) {
	var group = req.group;
	group.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		res.jsonp(group);
	});
};

/**
 * List of groups
 */
exports.list = function(req, res) {
	Group.find({}, 'name description')
		 .sort({'name': 1})
		 .exec(function(err, groups) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		res.jsonp(groups);
	});
};

/**
 * Group middleware
 */
exports.groupByID = function(req, res, next, id) {
	Group.findById(id, 'name description')
		 .exec(function(err, group) {
		if (err) {
			return next(err);
		} 
		if (! group) {
			return next(new Error('Failed to load group ' + id));
		}
		req.group = group;
		next();
	});
};

/**
 * Group middleware
 */
exports.groupByName = function(req, res, next, name) {
	if (req.method === 'POST') {
		return next();
	}
	Group.findOne({name : name})
		 .populate('user', 'displayName')
		 .exec(function(err, group) {
		if (err) {
			return next(err);
		}
		if (! group) {
			return next(new Error('Failed to load Group ' + name));
		} 
		req.group = group;
		next();
	});
};

/**
 * Group authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.group.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
