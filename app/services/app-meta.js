import Service from '@ember/service';
import { computed } from '@ember/object';

export default Service.extend({
  isSuperAdmin: computed('userTypeArr', 'userType', function() {
    let userTypeArr = this.userTypeArr || [];
    return userTypeArr[this.userType] === 'super_admin';
  }),
  isDealer: computed('userTypeArr', 'userType', function() {
    let userTypeArr = this.userTypeArr || [];
    return userTypeArr[this.userType] === 'dealer';
  }),
  isDistributer: computed('userTypeArr', 'userType', function() {
    let userTypeArr = this.userTypeArr || [];
    return userTypeArr[this.userType] === 'distributer';
  }),
  isEndUser: computed('userTypeArr', 'userType', function() {
    let userTypeArr = this.userTypeArr || [];
    return userTypeArr[this.userType] === 'end_user';
  })
});
