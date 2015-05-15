'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User');

/**
 * Globals
 */
var user, user2, user3;

/**
 * Unit tests
 */
describe('User Model Unit Tests:', function() {
	before(function(done) {
		user = new User({
			serial: 'JoD',
			firstName: 'John',
			lastName: 'Doe',
			displayName: 'John Doe',
			email: 'john@doe.com',
			username: 'john',
			password: 'testmenow',
			provider: 'local'
		});
		user2 = new User({
			serial: 'JoD',
			firstName: 'John',
			lastName: 'Doe',
			displayName: 'John Doe',
			email: 'john@doe.com',
			username: 'john',
			password: 'testmenow',
			provider: 'local'
		});
		user3 = new User({
			serial: 'JaD',
			firstName: 'Jane',
			lastName: 'Doe',
			displayName: 'Jane Doe',
			email: 'jane@doe.com',
			username: 'jane',
			password: 'testmenow',
			provider: 'local'
		});

		done();
	});

	describe('Method Save', function() {
		it('should begin with no users', function(done) {
			User.find({}, function(err, users) {
				users.should.have.length(0);
				done();
			});
		});

		it('should be able to save without problems', function(done) {
			user.save(done);
		});

		it('should fail to save an existing user again', function(done) {
			user.save();
			return user2.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should fail to save a user with an existing serial', function(done) {
			user.save();
			user3.serial = user.serial;
			return user3.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should fail to save a user with an existing username', function(done) {
			user.save();
			user3.username = user.username;
			return user3.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without firstname', function(done) {
			user.firstName = '';
			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without lastname', function(done) {
			user.lastName = '';
			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should fail to save a user with a password shorter than 6 characters', function(done) {
			user.password = 'testme6';
			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	after(function(done) {
		User.remove().exec();
		done();
	});
});