'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Group schema
 */
var GroupSchema = new Schema({
	name: {
		type: String,
		required: 'Please fill the name of the group'
	},
	description: {
		type: String,
		default: ''
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

mongoose.model('Group', GroupSchema);
