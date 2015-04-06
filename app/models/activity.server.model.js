'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Activity Schema
 */
var ActivitySchema = new Schema({
  ID: {
    type: String,
    defult: '',
    required: 'Please fill the ID like LI4C',
    trim: true,
    unique:true
  },
	name: {
		type: String,
		default: '',
		required: 'Please fill Activity name',
		trim: true
	},
  teachers: [{ type: Schema.ObjectId, ref: 'User'}],
  weight: {
    type: Number,
    required: 'Please fill the number of ECTS for this activity'
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