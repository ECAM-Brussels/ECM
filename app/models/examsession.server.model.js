'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * ExamSession Schema
 */
var ExamSessionSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please choose a name for the exam session',
		trim: true
	},
	description: {
		type: String,
		default: '',
		trim: true
	},
	from: {
		type: Date,
		required: 'Please choose a start date for the exam session'
	},
	to: {
		type: Date,
		required: 'Please choose an end date for the exam session'
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

mongoose.model('ExamSession', ExamSessionSchema);
