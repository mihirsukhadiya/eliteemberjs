import Application from '@ember/application';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';

(function () {
  sessionStorage.clear();
  sessionStorage.setItem("environment", config.environment);
  if (config.environment === "development") {
    sessionStorage.setItem("gps_website", 'http://localhost:8080/html_php_mines_website/');
  } else {
    sessionStorage.setItem("gps_website", 'http://mines.flashgps.com/');
  }
})();
const App = Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver
});

loadInitializers(App, config.modulePrefix);

export default App;
