/* eslint-disable ember/no-global-jquery */
import Component from '@ember/component';
import { run } from '@ember/runloop';
import { isPresent } from '@ember/utils';
import { set, computed } from '@ember/object';

export default Component.extend({
  tagName: '',
  canFadeIn: false,
  animateClass: computed('canFadeIn', function() {
    if (this.canFadeIn) {
      return 'notify-in';
    }
    return 'notify-out';
  }),
  didInsertElement() {
    this._super(...arguments);
    run.next(() => {
      if (this.isDestroyed) {
        return;
      }
      $(window.document).on('keydown', this, this.clsOnEsc);
    });
    this.set('canFadeIn', true);

    if (this.isSuccess) {
      run.later(() => {
        if (this.isDestroyed) {
          return;
        }
        this.set('canFadeIn', false);
        run.later(() => {
          if (this.isDestroyed) {
            return;
          }
          this.closeModal();
        }, 1000);
      }, 2000);
    } else {
      run.later(() => {
        if (this.isDestroyed) {
          return;
        }
        this.set('canFadeIn', false);
        run.later(() => {
          if (this.isDestroyed) {
            return;
          }
          this.closeModal();
        }, 1000);
      }, 1500);  
    }
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
      this.set('canFadeIn', false);
      run.later(() => {
        if (this.isDestroyed) {
          return;
        }
        this.closeModal();
      }, 1000);
    }
  }
});
