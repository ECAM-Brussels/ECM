'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Room Schema
 */
var RoomSchema = new Schema({
	ID: {
		type:String,
		default:'A000',
		required: 'Please choose an ID for the room',
		trim: true,
		unique: true
	},
	name: {
		type: String,
		default: '',
		required: 'Please fill the name of the room',
		trim: true
	},
	seats: {
		type:Number,
		default:0,
		required: 'Please fill the number of seats of the room',
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

mongoose.model('Room', RoomSchema);
