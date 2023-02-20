import Component from '@ember/component';
import { set, computed } from '@ember/object';

export default Component.extend({
  tagName: '',
  errorMsgs: computed('model.errors.[]', function() {
    let { errors } = this.model || {};
    if (document.getElementById("modal-header")) {
      document.getElementById("modal-header").scrollIntoView();
    }
    return errors || [];
  })
});
