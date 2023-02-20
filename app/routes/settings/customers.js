import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import Ember from 'ember';

const options = {
  xhrFields: { withCredentials: true }
};
export default Route.extend({
  ajax: service(),
  endpointUrl: '/customers/getCustomersList.php',
  model() {
    let appController = this.controllerFor('application');
    appController.set('isLoading', true);
    return this.get('ajax').raw(this.endpointUrl, options).then(({ response: { data } }) =>{
      appController.set('isLoading', false);
      return data;
    }).catch((response) => {
      let { jqXHR } = response;
      if (jqXHR && jqXHR.status === 302) {
        window.location.assign(window.sessionStorage.gps_website);
      } else {
        alert('Kindly Check your Network connection. cant load customer details');
        console.log(response);
      }
    });
  },
  actions: {
    refresh() {
      this.refresh();
    }
  }
});
