import Controller from '@ember/controller';
import { isEmpty } from '@ember/utils';
import { set } from '@ember/object';

export default Controller.extend({
  entityName: 'users',
  actions: {
    openUserDetails(model = {}) {
      if (isEmpty(model)) {
        set(model, 'isNew', true);
      }
      this.send('openModal', 'components/user-details-form', { model });
    }
  }
});
