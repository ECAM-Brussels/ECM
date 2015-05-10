'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Activity schema
 */
var ActivitySchema = new Schema({
	ID: {
		type: String,
		default: '',
		required: 'Please choose an ID for the course',
		trim: true,
		unique:true
	},
	name: {
		type: String,
		default: '',
		required: 'Please fill the name of the activity',
		trim: true
	},
	teachers: [{
		type: Schema.ObjectId,
		ref: 'User'
	}],
	weight: {
		type: Number,
		required: 'Please fill the number of ECTS for the activity'
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

mongoose.model('Activity', ActivitySchema);
