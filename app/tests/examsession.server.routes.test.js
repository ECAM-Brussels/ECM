'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ExamSession = mongoose.model('ExamSession'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, session;

/**
 * Session routes tests
 */
/*describe('Session CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Session
		user.save(function() {
			session = {
				name: 'Session Name'
			};

			done();
		});
	});

	it('should be able to save Session instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Session
				agent.post('/sessions')
					.send(session)
					.expect(200)
					.end(function(sessionSaveErr, sessionSaveRes) {
						// Handle Session save error
						if (sessionSaveErr) done(sessionSaveErr);

						// Get a list of Sessions
						agent.get('/sessions')
							.end(function(sessionsGetErr, sessionsGetRes) {
								// Handle Session save error
								if (sessionsGetErr) done(sessionsGetErr);

								// Get Sessions list
								var sessions = sessionsGetRes.body;

								// Set assertions
								(sessions[0].user._id).should.equal(userId);
								(sessions[0].name).should.match('Session Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Session instance if not logged in', function(done) {
		agent.post('/sessions')
			.send(session)
			.expect(401)
			.end(function(sessionSaveErr, sessionSaveRes) {
				// Call the assertion callback
				done(sessionSaveErr);
			});
	});

	it('should not be able to save Session instance if no name is provided', function(done) {
		// Invalidate name field
		session.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Session
				agent.post('/sessions')
					.send(session)
					.expect(400)
					.end(function(sessionSaveErr, sessionSaveRes) {
						// Set message assertion
						(sessionSaveRes.body.message).should.match('Please fill Session name');
						
						// Handle Session save error
						done(sessionSaveErr);
					});
			});
	});

	it('should be able to update Session instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Session
				agent.post('/sessions')
					.send(session)
					.expect(200)
					.end(function(sessionSaveErr, sessionSaveRes) {
						// Handle Session save error
						if (sessionSaveErr) done(sessionSaveErr);

						// Update Session name
						session.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Session
						agent.put('/sessions/' + sessionSaveRes.body._id)
							.send(session)
							.expect(200)
							.end(function(sessionUpdateErr, sessionUpdateRes) {
								// Handle Session update error
								if (sessionUpdateErr) done(sessionUpdateErr);

								// Set assertions
								(sessionUpdateRes.body._id).should.equal(sessionSaveRes.body._id);
								(sessionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Sessions if not signed in', function(done) {
		// Create new Session model instance
		var sessionObj = new Session(session);

		// Save the Session
		sessionObj.save(function() {
			// Request Sessions
			request(app).get('/sessions')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Session if not signed in', function(done) {
		// Create new Session model instance
		var sessionObj = new Session(session);

		// Save the Session
		sessionObj.save(function() {
			request(app).get('/sessions/' + sessionObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', session.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Session instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Session
				agent.post('/sessions')
					.send(session)
					.expect(200)
					.end(function(sessionSaveErr, sessionSaveRes) {
						// Handle Session save error
						if (sessionSaveErr) done(sessionSaveErr);

						// Delete existing Session
						agent.delete('/sessions/' + sessionSaveRes.body._id)
							.send(session)
							.expect(200)
							.end(function(sessionDeleteErr, sessionDeleteRes) {
								// Handle Session error error
								if (sessionDeleteErr) done(sessionDeleteErr);

								// Set assertions
								(sessionDeleteRes.body._id).should.equal(sessionSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Session instance if not signed in', function(done) {
		// Set Session user 
		session.user = user;

		// Create new Session model instance
		var sessionObj = new Session(session);

		// Save the Session
		sessionObj.save(function() {
			// Try deleting Session
			request(app).delete('/sessions/' + sessionObj._id)
			.expect(401)
			.end(function(sessionDeleteErr, sessionDeleteRes) {
				// Set message assertion
				(sessionDeleteRes.body.message).should.match('User is not logged in');

				// Handle Session error error
				done(sessionDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Session.remove().exec();
		done();
	});
});*/