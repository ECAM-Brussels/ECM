'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Course Schema
 */
var CourseSchema = new Schema({
  ID: {
    type: String,
    defult: '',
    required: 'Please fill the ID like LI4C',
    trim: true,
    unique:true
  },
  coordinator: {
  	type: Schema.ObjectId,
  	ref: 'User'
  },
  activities: [{ type: Schema.ObjectId, ref: 'Activity'}],
	name: {
		type: String,
		default: '',
		required: 'Please fill Course name',
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