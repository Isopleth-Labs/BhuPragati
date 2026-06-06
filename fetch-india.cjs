
const https = require('https');
https.get('https://raw.githubusercontent.com/datameet/maps/master/Country/india-composite.geojson', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const geojson = JSON.parse(data);
      console.log('Got geojson');
    } catch(e) { console.log('Error parsing'); }
  });
});

