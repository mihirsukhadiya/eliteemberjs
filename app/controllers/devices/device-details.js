import Controller from '@ember/controller';
import { isEmpty, isPresent } from '@ember/utils';
import { set } from '@ember/object';
import { inject as service } from '@ember/service';
import { not }from '@ember/object/computed';

const options = {
  xhrFields: { withCredentials: true },
  method: 'POST'
};
export default Controller.extend({
  ajax: service(),
  appMeta: service(),
  isEdit: not('model.isNew'),
  validateFormData(formData) {
    let errorMsg = [];
    if (!formData.id) {
      errorMsg.push("Device Id is mandatory");
    }

    if (isPresent(formData.vehicle_no) && formData.vehicle_no.length > 15) {
      errorMsg.push("vehicle Number is too long. Max characters is 15");
    }

    if (isPresent(formData.driver_name)) {
      if (formData.driver_name.length > 25) {
        errorMsg.push("Driver Name is too long. Max characters is 25");
      }
    }

    if (isPresent(formData.vehicle_type)) {
      if (formData.vehicle_type.length > 15) {
        errorMsg.push("Vehicle type is too long. Max characters is 15");
      }
    }

    if (isPresent(formData.driver_phone)) {
      this.ajax.validatePhoneNumber(formData.driver_phone) ? 1 : errorMsg.push("enter valid phone number");
    }

    return errorMsg;
  },

  actions: {
    setSelection(owner_name) {
      set(this.model,'vehicle_type', owner_name);
    },
    saveRecord() {
      let { isNew } = this.model;
      let url = '';
      let params = [];
      if (isNew) {
        url = '/devices/create.php';
        params = ['id'];
      } else {
        url = '/devices/update.php';
        params = ['id', 'vehicle_no', 'vehicle_type', 'owner_id', 'driver_name', 'driver_phone', 'is_installed'];
      }

      let serialisedData = this.ajax.serialise(JSON.parse(JSON.stringify( this.model)), params);
      let errorMsgs = [];
      if ((errorMsgs = this.validateFormData(serialisedData)).length == 0) {
        options["data"] = { 'data': JSON.stringify(serialisedData) };
        this.set('isModalLoading', true);
        return this.get('ajax').request(url, options).then(({message}) => {
          this.send('closeModal');
          if (this.model.isNew) {
            this.send('notifySuccess', 'device has been added');
          } else {
            this.send('notifySuccess', 'device has been updated');
          }
          this.get('target').send('refresh');
        }).catch((response) => {
          let { jqXHR } = response;
          if (jqXHR && jqXHR.status === 302) {
            if (isEmpty(window.sessionStorage.gps_website)) {
              window.location.reload(true);
            }
            window.location.assign(window.sessionStorage.gps_website);
          } else {
            let { payload } = response;
            if (payload == null) {
              this.set('model.errors', ["cant create device. kindly check your internet"]);
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
