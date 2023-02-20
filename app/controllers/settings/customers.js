import Controller from '@ember/controller';
import { isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';
import { set } from '@ember/object';
import Ember from 'ember';

const options = {
  xhrFields: { withCredentials: true }
};
export default Controller.extend({
  ajax: service(),
  entityName: 'customers',
  entityNameSingular: 'customer',
  actions: {
    openEntityDetails(model) {
      if (isEmpty(model)) {
        model = {};
        set(model, 'isNew', true);
      }
      this.get('ajax').request('/devices/getUnAssignedDevices.php', options).then(({data}) => {
        model['unassigned_device'] = data.map((deviceId) => Ember.Object.create({deviceId}));
        let formData = Ember.Object.create(model);
        set(formData, 'entityName', this.entityName);
        set(formData, 'entityNameSingular', this.entityNameSingular);
        this.send('openModal', 'components/settings/app-user-details-form', { model: formData , controller: 'settings/app-user-details' });
      }).catch((response) => {
        let { jqXHR } = response;
        if (jqXHR && jqXHR.status === 302) {
          window.location.assign(window.sessionStorage.gps_website);
        } else {
          let { message } = response;
          alert('Kindly Check your Network connection. cant load unassigned devices');
          console.log(message);
        }
      });
    }
  }
});
