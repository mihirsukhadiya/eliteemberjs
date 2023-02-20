import mapLocate from 'gps/controllers/map';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
const options = {
  xhrFields: { withCredentials: true }
};
export default mapLocate.extend({
  currentRoute: 'history',
  datetimeHistory: service(),
  ajax: service(),
  distance: 0,
  deviceId : '',
  mapFromTime: '',
  mapToTime: '',
  dowloadLink: computed('deviceId', 'mapFromTime', 'mapToTime', function() {
    if (isEmpty(this.deviceId)) {
      return;
    }
    let dateRanges = $('#daterange').val().split("-");
    let from_time = window.moment(this.mapFromTime).format('YYYY-MM-D H:mm');
    let to_time = window.moment(this.mapToTime).format('YYYY-MM-D H:mm');
    return  this.get('ajax').host + this.get('ajax').namespace + '/reports/downloadDeviceHistory.php?device_id=' + this.deviceId + "&from_time=" + from_time + "&to_time=" + to_time;
  }),
  actions: {
    downloadExcel() {
      if (this.deviceId == '') {
        return;
      }
      let dateRanges = $('#daterange').val().split("-");
      let from_time = window.moment(dateRanges[0].trim()).format('YYYY-MM-D H:mm');
      let to_time = window.moment(dateRanges[1].trim()).format('YYYY-MM-D H:mm');
      this.get('ajax').raw('/reports/downloadDeviceHistory.php?device_id=' + this.deviceId + "&from_time=" + from_time + "&to_time=" + to_time, options);
    }
  }
});
