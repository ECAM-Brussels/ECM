'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User');

/**
 * Signin after passport authentication
 */
exports.signin = function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err || ! user) {
			res.status(400).send(info);
		} else {
			// Remove sensitive data before login
			user.password = undefined;
			user.salt = undefined;
			req.login(user, function(err) {
				if (err) {
					res.status(400).send(err);
				} else {
					res.json(user);
				}
			});
		}
	})(req, res, next);
};

/**
 * Signout
 */
exports.signout = function(req, res) {
	req.logout();
	res.redirect('/');
};

exports.createUser = function(req, res) {
	// Init Variables
	var user = new User(req.body);
	// Add missing user fields
	var roles = ['user'];
	if (req.body.rights.teacher) {
		roles.push('teacher');
	}
	if (req.body.rights.manager) {
		roles.push('manager');
	}
	if (req.body.rights.admin) {
		roles.push('admin');
	}
	if (req.body.rights.printer) {
		roles.push('printer');
	}
	user.username = user.serial;
	user.roles = roles;
	user.provider = 'local';
	user.displayname = user.firstname + ' ' + user.lastname;
	// Then save the user 
	user.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		return res.status(200).send({
			message: 'User created'
		});
	});
};

exports.read = function(req, res) {
	res.jsonp(req.profile);
};
