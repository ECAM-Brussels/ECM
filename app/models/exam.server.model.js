'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Exam schema
 */
var ExamSchema = new Schema({
	course: {
		type: Schema.ObjectId,
		ref: 'Course'
	},
	split: {
		type: Boolean,
		default: false
	},
	activities: [{
		type: Schema.ObjectId,
		ref: 'Activity'
	}],
	date: {
		type: Date,
		default: Date.now
	},
	rooms: [{
		type: Schema.ObjectId,
		ref: 'Room'
	}],
	groups: [{
		type: Schema.ObjectId,
		ref: 'Group'
	}],
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	copies: [{
		type: Schema.ObjectId,
		ref: 'Copy'
	}],
	printed: {
		type: Date,
		default: null
	},
	ready: {
		type: Boolean,
		default: false
	},
	affectation: {
		type: [new Schema({
			student: {
				type: Schema.ObjectId,
				ref: 'User'
			},
			number: {
				type: Number,
				required: true,
				default: 1
			},
			seat: {
				type: Number,
				required: true,
				default: 1
			},
			room: {
				type: Schema.ObjectId,
				ref: 'Room'
			},
			serie: {
				type: Number,
				required: true,
				default: 0
			}
		})]
	}
});

mongoose.model('Exam', ExamSchema);
