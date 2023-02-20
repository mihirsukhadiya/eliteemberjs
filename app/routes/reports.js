import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import Ember from 'ember';
import { set } from '@ember/object';
const options = {
  xhrFields: { withCredentials: true }
};

export default Route.extend({
  ajax: service(),
  model() {
    let appController = this.controllerFor('application');
    appController.set('isLoading', false);
    /*let appController = this.controllerFor('application');
    appController.set('isLoading', true);
    return this.get('ajax').raw('reports/getVehicleStatusSummary.php', options).then(({ response: { data }}) => {
      appController.set('isLoading', false);
      return data;
    }).catch((response) => {
      if (response.jqXHR && response.jqXHR.status === 302) {
        window.location.assign(window.sessionStorage.gps_website);
      } else {
        alert('Kindly Check your Network connection. cant load reports')
        console.log(response);
      }
    });*/
  }
});
