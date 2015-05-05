'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Course = mongoose.model('Course'),
	_ = require('lodash');
 
/**
 * Create a Course
 */
exports.create = function(req, res) {
	var course = new Course(req.body);
	course.user = req.user;

	course.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(course);
		}
	});
};

/**
 * Show the current Course
 */
exports.read = function(req, res) {
	res.jsonp(req.course);
};

/**
 * Update a Course
 */
exports.update = function(req, res) {
	var course = req.course ;

	course = _.extend(course , req.body);

	course.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(course);
		}
	});
};

/**
 * Delete an Course
 */
exports.delete = function(req, res) {
	var course = req.course ;

	course.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(course);
		}
	});
};

/**
 * List of Courses
 */
exports.list = function(req, res) { 
	Course.find().sort({'ID': 1}).populate('user', 'displayName').populate('coordinators activities').exec(function(err, courses) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(courses);
		}
	});
};

/**
 * Course middleware
 */
exports.courseByID = function(req, res, next, id) { 
  if(req.method === 'POST') return next();
	Course.findOne({ID : id}, 'ID name coordinator activities')
		  .populate('coordinator', 'username')
		  .populate('activities', 'ID teachers')
		  .exec(function(err, course) {
		if (err) return next(err);
		if (! course) return next(new Error('Failed to load Course ' + id));

		Course.populate(course, {path: 'activities.teachers', select: 'username', model: 'User'}, function(err, course){
			if (err) return next(err);
			if (! course) return next(new Error('Failed to load Course ' + id));

			req.course = course ;
			next();
		});
	});
};

/**
 * Course authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.course.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

exports.listMyCourses = function(req, res) { 
  Course.find({coordinator : req.user.id}, 'ID name')
  		.sort({'ID': 1})
  		.exec(function(err, courses) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(courses);
    }
  });
};
