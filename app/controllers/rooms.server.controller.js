'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Room = mongoose.model('Room'),
	fs = require('fs-extra'),
	path = require('path'),
	_ = require('lodash');

/**
 * Create a Room
 */
exports.create = function(req, res) {
	var room = new Room({
		ID: req.body.ID,
		name: req.body.name,
		seats: req.body.seats,
		picture: req.body.path != null && req.body.path !== '',
		user: req.user
	});
	room.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		// Save picture
		if (req.body.path != null && req.body.path !== '') {
			var src = '/tmp/' + path.basename(req.body.path);
			var dest = path.dirname(require.main.filename) + '/public/images/rooms/' + room._id + '.jpg';
			fs.copy(src, dest, function(err) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				}
				fs.unlink(src, function(err){});
				fs.unlink(path.dirname(require.main.filename) + '/public/images/uploads/' + path.basename(req.body.path), function(err){});
			});
		}
		res.jsonp(room);
	});
};

// Upload a picture for the room
exports.upload = function(req, res) {
	var file = req.files.file;
	var dest = path.dirname(require.main.filename) + '/public/images/uploads/' + path.basename(file.path);
	fs.copy(file.path, dest, function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		res.send(path.basename(file.path));
	});
};

/**
 * Show the current Room
 */
exports.read = function(req, res) {
	res.jsonp(req.room);
};

/**
 * Update a Room
 */
exports.update = function(req, res) {
	var room = req.room ;

	room = _.extend(room , req.body);

	room.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(room);
		}
	});
};

/**
 * Delete an Room
 */
exports.delete = function(req, res) {
	var room = req.room;

	room.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(room);
		}
	});
};

/**
 * List of Rooms
 */
exports.list = function(req, res) { 
	Room.find({}, 'ID name')
		.sort({'ID': 1})
		.exec(function(err, rooms) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(rooms);
		}
	});
};

/**
 * Room middleware
 */
exports.roomByID = function(req, res, next, id) {
	if (req.method === 'POST') return next();
	Room.findOne({ID : id }, 'ID name seats picture')
		.exec(function(err, room) {
		if (err) return next(err);
		if (! room) return next(new Error('Failed to load room ' + id));
		
		req.room = room;
		return next();
	});
};

/**
 * Room authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.room.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
