/**
 * Database models for working with the push server.
 */

var sequelize = require('sequelize');

var dbConfig = require('config').get('DATABASE');
var supportedChannels = require('config').get('SUPPORTED_CHANNELS');
var db = require('./db');

// Sqlite doesn't play nicely with a bigint specified as the pk, so use a conditional to alias it
var bigIntegerPrimaryKey = db.options.dialect === 'sqlite' ? sequelize.INTEGER : sequelize.BIGINT;

var Subscriptions = db.define(
  'Subscriptions',
  {
    subscriptionId: {type: bigIntegerPrimaryKey, primaryKey: true, autoIncrement: true},
    channel: {type: sequelize.ENUM, values: supportedChannels},
    // the language identifier, ideally a BCP-47 id, but could be any string
    language: sequelize.STRING(20),
    // device token for APNS, registration_id for GCM etc.
    deviceId: {type: sequelize.TEXT, allowNull: false, unique: true}
  },
  {
    tableName: 'subscriptions',
    schema: dbConfig.schema,

    instanceMethods: {
      externalize: function() {
        return {
          channel: this.channel,
          language: this.language,
          deviceId: this.deviceId
        };
      }
    }
  }
);

var Notifications = db.define(
  'Notifications',
  {
    notificationId: {type: bigIntegerPrimaryKey, primaryKey: true, autoIncrement: true, allowNull: false},
    payload: sequelize.TEXT
  },
  {
    getterMethods: {
      payload: function() {
        return JSON.parse(this.getDataValue('payload'));
      }
    },

    setterMethods: {
      payload: function(value) {
        return this.setDataValue('payload', JSON.stringify(value));
      }
    },

    instanceMethods: {
      externalize: function() {
        // TODO(leah): Update this to be less absurd
        return {notificationId: this.notificationId};
      }
    },

    tableName: 'notifications',
    schema: dbConfig.schema
  }
);

module.exports.Notifications = Notifications;
module.exports.Subscriptions = Subscriptions;
