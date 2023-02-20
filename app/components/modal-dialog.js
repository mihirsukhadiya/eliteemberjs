/* eslint-disable ember/no-global-jquery */
import Component from '@ember/component';
import { run } from '@ember/runloop';

export default Component.extend({
  tagName: '',
  animateClass: '',
  didInsertElement() {
    this._super(...arguments);
    run.next(() => {
      if (this.isDestroyed) {
        return;
      }
      this.set('animateClass', 'in');
      $(window.document).on('keydown', this, this.clsOnEsc);
    });
  },
  clsOnEsc(event) {
    if (event.which === 27) {
      event.data.send('close');
    }
  },
  willDestroyElement() {
    $(window.document).off('keydown', this.clsOnEsc);
  },
  actions: {
    close() {
      this.set('animateClass', '');
      run.later(() => {
        if (this.isDestroyed) {
          return;
        }
        this.closeModal();
      }, 400);
    }
  }
});
