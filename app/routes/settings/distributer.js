import endUser from 'gps/routes/settings/customers';

export default endUser.extend({
  endpointUrl: '/distributers/getDistributerList.php',
  templateName: 'settings/customers'
});
