import Controller from '@ember/controller';
import ENV from '../config/environment';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

const options = {
  xhrFields: { withCredentials: true }
};
export default Controller.extend({
  currentRoute: 'map',
  queryParams: ['category'],
  ajax: service(),
  rootURL: ENV.rootURL,
  deviceId: '',
  actions: {
    calculateDistance(deviceId) {
      this.set('distanceLoading', true);
      this.get('ajax').request('/reports/getDistanceCoveredToday.php?device_id=' + this.deviceId, options).then(({distance}) => {
        this.set('distanceLoading', false);
        this.set('distance', distance + " Km");
      }).catch((response) => {
        let { jqXHR } = response;
        if (jqXHR && jqXHR.status === 302) {
          window.location.assign(window.sessionStorage.gps_website);
        } else {
          let { message } = response;
          alert('Kindly Check your Network connection. cant load distance');
          console.log(message);
        }
      }).finally(() => {
        this.set('distanceLoading', false);
      });
    }
  }
});
