import Service from '@ember/service';
import { computed } from '@ember/object';

export default Service.extend({
  to_time: window.moment(),
  from_time: window.moment().subtract(2, 'hours')
});
