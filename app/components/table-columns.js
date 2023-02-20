import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

const tableColumns = {
  'devices': {
    'headerName': 'YOUR DEVICES',
    'newEntityLabel': 'New Device',
    'actions': {
      'delete': false
    },
    // 'header': ['device Id', 'Vehicle No', 'Driver Name', 'Mobile Number', 'Vehicle type', 'vehicle owner', 'Status'],
    // 'body': ['id', 'vehicle_no', 'driver_name', 'driver_phone', 'vehicle_type', 'owner_name', 'status']
    'header': ['device Id', 'Vehicle No', 'Driver Name', 'Mobile Number', 'Vehicle type', 'Validity'],
    'body': ['id', 'vehicle_no', 'driver_name', 'driver_phone', 'vehicle_type', 'device_validity']
  },
  'users': {
    'headerName': 'YOUR USERS',
    'newEntityLabel': 'New User',
    'actions': {
      'delete': true
    },
    'header': ['User Name', 'Email Id', 'Role Name', ''],
    'body': ['user_name', 'role_name', 'email_id']
  },
  'roles': {
    'headerName': 'YOUR ROLES',
    'actions': {
      'delete': true
    },
    'header': ['Role Name', 'Description', ''],
    'body': ['role_name', 'description']
  },
  'customers': {
    'headerName': 'CUSTOMERS',
    'newEntityLabel': 'New Customer',
    'actions': {
      'delete': false
    },
    'header': ['name', 'email id', 'phone number', 'Number of Devices'],
    'body': ['name', 'email_id', 'phone_number', 'no_of_devices']
  },
  'distributers': {
    'headerName': 'DISTRIBUTER',
    'newEntityLabel': 'New Distributer',
    'actions': {
      'delete': false
    },
    'header': ['name', 'email id', 'phone number'],
    'body': ['name', 'email_id', 'phone_number']
  },
  'dealers': {
    'headerName': 'DEALER',
    'newEntityLabel': 'New Dealer',
    'actions': {
      'delete': false
    },
    'header': ['name', 'email id', 'phone number'],
    'body': ['name', 'email_id', 'phone_number']
  }
};

export default Component.extend({
  tableColumns,
  appMeta: service(),
  entityTable: computed(function() {
    let tableColumns = this.tableColumns || [];
    return tableColumns[this.entityName] || [];
  }),
  headerColumns: computed(function() {
    return this.entityTable.header;
  }),
  bodyColumns: computed(function() {
    return this.entityTable.body;
  }),
  numberOfColumns: computed(function() {
    return this.entityTable.header.length + 3;
  }),
  title: computed(function() {
    return this.entityTable.headerName;
  }),
  newEntityLabel: computed(function() {
    if (!this.appMeta.isSuperAdmin && this.entityName === 'devices') {
      return;
    }
    return this.entityTable.newEntityLabel;
  }),
  entityAction: computed(function() {
    return this.entityTable.actions;
  }),
});
