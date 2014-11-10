/**
 * Routing file for handling inbound requests.
 */


var baseRoutes = [

  {
    path: '/',
    method: 'GET',
    handler: function(request, reply) {
      reply.view('index', require('config').get('APPLICATION'));
    }
  }

];

var staticRoutes = [

  {
    method: 'GET',
    path: '/static/{filename}',
    handler: {
      directory: {
        path: '.',
        listing: false,
        index: false
      }
    }
  }

];

var allRoutes = baseRoutes.concat(
  staticRoutes,
  require('./notifications/routes'),
  require('./subscriptions/routes')
);


module.exports.routes = allRoutes;
