import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return [
      {
        id: 123,
        user_name: 'vaishu',
        role_name: 'Admin',
        role_id: 123,
        email_id: 'vaishnavidevi1998@gmail.com'
      },
      {
        id: 456,
        user_name: 'vaishu',
        role_name: 'manager',
        role_id: 234,
        email_id: 'vaishnavidevi1998@gmail.com'
      },
      {
        id: 234,
        user_name: 'vaishu',
        role_name: 'dealer',
        role_id: 456,
        email_id: 'vaishnavidevi1998@gmail.com'
      }
    ];
  }
});
