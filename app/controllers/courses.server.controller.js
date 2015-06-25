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
		}
		res.jsonp(course);
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
		}
		res.jsonp(course);
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
		}
		res.jsonp(course);
	});
};

/**
 * List of Courses
 */
exports.list = function(req, res) { 
	Course.find({}, 'ID name coordinator activities')
		  .populate('coordinator', 'serial')
		  .populate('activities', 'ID name teachers')
		  .sort({'ID': 1})
		  .exec(function(err, courses) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}

		Course.populate(courses, {path: 'activities.teachers', select: 'serial', model: 'User'}, function(err, courses) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			}
			res.jsonp(courses);
		});
	});
};

/**
 * Course middleware
 */
exports.courseByID = function(req, res, next, id) {
	if(req.method === 'POST') {
		return next();
	}
	Course.findOne({ID : id}, 'ID name coordinator activities')
		  .populate('coordinator', 'username')
		  .populate('activities', 'ID name weight teachers')
		  .exec(function(err, course) {
		if (err) return next(err);
		if (! course) return next(new Error('Failed to load Course ' + id));

		Course.populate(course, {path: 'activities.teachers', select: 'username', model: 'User'}, function(err, course) {
			if (err) return next(err);
			if (! course) return next(new Error('Failed to load Course ' + id));

			var totalWeight = 0;
			for (var i = 0; i < course.activities.length; i++) {
				totalWeight += course.activities[i].weight;
			}
			req.course = {
				'_id': course._id,
				'ID': course.ID,
				'name': course.name,
				'coordinator': course.coordinator,
				'activities': course.activities,
				'totalWeight': totalWeight
			};
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

function isTeacher(teacher, activities) {
	for (var i = 0; i < activities.length; i++) {
		for (var j = 0; j < activities[i].teachers.length; j++) {
			if (activities[i].teachers[j]._id.toString() === teacher) {
				return true;
			}
		}
	}
	return false;
}

exports.listMyCourses = function(req, res) { 
	Course.find({}, 'ID name coordinator activities')
		  .populate('coordinator', 'serial')
		  .populate('activities', 'ID name teachers')
		  .sort({'ID': 1})
		  .exec(function(err, courses) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		
		Course.populate(courses, {path: 'activities.teachers', select: 'serial', model: 'User'}, function(err, courses) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			}

			// Keep course if coordinator or if involved in one activity
			var tokeep = [];

			for (var i = 0; i < courses.length; i++) {
				if (courses[i].coordinator._id.toString() === req.user.id) {
					tokeep.push(courses[i]);
				} else if (isTeacher(req.user.id, courses[i].activities)) {
					tokeep.push(courses[i]);
				}
			}
			res.jsonp(tokeep);
		});
	});
};
