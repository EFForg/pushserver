/**
 * Utility functions for the notification routes.
 */

var getNotificationFindCriteria = function(query) {
  // NOTE: due to its complexity and the fact it's a 3rd-party lib, the getNotifications query
  //       isn't Joi-validated
  var search = query.search.value;

  var findCriteria = {
    offset: parseInt(query.start),
    limit: parseInt(query.length),
    order: query.order.map(function(order) {
      return [query.columns[order.column].data, order.dir];
    })
  };

  if (search !== '') {
    findCriteria.where = ['payload LIKE %' + search + '%']
  }

  return findCriteria;
};

module.exports.getNotificationFindCriteria = getNotificationFindCriteria;
