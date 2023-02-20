import Helper from '@ember/component/helper';
import { isPresent } from '@ember/utils';
export function or(params) {
  for (let param of params) {
  /* e.g)
    {{#if (or [] || true)}}
      {{invoicesList}}
    {{/if}}
    will not render 'invoicesList' bcoz without isPresent(param), or-helper returns `[]` bcoz
    `if([]) is true` in javascript. But {{#if []}} is false in hbs, so the block will not render.
  */
    if (isPresent(param) && param) {
      return param;
    }
  }
  return params[params.length - 1];
}
export default Helper.helper(or);
