'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Exam = mongoose.model('Exam'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, exam;

/**
 * Exam routes tests
 */
/*describe('Exam CRUD tests', function() {
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

		// Save a user to the test db and create new Exam
		user.save(function() {
			exam = {
				name: 'Exam Name'
			};

			done();
		});
	});

	it('should be able to save Exam instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Exam
				agent.post('/exams')
					.send(exam)
					.expect(200)
					.end(function(examSaveErr, examSaveRes) {
						// Handle Exam save error
						if (examSaveErr) done(examSaveErr);

						// Get a list of Exams
						agent.get('/exams')
							.end(function(examsGetErr, examsGetRes) {
								// Handle Exam save error
								if (examsGetErr) done(examsGetErr);

								// Get Exams list
								var exams = examsGetRes.body;

								// Set assertions
								(exams[0].user._id).should.equal(userId);
								(exams[0].name).should.match('Exam Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Exam instance if not logged in', function(done) {
		agent.post('/exams')
			.send(exam)
			.expect(401)
			.end(function(examSaveErr, examSaveRes) {
				// Call the assertion callback
				done(examSaveErr);
			});
	});

	it('should not be able to save Exam instance if no name is provided', function(done) {
		// Invalidate name field
		exam.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Exam
				agent.post('/exams')
					.send(exam)
					.expect(400)
					.end(function(examSaveErr, examSaveRes) {
						// Set message assertion
						(examSaveRes.body.message).should.match('Please fill Exam name');
						
						// Handle Exam save error
						done(examSaveErr);
					});
			});
	});

	it('should be able to update Exam instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Exam
				agent.post('/exams')
					.send(exam)
					.expect(200)
					.end(function(examSaveErr, examSaveRes) {
						// Handle Exam save error
						if (examSaveErr) done(examSaveErr);

						// Update Exam name
						exam.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Exam
						agent.put('/exams/' + examSaveRes.body._id)
							.send(exam)
							.expect(200)
							.end(function(examUpdateErr, examUpdateRes) {
								// Handle Exam update error
								if (examUpdateErr) done(examUpdateErr);

								// Set assertions
								(examUpdateRes.body._id).should.equal(examSaveRes.body._id);
								(examUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Exams if not signed in', function(done) {
		// Create new Exam model instance
		var examObj = new Exam(exam);

		// Save the Exam
		examObj.save(function() {
			// Request Exams
			request(app).get('/exams')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Exam if not signed in', function(done) {
		// Create new Exam model instance
		var examObj = new Exam(exam);

		// Save the Exam
		examObj.save(function() {
			request(app).get('/exams/' + examObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', exam.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Exam instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Exam
				agent.post('/exams')
					.send(exam)
					.expect(200)
					.end(function(examSaveErr, examSaveRes) {
						// Handle Exam save error
						if (examSaveErr) done(examSaveErr);

						// Delete existing Exam
						agent.delete('/exams/' + examSaveRes.body._id)
							.send(exam)
							.expect(200)
							.end(function(examDeleteErr, examDeleteRes) {
								// Handle Exam error error
								if (examDeleteErr) done(examDeleteErr);

								// Set assertions
								(examDeleteRes.body._id).should.equal(examSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Exam instance if not signed in', function(done) {
		// Set Exam user 
		exam.user = user;

		// Create new Exam model instance
		var examObj = new Exam(exam);

		// Save the Exam
		examObj.save(function() {
			// Try deleting Exam
			request(app).delete('/exams/' + examObj._id)
			.expect(401)
			.end(function(examDeleteErr, examDeleteRes) {
				// Set message assertion
				(examDeleteRes.body.message).should.match('User is not logged in');

				// Handle Exam error error
				done(examDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Exam.remove().exec();
		done();
	});
});*/