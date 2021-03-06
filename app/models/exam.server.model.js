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
	title: {
		type: String,
		default: ''
	},
	course: {
		type: Schema.ObjectId,
		ref: 'Course',
		required: 'Please specify a course for the exam'
	},
	examsession: {
		type: Schema.ObjectId,
		ref: 'ExamSession',
		required: 'Please specify an exam session for the exam'
	},
	date: {
		type: Date,
		required: 'Please specify a date for the exam',
	},
	duration: {
		type: Number,
		required: 'Please specify a duration for the exam',
	},
	rooms: {
		type: [new Schema({
			room: {
				type: Schema.ObjectId,
				ref: 'Room'
			},
			layout: {
				type: Number,
				default: 0
			},
			start: {
				type: Number,
				default: 1
			}
		})],
		default: []
	},
	copies: {
		type: [new Schema({
			name: {
				type: String,
				default: null
			},
			validated: {
				type: Boolean,
				default: false
			},
			created: {
				type: Date,
				default: null
			},
			user: {
				type: Schema.ObjectId,
				ref: 'User'
			}
		})],
		default: []
	},
	ready: {
		type: Boolean,
		default: false
	},
	printed: {
		type: Date,
		default: null
	},
	affectation: {
		type: [new Schema({
			student: {
				type: Schema.ObjectId,
				ref: 'User'
			},
			number: {
				type: Number,
				default: 1
			},
			room: {
				type: Number,
				default: 0
			}
		})],
		default: []
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

mongoose.model('Exam', ExamSchema);
