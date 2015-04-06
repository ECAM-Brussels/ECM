'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  errorHandler = require('../errors.server.controller'),
  mongoose = require('mongoose'),
  User = mongoose.model('User');

exports.list = function(req, res) { 
  User.find().sort('-created').exec(function(err, users) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(users);
    }
  });
};

