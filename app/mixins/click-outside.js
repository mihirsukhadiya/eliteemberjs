/* eslint-disable ember/no-global-jquery */
import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';

const bound = function(fnName) {
  return computed(fnName, function() {
    return this.get(fnName).bind(this);
  });
};

export default Mixin.create({
  clickOutside() {},
  clickHandler: bound('outsideClickHandler'),

  outsideClickHandler(e) {
    let { element } = this;
    let $target = $(e.target);
    let $element = $(element);
    let isInside = $target.closest($element).length === 1;

    if (!isInside) {
      this.clickOutside(e);
    }
  },

  addClickOutsideListener() {
    let { clickHandler } = this;
    $(window).on('click', clickHandler);
  },
  removeClickOutsideListener() {
    let { clickHandler } = this;
    $(window).off('click', clickHandler);
  }
});
