'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Course schema
 */
var CourseSchema = new Schema({
	ID: {
		type: String,
		default: '',
		required: 'Please choose an ID for the course',
		trim: true,
		unique: true
	},
	coordinator: {
		type: Schema.ObjectId,
		ref: 'User',
		required: 'Please fill the coordinator of the course'
	},
	activities: [{
		type: Schema.ObjectId,
		ref: 'Activity'
	}],
	name: {
		type: String,
		default: '',
		required: 'Please fill the name of the course',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Course', CourseSchema);
