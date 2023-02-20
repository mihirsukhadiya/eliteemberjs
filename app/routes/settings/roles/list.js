import Route from '@ember/routing/route';
export default Route.extend({
  model() {
    return [
      {
        id: 233,
        role_name: 'Admin',
        description: 'takes care of all the module.Unrestricted full access'
      },
      {
        id: 122,
        role_name: 'Dealer',
        description: 'takes care of all the module.Unrestricted full access'
      },
      {
        id: 234,
        role_name: 'Manager',
        description: 'takes care of all the module.Unrestricted full access'
      }
    ]
  }
});
