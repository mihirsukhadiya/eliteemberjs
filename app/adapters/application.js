import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend({
  namespace: 'api/app/api/',
  host: 'https://api.example.com'
});
