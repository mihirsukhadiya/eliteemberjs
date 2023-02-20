import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import Ember from 'ember';

const options = {
  xhrFields: { withCredentials: true }
};
export default Route.extend({
  ajax: service(),
  model() {
    let appController = this.controllerFor('application');
    appController.set('isLoading', true);
    return this.get('ajax').raw('/devices/getInstalledDevices.php', options).then(({ response: { data } }) =>{
      appController.set('isLoading', false);
      return data;
    }).catch((response) => {
      let { jqXHR } = response;
      if (jqXHR && jqXHR.status === 302) {
        window.location.assign(window.sessionStorage.gps_website);
      } else {
        console.log(response);
        alert('Kindly Check your Network connection. cant load device list');
      }
    });
  }
});
