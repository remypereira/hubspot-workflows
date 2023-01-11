const hubspot = require('@hubspot/api-client');

exports.main = async (event, callback) => {

  /*****
    Secret is access token from private app
  *****/

  const hubspotClient = new hubspot.Client({
    accessToken: process.env.wfkey
  });

  let owlo;
  try {
    const ApiResponse = await hubspotClient.crm.contacts.basicApi.getById(event.object.objectId, ["ow_last_ordered"]);
    owlo = ApiResponse.body.properties.ow_last_ordered;
  } catch (err) {
    console.error(err);
    throw err;
  }
var dateString = owlo;
dateString = dateString.split('T')[0];
var date = new Date(dateString);

  callback({
    outputFields: {
      //email: email,
      date: date
    }
  });
  
    const properties = {
  "ow_last_ordered_date": date
};
  const SimplePublicObjectInput = { properties };
try {
  const apiResponse = await hubspotClient.crm.contacts.basicApi.update(event.object.objectId, SimplePublicObjectInput);
  console.log(JSON.stringify(apiResponse.body, null, 2));
} catch (e) {
  e.message === 'HTTP request failed'
    ? console.error(JSON.stringify(e.response, null, 2))
    : console.error(e)
}
}
