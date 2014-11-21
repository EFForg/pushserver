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

TODO: this should be systematized per EFF deploy practices and updated to a salt file or similar configuration tool.

#### Install packages

```
sudo apt-get install git
sudo apt-get install supervisor
sudo apt-get install nginx
sudo apt-get install sqlite3
```

#### Install node + npm

see https://github.com/joyent/node/wiki/installing-node.js-via-package-manager

#### Install npm dependencies

```
sudo npm install -g bower
sudo npm install -g gulp
```

#### Create pushserver user

```
sudo adduser pushserver
sudo service ssh restart
echo 'DenyUsers pushserver' | sudo tee --append /etc/ssh/sshd_config
```

#### Create pushserver directories and clone the code

As the pushserver user (<code>sudo su pushserver</code>)

```
mkdir -p ~/logs/supervisor
mkdir -p ~/logs/pushserver

git clone git@github.com:EFForg/pushserver.git
cd pushserver
git checkout tags/{tag_name}

npm install
bower install
gulp syncDb
```

#### Create required credentials

Copy over a production.json containing required Android creds to <code>/home/pushserver/pushserver/config/production.json</code>

#### Build js and css on the server

NOTE: this must happen after the prod creds have been copied over, or the app settings will be incorrectly set

As the pushserver user and from <code>/home/pushserver/pushserver</code>

```
export NODE_ENV=production
gulp build
```

#### Copy over application config files

* [nginx.conf](/deploy/nginx.conf) to <code>/etc/nginx/sites-enabled/pushserver</code>
* [supervisor.conf](/deploy/supervisor.conf) to <code>/etc/supervisor/conf.d/pushserver.conf</code>

...then restart the services to pick up the files

```
sudo service nginx restart
sudo service supervisor restart
```

#### As a sudo-capable user

```
sudo supervisorctl restart pushserver
```

#### Setup firewall rules

incoming:
* port 443

outgoing:
* port 443
* port 80
