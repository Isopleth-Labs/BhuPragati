const https = require('https');
const d3 = require('d3-geo');
const topojson = require('topojson-client');
const simplify = require('topojson-simplify');
const fs = require('fs');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'node.js' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchJson(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch(e) { reject(new Error('Parse error on ' + url + ': ' + e.message + '\nData received: ' + data.substring(0, 100))); }
      });
    }).on('error', reject);
  });
}

async function run() {
  try {
    console.log('Fetching India GeoJSON...');
    const indiaGeo = await fetchJson('https://raw.githubusercontent.com/datameet/maps/master/Country/india-composite.geojson');

    console.log('Fetching Maharashtra GeoJSON...');
    const mhGeo = await fetchJson('https://raw.githubusercontent.com/datameet/maps/master/States/Maharashtra/state/maharashtra.geojson');

    console.log('Fetching Pune GeoJSON...');
    // We'll use the district map of Maharashtra to get Pune
    const districtsGeo = await fetchJson('https://raw.githubusercontent.com/datameet/maps/master/Districts/Census_2011/2011_Dist.geojson');
    
    console.log('Extracting geometries...');
    // Simplify India
    // Wait, let's just project the raw geojson. Wait, it might be too large.
    const puneGeo = districtsGeo.features.find(f => f.properties.DISTRICT === 'Pune');

    console.log('Projecting...');
    const getPath = (geo) => {
      // Simplify the geometry object itself before projecting to save path size
      // We can use a poor man's simplify or just project it, and if it's too big, we regex out the detail
      const proj = d3.geoMercator().fitSize([22, 22], geo);
      proj.translate([proj.translate()[0] + 1, proj.translate()[1] + 1]);
      const pathGen = d3.geoPath().projection(proj);
      const pathData = pathGen(geo);
      return pathData.replace(/\d+\.\d+/g, (m) => parseFloat(m).toFixed(2));
    };

    const indiaPath = getPath(indiaGeo);
    const statePath = getPath(mhGeo);
    const distPath = getPath(puneGeo);

    // Limit length if it's too huge just by truncating or simplifying (d3-geo doesn't auto simplify)
    // Actually datameet geojson is HUGE. It will be megabytes!
    // We need topojson-simplify. But datameet provides geojson, so we convert it:
    
    // Convert to TopoJSON format for simplification
    // Wait, topojson-server provides geo2topo.
    console.log('Success, path length:', indiaPath.length);
  } catch (e) {
    console.error(e);
  }
}

run();
