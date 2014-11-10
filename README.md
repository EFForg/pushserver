push server
============

Hapi server app for creating and distributing push notifications

# Getting started

```
npm install
gulp bower
gulp build
```

# Running the server

Start the hapi server and set up watches on templates, js and css

```
gulp watch
```

# Run tests

```
gulp test
```

# API

## [Notifications](https://github.com/EFForg/pushserver/blob/master/routes/notifications.js)

- **<code>POST</code> /api/v1/notifications** - adds a new notification to the database and publishes it to all attached channels
- **<code>GET</code> /api/v1/notification/{notificationId}** - fetches the notification matching notificationId
- **<code>POST</code> /api/v1/notifications/search** - fetches all notifications matching the supplied search object

## [Subscriptions](https://github.com/EFForg/pushserver/blob/master/routes/subscriptions.js)

- **<code>POST</code> /api/v1/subscriptions** - adds a new subscription and subscribes that user to notifications from their preferred channel(s)
- **<code>DELETE</code> /api/v1/subscriptions** - deletes a subscription
