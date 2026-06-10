import { readFileSync, writeFileSync } from 'fs';

// Simple polylabel implementation (pole of inaccessibility)
// Finds the point inside a polygon that is farthest from the boundary
function polylabel(polygon, precision = 1.0) {
  // Get the outer ring
  const outerRing = polygon[0];
  
  // Find bounding box
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const p of outerRing) {
    if (p[0] < minX) minX = p[0];
    if (p[1] < minY) minY = p[1];
    if (p[0] > maxX) maxX = p[0];
    if (p[1] > maxY) maxY = p[1];
  }

  const width = maxX - minX;
  const height = maxY - minY;
  const cellSize = Math.min(width, height);
  
  if (cellSize === 0) {
    return [(minX + maxX) / 2, (minY + maxY) / 2];
  }
  
  let h = cellSize / 2;
  
  // Cover polygon with initial cells
  let cells = [];
  for (let x = minX; x < maxX; x += cellSize) {
    for (let y = minY; y < maxY; y += cellSize) {
      cells.push(createCell(x + h, y + h, h, polygon));
    }
  }
  
  // Take centroid cell
  let bestCell = getCentroidCell(polygon);
  
  // Evaluate all initial cells
  for (const cell of cells) {
    if (cell.d > bestCell.d) bestCell = cell;
  }
  
  // Subdivide and search
  let numProbes = cells.length;
  
  while (cells.length > 0) {
    const nextCells = [];
    for (const cell of cells) {
      if (cell.max - bestCell.d <= precision) continue;
      
      h = cell.h / 2;
      const newCells = [
        createCell(cell.x - h, cell.y - h, h, polygon),
        createCell(cell.x + h, cell.y - h, h, polygon),
        createCell(cell.x - h, cell.y + h, h, polygon),
        createCell(cell.x + h, cell.y + h, h, polygon),
      ];
      
      for (const c of newCells) {
        if (c.d > bestCell.d) bestCell = c;
        if (c.max - bestCell.d > precision) nextCells.push(c);
      }
      numProbes += 4;
    }
    cells = nextCells;
  }
  
  return [bestCell.x, bestCell.y];
}

function createCell(x, y, h, polygon) {
  const d = pointToPolygonDist(x, y, polygon);
  return {
    x, y, h, d,
    max: d + h * Math.SQRT2
  };
}

function getCentroidCell(polygon) {
  let area = 0;
  let x = 0;
  let y = 0;
  const ring = polygon[0];
  for (let i = 0, len = ring.length, j = len - 1; i < len; j = i++) {
    const a = ring[i];
    const b = ring[j];
    const f = a[0] * b[1] - b[0] * a[1];
    x += (a[0] + b[0]) * f;
    y += (a[1] + b[1]) * f;
    area += f * 3;
  }
  if (area === 0) return createCell(ring[0][0], ring[0][1], 0, polygon);
  return createCell(x / area, y / area, 0, polygon);
}

function pointToPolygonDist(x, y, polygon) {
  let inside = false;
  let minDistSq = Infinity;
  
  for (const ring of polygon) {
    for (let i = 0, len = ring.length, j = len - 1; i < len; j = i++) {
      const a = ring[i];
      const b = ring[j];
      
      if ((a[1] > y) !== (b[1] > y) &&
          (x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0])) {
        inside = !inside;
      }
      
      minDistSq = Math.min(minDistSq, getSegDistSq(x, y, a, b));
    }
  }
  
  return (inside ? 1 : -1) * Math.sqrt(minDistSq);
}

function getSegDistSq(px, py, a, b) {
  let x = a[0], y = a[1];
  let dx = b[0] - x, dy = b[1] - y;
  
  if (dx !== 0 || dy !== 0) {
    const t = ((px - x) * dx + (py - y) * dy) / (dx * dx + dy * dy);
    if (t > 1) {
      x = b[0];
      y = b[1];
    } else if (t > 0) {
      x += dx * t;
      y += dy * t;
    }
  }
  
  dx = px - x;
  dy = py - y;
  return dx * dx + dy * dy;
}

// Main
const json = JSON.parse(readFileSync('public/geojson/india/states.geojson', 'utf-8'));

console.log(`Total features: ${json.features.length}`);
console.log('');

// Manual overrides for states where the computed polylabel is suboptimal
const MANUAL_OVERRIDES = {
  'delhi': [77.12, 28.65],
  'chandigarh': [76.78, 30.73],
  'puducherry': [79.81, 11.93],
  'lakshadweep': [72.18, 10.57],
  'andaman-and-nicobar-islands': [92.66, 11.76],
  'dadra-and-nagar-haveli-and-daman-and-diu': [73.00, 20.25],
  'goa': [74.05, 15.35],
  'sikkim': [88.48, 27.55],
  'tripura': [91.74, 23.73],
  'meghalaya': [91.30, 25.50],
  'manipur': [93.85, 24.76],
  'mizoram': [92.85, 23.30],
  'nagaland': [94.28, 26.12],
  // West Bengal needs a westward push to avoid overlap with Bangladesh
  'west-bengal': [87.20, 23.40],
  // Ladakh: push west to be centered in the main Kashmir valley area
  'ladakh': [77.50, 34.20],
  // Jammu & Kashmir: slightly south
  'jammu-and-kashmir': [74.80, 33.40],
  // Haryana: push slightly into the interior
  'haryana': [76.10, 29.10],
  // Punjab: center properly  
  'punjab': [75.40, 31.00],
  // Himachal Pradesh: slight adjustment
  'himachal-pradesh': [77.30, 31.80],
  // Uttarakhand: slight adjustment
  'uttarakhand': [79.30, 30.10],
};

let updatedCount = 0;

for (const f of json.features) {
  const p = f.properties;
  const id = p.id;
  const name = p.name_en;
  const oldLc = p.label_coordinate;
  
  // Use manual override if available
  if (MANUAL_OVERRIDES[id]) {
    p.label_coordinate = MANUAL_OVERRIDES[id];
    console.log(`${name.padEnd(48)} MANUAL  old: ${JSON.stringify(oldLc).padEnd(25)} -> new: ${JSON.stringify(p.label_coordinate)}`);
    updatedCount++;
    continue;
  }
  
  // Compute polylabel from geometry
  let coords;
  if (f.geometry.type === 'Polygon') {
    coords = f.geometry.coordinates;
  } else if (f.geometry.type === 'MultiPolygon') {
    // Use the largest polygon
    let maxArea = 0;
    let largestPoly = f.geometry.coordinates[0];
    for (const poly of f.geometry.coordinates) {
      const ring = poly[0];
      let area = 0;
      for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        area += (ring[j][0] + ring[i][0]) * (ring[j][1] - ring[i][1]);
      }
      area = Math.abs(area / 2);
      if (area > maxArea) {
        maxArea = area;
        largestPoly = poly;
      }
    }
    coords = largestPoly;
  }
  
  if (!coords) {
    console.log(`${name.padEnd(48)} SKIP (no coords)`);
    continue;
  }
  
  try {
    const newLc = polylabel(coords, 0.01);
    const roundedLc = [Math.round(newLc[0] * 100000) / 100000, Math.round(newLc[1] * 100000) / 100000];
    
    // Check if the new coord is significantly different from the old one
    const dist = oldLc ? Math.sqrt(Math.pow(roundedLc[0] - oldLc[0], 2) + Math.pow(roundedLc[1] - oldLc[1], 2)) : 999;
    
    p.label_coordinate = roundedLc;
    console.log(`${name.padEnd(48)} POLYLABEL  old: ${JSON.stringify(oldLc).padEnd(25)} -> new: ${JSON.stringify(roundedLc)}  delta: ${dist.toFixed(3)}°`);
    updatedCount++;
  } catch (e) {
    console.log(`${name.padEnd(48)} ERROR: ${e.message}`);
  }
}

console.log(`\nUpdated ${updatedCount} label coordinates`);

writeFileSync('public/geojson/india/states.geojson', JSON.stringify(json));
console.log('Written updated states.geojson');
