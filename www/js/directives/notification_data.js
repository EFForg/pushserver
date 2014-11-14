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
  };

  var makePushDataRow = function() {
    return {
      key: '',
      type: 'string',
      value: '',
      isValid: true,
      validationMessage: ''
    };
  };

  /**
   * Reserved field names - these are typically used by other push form fields.
   * @type {Array}
   */
  var reservedFieldNames = [
    'url',
    'title',
    'message'
  ];

  return {
    require: 'ngModel',
    restrict: 'A',
    // Create a default isolate scope
    scope: {},
    templateUrl: 'ng_partials/directives/push_data.html',
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

      /**
       * Checks whether the data row is for a boolean data item.
       */
      scope.pushRowIsBoolean = function(index) {
        var rowType = scope.dataModel.pushDataRows[index].type;
        return rowType === 'boolean';
      };

      /**
       * Validates the data value is valid for the chosen type and type-coerces it to that type.
       */
      scope.coerceAndCheckValue = function(row, pushData) {
        if (reservedFieldNames.indexOf(row.key.toLowerCase()) !== -1) {
          row.isValid = false;
          row.validationMessage = row.key + ' is not a valid key name';
        } else if (row.key !== '' && row.value !== '') {
          var converter = typeConverters[row.type];
          var value = !angular.isUndefined(converter) ? converter(row.value) : row.value;
          var typeChecker = typeCheckers[row.type];

          if (angular.isUndefined(typeChecker) || typeChecker(value)) {
            pushData[row.key] = value;
            row.isValid = true;
          } else {
            row.isValid = false;
          }
        } else {
          row.isValid = true;
        }
      };

      /**
       * Handles changes to the data array and updates the view value.
       * @param newValue The new value for scope.dataModel.pushDataRows.
       * @param oldValue The old value for scope.dataModel.pushDataRows.
       */
      scope.handlePushDataChanges = function(newValue, oldValue) {
        if (!ctrl.$pristine) {
          var pushData = {};
          for (var i = 0, newRow, oldRow; i < newValue.length; ++i) {
            newRow = newValue[i];
            oldRow = oldValue[i];

            // If the type is switching to / from boolean, clear the value
            if (angular.isDefined(oldRow)) {
              if (newRow.type !== oldRow.type &&
                (newRow.type === 'boolean' || oldRow.type === 'boolean')) {
                newRow.value = newRow.type === 'boolean' ? false : '';
              }
            }

            scope.coerceAndCheckValue(newRow, pushData);
          }

          ctrl.$setViewValue(pushData);
        } else {
          ctrl.$pristine = false;
        }
      };

      scope.$watch('dataModel.pushDataRows', scope.handlePushDataChanges, true);
    }
  };

};

module.exports = PushNotificationDataDirective;
