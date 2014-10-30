/**
 * Tests for the notification route handlers.
 */

var assert = require('assert');
var lodash = require('lodash');
var querystring = require('querystring');
var sinon = require('sinon');

var models = require('../../db/models');
var routeUtils = require('../../routes/route_utils');
var server = require('../../server');

describe('NotificationRouteHandlers', function() {

  var validNotification = {title: 'title', message: 'message'};

  var dispatchPushNotificationMock;

  before(function() {
    dispatchPushNotificationMock = sinon.mock(server.methods)
      .expects('dispatchPushNotification').once();
  });

  after(function() {
    dispatchPushNotificationMock.verify();
  });

  it('should add a notification to the database', function(done) {
    var addNotificationOptions = {
      method: 'POST',
      url: routeUtils.makePrefixedPath('notifications'),
      payload: validNotification
    };

    server.inject(addNotificationOptions, function(response) {
      assert.equal(response.result.title, validNotification.title);

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
      url: routeUtils.makePrefixedPath('notifications/' + 1)
    };
    server.inject(getNotificationOptions, function(response) {
      assert.equal(response.result.title, validNotification.title);
      done();
    });
  });

  var getNotificationsQuery = {
    draw: '1',
    columns: [{data: 'notificationId'}],
    order: [{column: '0', dir: 'asc'}],
    start: '0',
    length: '10',
    search: {value: '', regex: 'false'}
  };

  it('should get a list of notifications from the database', function(done) {
    var getNotificationsOptions = {
      method: 'POST',
      url: routeUtils.makePrefixedPath('notifications', 'search'),
      payload: getNotificationsQuery
    };

    server.inject(getNotificationsOptions, function(response) {
      var result = response.result;
      assert.equal(result.recordsTotal, 1);
      assert.equal(result.data[0].notificationId, 1);
      done();
    });
  });

  it('should return an empty array of notifications for a pagination miss', function(done) {
    var emptyNotificationsQuery = lodash.cloneDeep(getNotificationsQuery);
    emptyNotificationsQuery.start = 5;

    var getNotificationsOptions = {
      method: 'POST',
      url: routeUtils.makePrefixedPath('notifications', 'search'),
      payload: emptyNotificationsQuery
    };

    server.inject(getNotificationsOptions, function(response) {
      assert.equal(response.result.recordsFiltered, 1);
      assert.equal(response.result.data.length, 0);
      done();
    });
  });


});
