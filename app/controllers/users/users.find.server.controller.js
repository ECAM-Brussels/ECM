'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  errorHandler = require('../errors.server.controller'),
  mongoose = require('mongoose'),
  User = mongoose.model('User');

exports.listTeachers = function(req, res) { 
  User.find({roles: 'teacher'}).sort('-created').exec(function(err, users) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(users);
    }
  });
};

