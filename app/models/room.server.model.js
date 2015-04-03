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
    default:'0A00',
    required: 'ID cannot be null',
    trim: true
  },
  name: {
    type: String,
    default: '',
    required: 'Please fill Room name',
    trim: true
  },
  seats: {
    type:Number,
    default:0,
    required: 'There must be seats',
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
