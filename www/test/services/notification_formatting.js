//formatDeviceIds
describe('Unit: Notification Formatting Service', function() {

  beforeEach(module('PushNotificationApp'));

  var notificationFormatting;
  beforeEach(inject(function(_notificationFormatting_) {
    notificationFormatting = _notificationFormatting_;
  }));

  it('should get a friendly channel', function() {
    var friendlyChannel = notificationFormatting.getFriendlyChannel('APNS');
    assert.deepEqual(friendlyChannel, 'iOS');
  });

  it('should convert unfriendly channels to friendly', function() {
    var friendlyChannels = notificationFormatting.friendlyChannels(['APNS', 'FCM']);
    assert.deepEqual(friendlyChannels, ['iOS', 'Android']);
  });

  it('should format a device id string to an array', function() {
    var deviceIdsArr = notificationFormatting.formatDeviceIds('hat\ncat\nrat');
    assert.deepEqual(deviceIdsArr, ['hat', 'cat', 'rat']);
  });

});
