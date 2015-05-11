'use strict';

module.exports = function(app) {
  var users = require('../../app/controllers/users.server.controller');
  var courses = require('../../app/controllers/courses.server.controller');
  var authorized = ['manager', 'admin'];

  // Courses Routes
  app.route('/courses')
    .get(users.hasAuthorization(authorized), courses.list)
    .post(users.hasAuthorization(authorized), courses.create);

  app.route('/list/myCourses')
    .get(users.hasAuthorization(['teacher']), courses.listMyCourses);

  app.route('/courses/:courseId')
    .post(users.hasAuthorization(authorized), courses.create)
    .get(users.hasAuthorization(['manager', 'admin', 'teacher']), courses.read)
    .put(users.hasAuthorization(authorized), courses.update)
    .delete(users.hasAuthorization(authorized), courses.delete);

  // Finish by binding the Course middleware
  app.param('courseId', courses.courseByID);
};
