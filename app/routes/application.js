import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { run } from '@ember/runloop';

const options = {
  xhrFields: { withCredentials: true }
};
export default Route.extend({
  ajax: service(),
  appMeta: service(),
 afterModel(transition) {
    this._super(...arguments);
     $("#app-loader").remove();
  },
  model() {
    return this.get('ajax').raw('/meta.php', options).then(({ response: { data } }) => {
      this.appMeta.setProperties(data);
    }).catch((response) => {
      if (response.jqXHR && response.jqXHR.status === 302) {
        window.location.assign(window.sessionStorage.gps_website);
      } else {
        alert('Kindly Check your Network connection. cant load meta');
        console.log(response);
      }
    });
  },
  actions: {
    openModal(templateModalName, modalOptions = {}) {
      return this.render(templateModalName, {
        into: 'application',
        outlet: 'modal',
        model: modalOptions.model,
        controller: (modalOptions.controller) ? this.controllerFor(modalOptions.controller) : ''
      });
    },
    closeModal() {
      return this.disconnectOutlet({
        outlet: 'modal',
        parentView: 'application'
      });
    },
    notifySuccess(message) {
      this.send('closeModal');
      this.send('openModal', 'components/notification/notify', {model: { message, isSuccess: true }});
    },
    notifyError(message) {
      this.send('closeModal');
      this.send('openModal', 'components/notification/notify', {model: { message, isSuccess: false }});
    }
  }
});
