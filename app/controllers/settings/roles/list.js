import Controller from '@ember/controller';
import { isEmpty } from '@ember/utils';
import { set } from '@ember/object';

export default Controller.extend({
  entityName: 'roles',
  actions: {
    openRoleDetails(model = {}) {
      if (isEmpty(model)) {
        set(model, 'isNew', true);
      }
      this.send('openModal', 'components/role-details-form', { model });
    }
  }
});
