'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Student Schema
 */
var StudentSchema = new Schema({
  matricule: {
    type: Number,
    required: 'Please fill the matricule',
    unique: true
  },
  first_name: {
    type: String,
    default: '',
    required: 'Please fill Student first name',
    trim: true
  },
  middle_names: [{
    type: String,
    default: '',
    trim: true
  }],
  last_name: {
    type: String,
    default: '',
    required: 'Please fill Student lastname',
    trim: true
  },
  groups: [{
    type: String,
    default: '',
    trime: true
  }],
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Student', StudentSchema);