'use strict';

module.exports = function(app) {
  var users = require('../../app/controllers/users.server.controller');
  var activities = require('../../app/controllers/activities.server.controller');
  var authorized = ['admin', 'manager'];
  // Activities Routes
  app.route('/activities')
    .get(users.hasAuthorization(authorized), activities.list)
    .post(users.hasAuthorization(authorized), activities.create);
  
  app.route('/list/teachers')
    .get(users.hasAuthorization(authorized), activities.listTeachers);
 
  app.route('/activities/:activityId')
    .post(users.hasAuthorization(authorized), activities.create)
    .get(users.hasAuthorization(authorized), activities.read)
    .put(users.hasAuthorization(authorized), activities.update)
    .delete(users.hasAuthorization(authorized), activities.delete);

   // Finish by binding the Activity middleware
  app.param('activityId', activities.activityByID);
};
