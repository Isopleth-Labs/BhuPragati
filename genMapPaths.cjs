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
        try { resolve(JSON.parse(data)); } catch(e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function run() {
  try {
    console.log('Fetching India states topojson...');
    const statesTopo = await fetchJson('https://raw.githubusercontent.com/deldersveld/topojson/master/countries/india/india-states.json');
    
    console.log('Simplifying...');
    const preSimplified = simplify.presimplify(statesTopo);
    const simplified = simplify.simplify(preSimplified, 0.005);
    
    console.log('Extracting geometries...');
    const indiaGeo = topojson.merge(simplified, simplified.objects.IND_adm1.geometries);
    const mhGeo = topojson.feature(simplified, simplified.objects.IND_adm1.geometries.find(g => g.properties.NAME_1 === 'Maharashtra'));
    
    console.log('Fetching India districts topojson...');
    const distTopo = await fetchJson('https://raw.githubusercontent.com/deldersveld/topojson/master/countries/india/india-districts.json');
    const distSimp = simplify.simplify(simplify.presimplify(distTopo), 0.005);
    const puneGeo = topojson.feature(distSimp, distSimp.objects.IND_adm2.geometries.find(g => g.properties.NAME_2 === 'Pune'));

    console.log('Projecting...');
    const getPath = (geo) => {
      const proj = d3.geoMercator().fitSize([22, 22], geo);
      proj.translate([proj.translate()[0] + 1, proj.translate()[1] + 1]);
      const pathGen = d3.geoPath().projection(proj);
      const pathData = pathGen(geo);
      return pathData.replace(/\d+\.\d+/g, (m) => parseFloat(m).toFixed(2));
    };

    const indiaPath = getPath(indiaGeo);
    const statePath = getPath(mhGeo);
    const distPath = getPath(puneGeo);

    let iconsCode = fs.readFileSync('src/homepage/components/Icons.jsx', 'utf8');
    
    iconsCode = iconsCode.replace(/<path d="M 11 2 L 13 2.*?Z" \/>/, `<path d="${indiaPath}" />`);
    iconsCode = iconsCode.replace(/<path d="M 12 2 L 15 4.*?Z" \/>/, `<path d="${statePath}" />`);
    iconsCode = iconsCode.replace(/<path d="M 11 2 L 15 3.*?Z" \/>/, `<path d="${distPath}" />`);

    fs.writeFileSync('src/homepage/components/Icons.jsx', iconsCode);
    console.log('Successfully updated paths!');
    console.log('India Path Length:', indiaPath.length);

  } catch (e) {
    console.error(e);
  }
}

run();
