import Controller from '@ember/controller';
import { isEmpty } from '@ember/utils';
import { set } from '@ember/object';
import Ember from 'ember';
import { inject as service } from '@ember/service';

const options = {
  xhrFields: { withCredentials: true }
};
export default Controller.extend({
  ajax: service(),
  entityName: 'devices',
  actions: {
    openVehicleDetails(model) {
      if (isEmpty(model)) {
        model = {};
        set(model, 'isNew', true);
        let formData = Ember.Object.create(model);
        this.send('openModal', 'components/device-details-form', { model: formData , controller: 'devices/device-details' });

      } else {
        this.get('ajax').request('/customers/getAssignOwnerList.php?device_id='+model.id, options).then(({data}) => {
          model['owner_list'] = data;
          let formData = Ember.Object.create(model);
          this.send('openModal', 'components/device-details-form', { model: formData , controller: 'devices/device-details' });
        }).catch((response) => {
          let { jqXHR } = response;
          if (jqXHR && jqXHR.status === 302) {
            if (isEmpty(window.sessionStorage.gps_website)) {
              window.location.reload(true);
            }
            window.location.assign(window.sessionStorage.gps_website);
          } else {
            let { message } = response;
            alert('Kindly Check your Network connection. cant load device list');
            console.log(message);
          }
        });
      }
    }
  }
});
