push server
============

Hapi server app for creating and distributing push notifications

## Table of Contents

* [Getting Started](#getting-started)
* [Running the server](#running-the-server)
* [App Configuration](#app-configuration)
* [Run tests](#run-tests)
* [API](#api)
  * [Notifications](#notifications)
  * [Subscriptions](#subscriptions)
  * [Errors](#errors)
* [Angular App](#angular-app)

## Getting Started

```
npm install
gulp bower
gulp build
```

## Running the server

Start the hapi server and set up watches on templates, js and css

```
gulp watch
```

## App Configuration

App config is controlled via the [node-config](https://github.com/lorenwest/node-config) module.

To set push credentials, create a local.json file under the [config dir](/config) and override the CREDENTIALS setting.

Alternately, you can use:
* [Environment variables](https://github.com/lorenwest/node-config/wiki/Environment-Variables)
* [Command line options](https://github.com/lorenwest/node-config/wiki/Command-Line-Overrides)


## Run tests

```
gulp test
```

## API

### [Notifications](/routes/notifications)

- [**<code>POST</code> /api/v1/notifications**](/routes/notifications/add_notification.js) - adds a new notification to the database and publishes it to all attached channels
- [**<code>GET</code> /api/v1/notification/{notificationId}**](/routes/notifications/get_notification.js) - fetches the notification matching notificationId
- [**<code>POST</code> /api/v1/notifications/search**](/routes/notifications/get_notifications.js) - fetches all notifications matching the supplied search object

See the [schema object](/routes/notifications/validation.js) for details of the object structure these endpoints accept

### [Subscriptions](/routes/subscriptions)

- [**<code>POST</code> /api/v1/subscriptions**](/routes/subscriptions/add_subscription.js) - adds a new subscription and subscribes that user to notifications from their preferred channel(s)
- [**<code>DELETE</code> /api/v1/subscriptions/{deviceId}**](/routes/subscriptions/delete_subscription.js) - deletes a subscription

See the [schema object](/routes/subscriptions/validation.js) for details of the object structure these endpoints accept

### [Errors](/routes/errors)

- [**<code>POST</code> /api/v1/errors**](/routes/errors/log_error.js) - Logs a client-side error to the server logs

See the [schema object](/routes/errors/validation.js) for details of the object structure these endpoints accept

## Angular app

See the [www/README.md](/www/README.md) for details
