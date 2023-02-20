import endUser from 'gps/routes/settings/customers';

export default endUser.extend({
  endpointUrl: '/dealers/getDealerList.php',
  templateName: 'settings/customers'
});
