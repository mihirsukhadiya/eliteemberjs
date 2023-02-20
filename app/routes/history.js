import mapLocate from 'gps/routes/map';

export default mapLocate.extend({
  templateName: 'map',
  resetController(controller, isExiting, transition) {
    this._super(...arguments);
    if (isExiting && transition.targetName !== 'error') {
      controller.set('distance', '0');
    }
  }
});
