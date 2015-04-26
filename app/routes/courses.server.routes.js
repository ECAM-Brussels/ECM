'use strict';

module.exports = function(app) {
  var users = require('../../app/controllers/users.server.controller');
  var courses = require('../../app/controllers/courses.server.controller');
  var authorized = ['teacher', 'manager', 'admin'];

  // Courses Routes
  app.route('/courses')
    .get(users.requiresLogin, users.hasAuthorization(authorized), courses.list)
    .post(users.requiresLogin, users.hasAuthorization(authorized), courses.create);

  app.route('/list/myCourses')
    .get(users.requiresLogin, users.hasAuthorization(['teacher']), courses.listMyCourses);

  app.route('/courses/:courseId')
    .post(users.requiresLogin, users.hasAuthorization(authorized), courses.create)
    .get(users.requiresLogin, users.hasAuthorization(authorized), courses.read)
    .put(users.requiresLogin, users.hasAuthorization(authorized), courses.update)
    .delete(users.requiresLogin, users.hasAuthorization(authorized), courses.delete);

  // Finish by binding the Course middleware
  app.param('courseId', courses.courseByID);
};
