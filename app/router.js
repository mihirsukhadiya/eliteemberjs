import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});
Router.map(function() {
  this.route('unauthorized', { path: '/*wildcard' });
  this.route('unauthorized', { path: '/*path' });
});
Router.map(function() {
  this.route('map', { path: '/map' });
  this.route('reports', { path: '/reports' });
  this.route('pilot', { path: '/pilot' });
  this.route('devices', { path: '/devices' });
  this.route('history', { path: '/history' });
  this.route('settings', function() {
    this.route('users', { path: '/users' });
    this.route('roles', function() {
      this.route('list', { path: '/' });
    });
    this.route('customers', { path: '/customers'});
    this.route('distributer');
    this.route('dealer');
  });
  this.route('loginuser');
});

export default Router;
