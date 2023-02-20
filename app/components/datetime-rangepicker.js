/* eslint-disable ember/no-global-jquery */
import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  datetimeHistory: service(),
  didInsertElement() {
    var _datetimeHistory = this.datetimeHistory;
    $(function() {
      var start = _datetimeHistory.from_time;
      var end = _datetimeHistory.to_time;
      $('#input-date').daterangepicker({
        timePicker: true,
        opens: 'right',
        locale: {
          format: 'DD/MM/YYYY hh:mm A'
        },
        startDate: start,
        endDate: end,
        ranges: {
          'last 2 hrs': [moment().subtract(2, 'hours'), moment()],
          'last 4 hrs': [moment().subtract(4, 'hours'), moment()],
          'last 8 hrs': [moment().subtract(8, 'hours'), moment()],
          'last 12 hrs': [moment().subtract(12, 'hours'), moment()]
        },
        maxSpan: {
          hours: 18
        },
      }, function(start, end) {
        $('#daterange').val(start.format('MMM D, YYYY hh:mm A') + ' - ' + end.format('MMM D, YYYY hh:mm A'));
      });
      $('#daterange').val(start.format('MMM D, YYYY hh:mm A') + ' - ' + end.format('MMM D, YYYY hh:mm A'));
    });
  }
});
