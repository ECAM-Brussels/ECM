'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Copy Schema
 */
var CopySchema = new Schema({
	exam: {
		type: Schema.ObjectId,
		ref: 'Exam',
		required: 'Please fill the exam of the copy'
	},
	activity: {
		type: Schema.ObjectId,
		ref: 'Activity'
	},
	uploaded: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Copy', CopySchema);