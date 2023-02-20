import AjaxService from 'ember-ajax/services/ajax';

export default AjaxService.extend({
  host: ( window.sessionStorage.environment === "development" ) ? 'http://localhost:8080' : 'http://mines.flashgps.com',
  namespace:  ( window.sessionStorage.environment === "development" ) ? '/php_Mines_webserver/app/api/mines' : '/Mines_webserver/app/api/mines',
  serialise(obj, resourceProperties) {
    Object.keys(obj).forEach(k => (!resourceProperties.includes(k) ||
                                    ((typeof obj[k] !== 'boolean') && ((!obj[k] && obj[k] !== undefined) || (obj[k] && typeof obj[k] === 'string' && !obj[k].trim())))) ?
                                    delete obj[k] : 1
                                  );
    return obj;
  },
  validatePhoneNumber(phoneNumber) {
    return !isNaN(parseInt(phoneNumber)) && phoneNumber.match(/\d/g).length >= 10;
  },
  validateName(name) {
    var regex = new RegExp("^[a-zA-Z]+[a-zA-Z-]*$");
    return regex.test(name);
  }
});
