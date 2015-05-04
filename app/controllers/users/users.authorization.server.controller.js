'use strict';
/**
 * Module dependencies.
 */
var _ = require('lodash'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  fs = require('fs');
/**
 * User middleware
 */
var userByID = function(req, res, next, id) {
  User.findOne({
    _id: id
  }).exec(function(err, user) {
    if (err) return next(err);
    if (!user) return next(new Error('Failed to load User ' + id));
    req.profile = user;
    next();
  });
};
/**
 * User middleware by Serial
 */
exports.userBySerial = function(req, res, next, id) {
  if(id.length > 15) return userByID(req, res, next, id);
  User.findOne({
    serial: id
  }).exec(function(err, user) {
    if (err) return next(err);
    if (!user) return next(new Error('Failed to load User ' + id));
    req.profile = user;
    next();
  });
};
/**
 * Require login routing middleware
 */
exports.requiresLogin = function(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).send({
      message: 'User is not logged in'
    });
  }
  next();
};
/**
 * User authorizations routing middleware
 */
exports.hasAuthorization = function(roles) {
  var _this = this;
  return function(req, res, next) {
    _this.requiresLogin(req, res, function() {
      if (_.intersection(req.user.roles, roles).length) {
        return next();
      } else {
        return res.status(403).send({
          message: 'User is not authorized'
        });
      }
    });
  };
};
