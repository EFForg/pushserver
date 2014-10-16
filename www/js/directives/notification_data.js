/**
 * Controller for the push notification data widget.
 */

var angular = require('angular');

var PushNotificationDataDirective = function() {

  var typeConverters = {
    'integer': parseInt,
    'float': parseFloat
  };

  // NOTE: this is doing pretty simplistic number-checking, there's no float vs integer
  //       discrimination / checks, based on user-input vs specified type.
  var isNumber = function(val) {
    return angular.isNumber(val) && !isNaN(val);
  };
  var typeCheckers = {
    'integer': isNumber,
    'float':isNumber
  }

  var makePushDataRow = function() {
    return {key: '', type: 'string', value: '', isValid: true};
  };

  return {
    require: 'ngModel',
    restrict: 'A',
    // Create a default isolate scope
    scope: {},
    templateUrl: 'ng_partials/push_data.html',
    link: function(scope, elm, attrs, ctrl) {

      ctrl.$name = 'data';

      // NOTE: This directive doesn't support decoration of an existing DOM structure - it won't
      //       pull keys out of a rendered table etc.

      scope.dataModel = {
        supportedDataTypes: ['string', 'integer', 'float', 'boolean'],
        pushDataRows: [makePushDataRow()]
      };

      scope.addDataItem = function() {
        scope.dataModel.pushDataRows.push(makePushDataRow());
      };

      scope.removeDataItem = function(index) {
        if (scope.dataModel.pushDataRows.length === 1) {
          scope.dataModel.pushDataRows[0] = makePushDataRow();
        } else {
          scope.dataModel.pushDataRows.splice(index, 1);
        }
      };

      scope.pushRowIsBoolean = function(index) {
        var rowType = scope.dataModel.pushDataRows[index].type;
        return rowType === 'boolean';
      };

      scope.handlePushDataChanges = function(newValue, oldValue) {
        if (!ctrl.$pristine) {
          var pushData = {};
          for (var i = 0, newRow, oldRow, converter, typeChecker, value; i < newValue.length; ++i) {
            newRow = newValue[i];
            oldRow = oldValue[i];

            // If the type is switching to / from boolean, clear the value
            if (angular.isDefined(oldRow)) {
              if (newRow.type !== oldRow.type && (newRow.type === 'boolean' || oldRow.type === 'boolean')) {
                newRow.value = newRow.type === 'boolean' ? false : '';
              }
            }

            if (newRow.key !== '' && newRow.value !== '') {
              converter = typeConverters[newRow.type];
              value = !angular.isUndefined(converter) ? converter(newRow.value) : newRow.value;
              typeChecker = typeCheckers[newRow.type];

              if (angular.isUndefined(typeChecker) || typeChecker(value)) {
                pushData[newRow.key] = value;
                newRow.isValid = true;
              } else {
                newRow.isValid = false;
              }
            }
          }

          ctrl.$setViewValue(pushData);
        } else {
          ctrl.$pristine = false;
        }
      };

      // push the (optionally) converted push data values into the notification object
      scope.$watch('dataModel.pushDataRows', scope.handlePushDataChanges, true);
    }
  };

};

module.exports = PushNotificationDataDirective;
