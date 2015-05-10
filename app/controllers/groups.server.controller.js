'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Group = mongoose.model('Group'),
	_ = require('lodash');

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
