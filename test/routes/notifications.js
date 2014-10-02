/**
 * Tests for the notification route handlers.
 */

var assert = require('assert');

var models = require('../../db/models');
var serverRoutes = require('../../routes/routes');
var server = require('../../server');

describe('NotificationRouteHandlers', function() {

  it('should add a notification to the database', function(done) {
    var validNotification = {title: 'title', message: 'message'};
    var addNotificationOptions = {
      method: 'POST', url: serverRoutes.makePrefixedPath('notifications'), payload: validNotification};

    server.inject(addNotificationOptions, function(response) {
      //      assert.equal(validNotification.title, response.payload.title);
      models.Notifications
        .find({where: {notificationId: 1}})
        .on('success', function(notification) {
          assert.equal(1, notification.notificationId);
          done();
        });
    });
  });

  it('should get a notification from the database', function(done) {
    var getNotificationOptions = {
      method: 'GET',
      url: serverRoutes.makePrefixedPath('notifications/' + 1)
    };
    server.inject(getNotificationOptions, function(response) {
//      console.log(response);
//      assert.equal(response.payload.title, 'title');
      done();
    });
  });

  it('should get a list of notifications from the database', function(done) {
    done();
  });

});
