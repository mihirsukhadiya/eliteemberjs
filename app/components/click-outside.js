/* eslint-disable ember/no-global-jquery */
import Component from '@ember/component';
import { on } from '@ember/object/evented';
import { next } from '@ember/runloop';
import ClickOutside from 'gps/mixins/click-outside';

export default Component.extend(ClickOutside, {
  clickOutside(e) {
    let exceptSelector = this.attrs['except-selector']; // eslint-disable-line ember/no-attrs-in-components
    if (exceptSelector && $(e.target).closest(exceptSelector).length > 0) {
      return;
    }

    this.action();
  },

  _attachClickOutsideHandler: on('didInsertElement', function() { // eslint-disable-line ember/no-on-calls-in-components
    next(this, this.addClickOutsideListener);
  }),

  _removeClickOutsideHandler: on('willDestroyElement', function() { // eslint-disable-line ember/no-on-calls-in-components
    this.removeClickOutsideListener();
  })
});
