Push Server
============

## Update config settings

Check that you've updated [your configuration settings](/config/production.json) file to reflect the correct values:

* Delete or remove the local.json file in the config directory. Otherwise this will overwrite the values in production.json
* <code>SERVER</code>
  * <code>PORT</code> the port the server should bind to in production
  * <code>URL</code> the URL the server should run on in production
* <code>CREDENTIALS</code>
  * <code>GCM</code>
    * <code>PROJECT_ID</code> the id of the [Google Developers Console project](https://cloud.google.com/console) project this push server is associated with
    * <code>API_KEY</code> the API key from the <code>APIs & Auth > Credentials</code> of the Google Developers Console project
  * <code>APNS</code>
    * <code>CERT_FILE</code> the location of your APNS certificate
    * <code>KEY_FILE</code> the location of your APNS key file
* <code>DATABASE</code> the database configuration object, see the [Sequelize Options documentation](http://sequelizejs.com/docs/1.7.8/usage#options) for full details
* <code>SUPPORTED_CHANNELS</code> the channels the push server should support sending to, e.g. ["APNS"] to only support iOS push notifications
* <code>APPLICATION</code>
  * <code>NAME</code> the name of the pushserver instance, e.g. EFF Push
  * <code>CSS_APP_URL</code> the location of the .css file containing application CSS
  * <code>JS_APP_URL</code> the location of the .js file containing application javascript
  * <code>JS_LIBS_URL</code> the location of the .js file containing required 3rd party javascript libraries
  * <code>API_VERSION</code> the API version the pushserver instance publishes

## Security

Check that the app has been secured so that the api/{version}/notifications endpoints and the webapp are not accessible to the public internet. Anyone with access to those endpoints can send notifications to all subscribed users.

## Deploying the app to production

TODO(mark/leah): Update this following deploy discussion
