
const https = require('https');
const d3 = require('d3-geo');

https.get('https://raw.githubusercontent.com/datameet/maps/master/Country/india-composite.geojson', (res) => {
  let data = '';
  res.on('data', (c) => data += c);
  res.on('end', () => {
    try {
      const geo = JSON.parse(data);
      const proj = d3.geoMercator().fitSize([24, 24], geo);
      const pathGen = d3.geoPath().projection(proj);
      const pathData = pathGen(geo);
      console.log('INDIA PATH:', pathData.substring(0, 200));
      require('fs').writeFileSync('india-path.txt', pathData);
    } catch(e) { console.error(e); }
  });
});

