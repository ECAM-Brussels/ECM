'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Exam Schema
 */
var ExamSchema = new Schema({
  course: {
    type: Schema.ObjectId,
    ref: 'Course'
  },
  activities: [{ type: Schema.ObjectId, ref: 'Activity' }],
  date: {
    type: Date,
    default: Date.now
  },
  rooms: [{ type: Schema.ObjectId, ref: 'Room'}],
  groups: [{
    type: String,
    trim: true
  }],
	name: {
		type: String,
		default: '',
		required: 'Please fill Exam name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
  affectation: [{
    type: Schema.Types.Mixed
  }]
});

mongoose.model('Exam', ExamSchema);
