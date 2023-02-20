import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  appMeta: service(),
  canShowDistributer: computed('appMeta.isDistributer', 'appMeta.isSuperAdmin', function() {
    return this.appMeta.isDistributer || this.appMeta.isSuperAdmin;
  })
});
