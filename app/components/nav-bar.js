import Component from '@ember/component';
import ENV from '../config/environment';
import { inject as service } from '@ember/service';

const options = {
  xhrFields: { withCredentials: true }
};
export default Component.extend({
  rootURL: ENV.rootURL,
  classNames: ["top-nav-bar"],
  appMeta: service(),
  ajax: service(),
  currentTab: '',
  actions: {
    routeChanged(currentRoute) {
      this.set('currentTab', currentRoute);
    },
    logoutCurrentUser() {
      this.get('ajax').request('/uam/logoutUser.php', options).then((message) => {
        window.location.assign(window.sessionStorage.gps_website);
      }).catch((response) => {
        console.log(response);
      });
    }
  }
});
