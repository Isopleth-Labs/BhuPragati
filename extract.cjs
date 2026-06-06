
const map = require('@svg-maps/india').default;
const mh = map.locations.find(l => l.id === 'mh');
console.log(mh.path.substring(0, 100));

