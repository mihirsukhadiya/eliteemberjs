import Controller from '@ember/controller';
import { isEmpty, isPresent } from '@ember/utils';
import { set, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Ember from 'ember';
import { oneWay, not }from '@ember/object/computed';

const options = {
  xhrFields: { withCredentials: true },
  method: 'POST'
};
export default Controller.extend({
  ajax: service(),
  appMeta: service(),
  isNew: oneWay('model.isNew'),
  isEdit: not('model.isNew'),
  modalTitle:computed('model.entityNameSingular', function() {
    return this.model.entityNameSingular + ' details';
  }),
  validateFormData(formData) {
    let errorMsg = [];

    if (!formData.phone_number) {
      errorMsg.push("Phone number is mandatory");
    }

    if (isPresent(formData.phone_number)) {
      this.ajax.validatePhoneNumber(formData.phone_number) ? 1 : errorMsg.push("enter valid phone number");
    }

    if (this.isNew) {
      if (!formData.password) {
        errorMsg.push("password is mandatory");
      }
      else if (formData.password.length > 20) {
        errorMsg.push("Password is too long. Max characters is 20");
      }
      if (isEmpty(formData.assign_devices)) {
        errorMsg.push("assign atleast one device to the customer");
      }
    }


    if (isPresent(formData.name)) {
      if (formData.name.length > 25) {
        errorMsg.push("Name is too long. Max characters is 25");
      }
    }
    return errorMsg;
  },

  serialiseFormData(params) {
    let unassigned_device = this.model.unassigned_device || [];
    unassigned_device = unassigned_device.filterBy('checked') || [];
    set(this.model, 'assign_devices', unassigned_device.mapBy('deviceId') || []);
    return this.ajax.serialise(JSON.parse(JSON.stringify( this.model)), params);
  },

  actions: {
    saveRecord() {
      let { isNew, entityName } = this.model;
      let url = '';
      let params = [];
      if (isNew) {
        url = "/".concat(entityName.concat("/create.php"));
        params = ['name', 'phone_number', 'password', 'email_id', 'assign_devices'];
      } else {
        url = "/".concat(entityName.concat("/update.php"));
        params = ['id', 'name', 'phone_number', 'email_id', 'assign_devices'];
      }
      let serialisedData = this.serialiseFormData(params);
      let errorMsgs = [];
      if ((errorMsgs = this.validateFormData(serialisedData)).length == 0) {
        options["data"] = { 'data': JSON.stringify(serialisedData) };
        this.set('isModalLoading', true);
        return this.get('ajax').request(url, options).then(({ message }) => {
          this.send('closeModal');
          if (this.isNew) {
            this.send('notifySuccess', this.model.entityNameSingular + ' has been added');
          } else {
            this.send('notifySuccess', this.model.entityNameSingular + ' has been updated');
          }
          this.get('target').send('refresh');
        }).catch((response) => {
          let { jqXHR } = response;
          if (jqXHR && jqXHR.status === 302) {
            window.location.assign(window.sessionStorage.gps_website);
          } else {
            let { payload } = response;
            if (payload == null) {
              this.set('model.errors', ["cant create user. kindly check your internet"]);
            } else {
              let message = payload.message || errorMsg.message;
              this.set('model.errors', [message]);
            }
          }
        }).finally(() => {
          this.set('isModalLoading', false);
        });
      } else {
        this.set('model.errors', errorMsgs);
      }
    }
  }
});
