const fs = require('fs');
const map = require('@svg-maps/india').default;

function getBBox(pathStr) {
  const matches = pathStr.match(/-?\d+\.?\d*/g);
  if (!matches) return { x: 0, y: 0, w: 24, h: 24 };
  
  let isX = true;
  let cx = 0, cy = 0;
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;

  let isAbsolute = true;
  const commands = pathStr.split(/(?=[a-zA-Z])/);
  for (let cmdStr of commands) {
    if (!cmdStr.trim()) continue;
    const cmd = cmdStr[0];
    const args = cmdStr.substring(1).match(/-?\d+\.?\d*/g) || [];
    
    if (cmd === 'm' || cmd === 'l' || cmd === 'c' || cmd === 's' || cmd === 'q' || cmd === 't' || cmd === 'a') {
      isAbsolute = false;
    } else if (cmd === 'M' || cmd === 'L' || cmd === 'C' || cmd === 'S' || cmd === 'Q' || cmd === 'T' || cmd === 'A') {
      isAbsolute = true;
    } else if (cmd.toLowerCase() === 'z') {
      continue;
    }

    if (cmd.toLowerCase() === 'h') {
      for(let val of args) {
        let x = parseFloat(val);
        if (!isAbsolute) x += cx;
        cx = x;
        if (cx < minX) minX = cx;
        if (cx > maxX) maxX = cx;
      }
      continue;
    }
    if (cmd.toLowerCase() === 'v') {
      for(let val of args) {
        let y = parseFloat(val);
        if (!isAbsolute) y += cy;
        cy = y;
        if (cy < minY) minY = cy;
        if (cy > maxY) maxY = cy;
      }
      continue;
    }

    for (let i = 0; i < args.length; i += 2) {
      if (i + 1 >= args.length) break;
      let x = parseFloat(args[i]);
      let y = parseFloat(args[i+1]);
      
      if (!isAbsolute) {
        x += cx;
        y += cy;
      }
      
      cx = x;
      cy = y;
      
      if (cx < minX) minX = cx;
      if (cx > maxX) maxX = cx;
      if (cy < minY) minY = cy;
      if (cy > maxY) maxY = cy;
    }
  }
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}

// 1. MH path
const mh = map.locations.find(l => l.id === 'mh');
const mhBbox = getBBox(mh.path);

// 2. India path - we just merge all paths and compute BBox of entire India
const indiaPaths = map.locations.map(l => l.path).join(' ');
const inBbox = getBBox(indiaPaths);

// 3. District path - just use Goa for District, it is small and distinct!
const goa = map.locations.find(l => l.id === 'ga');
const goBbox = getBBox(goa.path);

console.log('MH:', mhBbox);
console.log('India:', inBbox);
console.log('Goa:', goBbox);

const code = `import React from 'react';

export const EarthIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <ellipse cx="12" cy="12" rx="4" ry="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="6" x2="19.07" y2="6" />
    <line x1="4.93" y1="18" x2="19.07" y2="18" />
  </svg>
);

export const IndiaIcon = () => (
  <svg viewBox="${inBbox.x - 10} ${inBbox.y - 10} ${inBbox.w + 20} ${inBbox.h + 20}" fill="rgba(140, 224, 255, 0.15)" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    ${map.locations.map(l => `<path d="${l.path}" />`).join('\n    ')}
    <circle cx="${inBbox.x + inBbox.w*0.3}" cy="${inBbox.y + inBbox.h*0.4}" r="5" fill="currentColor" stroke="none" />
    <circle cx="${inBbox.x + inBbox.w*0.7}" cy="${inBbox.y + inBbox.h*0.3}" r="5" fill="currentColor" stroke="none" />
    <circle cx="${inBbox.x + inBbox.w*0.5}" cy="${inBbox.y + inBbox.h*0.7}" r="5" fill="currentColor" stroke="none" />
  </svg>
);

export const StateIcon = () => (
  <svg viewBox="${mhBbox.x - 5} ${mhBbox.y - 5} ${mhBbox.w + 10} ${mhBbox.h + 10}" fill="rgba(140, 224, 255, 0.15)" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="${mh.path}" />
    <circle cx="${mhBbox.x + mhBbox.w*0.3}" cy="${mhBbox.y + mhBbox.h*0.4}" r="2.5" fill="currentColor" stroke="none" />
    <circle cx="${mhBbox.x + mhBbox.w*0.7}" cy="${mhBbox.y + mhBbox.h*0.6}" r="2.5" fill="currentColor" stroke="none" />
  </svg>
);

export const DistrictIcon = () => (
  <svg viewBox="${goBbox.x - 2} ${goBbox.y - 2} ${goBbox.w + 4} ${goBbox.h + 4}" fill="rgba(140, 224, 255, 0.15)" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="${goa.path}" />
    <circle cx="${goBbox.x + goBbox.w*0.5}" cy="${goBbox.y + goBbox.h*0.5}" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const BlockIcon = () => (
  <svg viewBox="0 0 24 24" fill="rgba(140, 224, 255, 0.15)" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="6" height="6" rx="1" />
    <rect x="14" y="4" width="6" height="6" rx="1" />
    <rect x="14" y="14" width="6" height="6" rx="1" />
    <rect x="4" y="14" width="6" height="6" rx="1" />
  </svg>
);

export const PanchayatIcon = () => (
  <svg viewBox="0 0 24 24" fill="rgba(140, 224, 255, 0.15)" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M 2 10 L 12 3 L 22 10 Z" />
    <path d="M 2 10 H 22" />
    <path d="M 3 12 H 21" />
    <path d="M 5 12 V 20 M 9 12 V 20 M 15 12 V 20 M 19 12 V 20" />
    <path d="M 2 20 H 22" />
    <path d="M 1 22 H 23" />
  </svg>
);

export const VillageIcon = () => (
  <svg viewBox="0 0 24 24" fill="rgba(140, 224, 255, 0.15)" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M 3 10 L 12 3 L 21 10 V 20 A 1 1 0 0 1 20 21 H 4 A 1 1 0 0 1 3 20 Z" />
    <path d="M 10 21 V 14 H 14 V 21" />
  </svg>
);
`;

fs.writeFileSync('src/homepage/components/Icons.jsx', code);
console.log('Saved Icons.jsx');
