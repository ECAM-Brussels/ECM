'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Room schema
 */
var RoomSchema = new Schema({
	ID: {
		type:String,
		required: 'Please choose an ID for the room',
		trim: true,
		unique: true
	},
	name: {
		type: String,
		required: 'Please fill the name of the room',
		trim: true
	},
	seats: {
		type: Number,
		required: 'Please fill the number of seats of the room',
		trim: true
	},
	picture: {
		type: Boolean,
		default: false
	},
	map: {
		type: Boolean,
		default: false
	},
	configuration: {
		type: [new Schema({
			name: {
				type: String,
				unique: true
			},
			seats: {
				type: [new Schema({
					seat: {
						type: Number,
						default: 1
					},
					serie: {
						type: Number,
						default: 0
					}
				})],
				default: []
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

mongoose.model('Room', RoomSchema);
