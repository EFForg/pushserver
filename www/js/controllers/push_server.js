/**
 * Top level controller wrapping the push server single page app.
 */

var PushServerController = function($scope) {

  $scope.activeState = '';

  var handleStateChange = function(event, toState) {
    $scope.activeState = toState.name;
  };

  $scope.$on('$stateChangeSuccess', handleStateChange);

};

module.exports = PushServerController;
