'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Student schema
 */
var StudentSchema = new Schema({
	matricule: {
		type: Number,
		required: 'Please choose a matricule for the student',
		unique: true
	},
	firstname: {
		type: String,
		default: '',
		required: 'Please fill the firstname of the student',
		trim: true
	},
	middlenames: [{
		type: String,
		default: '',
		trim: true
	}],
	lastname: {
		type: String,
		default: '',
		required: 'Please fill the lastname of the student',
		trim: true
	},
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
	}
});

mongoose.model('Student', StudentSchema);
