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
    split: {
        type: Boolean,
        default: false
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
    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    copies: [{
        type: Schema.ObjectId,
        ref: 'Copy'
    }]
});

mongoose.model('Exam', ExamSchema);
