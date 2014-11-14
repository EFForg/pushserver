/**
 * Database models for working with the push server.
 */

var lodash = require('lodash');
var sequelize = require('sequelize');

var dbConfig = require('config').get('DATABASE');
var supportedChannels = require('config').get('SUPPORTED_CHANNELS');
var db = require('./db');

var getJSONField = function(fieldName) {
  return function() {
    return JSON.parse(this.getDataValue(fieldName));
  };
};

var setJSONField = function(fieldName) {
  return function(value) {
    var dataValue = lodash.isNull(value) ? null : JSON.stringify(value);
    return this.setDataValue(fieldName, dataValue);
  };
};

// Sqlite doesn't play nicely with a bigint specified as the pk, so use a conditional to alias it
var bigIntegerPrimaryKey = db.options.dialect === 'sqlite' ? sequelize.INTEGER : sequelize.BIGINT;

var Subscriptions = db.define(
  'Subscriptions',
  {
    subscriptionId: {
      type: bigIntegerPrimaryKey,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      field: 'subscription_id'
    },
    channel: {
      type: sequelize.ENUM,
      values: supportedChannels,
      allowNull: false
    },
    // the language identifier, ideally a BCP-47 id, but could be any string
    language: {
      type: sequelize.STRING(20),
      allowNull: false
    },
    // device token for APNS, registration_id for GCM etc.
    deviceId: {
      type: sequelize.TEXT,
      allowNull: false,
      field: 'device_id'
    }
  },
  {
    tableName: 'subscriptions',
    schema: dbConfig.schema,

    indexes: [
      {
        name: 'subscriptions_device_id',
        type: 'FULLTEXT',
        unique: true,
        fields: ['device_id']
      }
    ],

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
    notificationId: {
      type: bigIntegerPrimaryKey,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      field: 'notification_id'
    },
    title: {
      type: sequelize.TEXT,
      allowNull: true
    },
    message: {
      type: sequelize.TEXT,
      allowNull: false
    },
    sound: {
      type: sequelize.TEXT,
      allowNull: true
    },
    data: {
      type: sequelize.TEXT,
      allowNull: true
    },
    channels: {
      type: sequelize.TEXT,
      allowNull: false
    },
    mode: {
      type: sequelize.ENUM,
      values: ['prod', 'sandbox'],
      allowNull: false
    },
    deviceIds: {
      type: sequelize.TEXT,
      allowNull: true,
      field: 'device_ids'
    },
    // separated out as a convenience for full-text search, dupes content in other fields
    payload: {
      type: sequelize.TEXT,
      allowNull: false
    },
    state: {
      type: sequelize.ENUM,
      values: ['pending', 'failed', 'success'],
      allowNull: false
    },
    stats: {
      type: sequelize.TEXT,
      allowNull: true
    }
  },
  {

    indexes: [

      {
        name: 'notifications_state',
        fields: ['state']
      },

      {
        name: 'notifications_payload',
        type: 'FULLTEXT',
        fields: ['payload']
      }

    ],

    getterMethods: {
      payload: getJSONField('payload'),
      data: getJSONField('data'),
      channels: getJSONField('channels'),
      deviceIds: getJSONField('deviceIds'),
      stats: getJSONField('stats')
    },

    setterMethods: {
      payload: setJSONField('payload'),
      data: setJSONField('data'),
      channels: setJSONField('channels'),
      deviceIds: setJSONField('deviceIds'),
      stats: setJSONField('stats')
    },

    instanceMethods: {
      externalize: function() {
        return {
          notificationId: this.notificationId,
          title: this.title,
          message: this.message,
          sound: this.sound,
          data: this.data,
          channels: this.channels,
          mode: this.mode,
          deviceIds: this.deviceIds,
          state: this.state,
          stats: this.stats
        };
      }
    },

    tableName: 'notifications',
    schema: dbConfig.schema
  }
);

module.exports.Notifications = Notifications;
module.exports.Subscriptions = Subscriptions;
