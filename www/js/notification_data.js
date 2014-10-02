/**
 * Controller for the push notification data widget.
 */

var PushNotificationDataDirective = function() {

  var dataTypeConverters = {
    'integer': parseInt,
    'float': parseFloat
  };

  var makePushDataRow = function() {
    return {key: '', type: 'string', value: ''};
  };

  return {
    require: 'ngModel',
    restrict: 'A',
    scope: {
      pushData: '=ngModel'
    },
    link: function(scope, elm, attrs, ctrl) {

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

      // push the (optionally) converted push data values into the notification object
      scope.$watch('dataModel.pushDataRows', function(newValue, oldValue) {
        if (_.isArray(newValue)) {
          scope.pushData = {};
          for (var i = 0, newRow, oldRow, converter, value; i < newValue.length; ++i) {
            newRow = newValue[i];
            oldRow = oldValue[i];

            // If the type is switching to / from boolean, clear the value
            if (!_.isUndefined(oldRow)) {
              if (newRow.type !== oldRow.type && (newRow.type === 'boolean' || oldRow.type === 'boolean')) {
                newRow.value = newRow.type === 'boolean' ? false : '';
              }
            }

            if (newRow.key !== '' && newRow.value !== '') {
              converter = dataTypeConverters[newRow.type];
              value = !_.isUndefined(converter) ? converter(newRow.value) : newRow.value;
              scope.pushData[newRow.key] = value;
            }
          }
        }
      }, true);
    },
    templateUrl: 'new_notification/push_data.html'
  };

};

module.exports = PushNotificationDataDirective;
