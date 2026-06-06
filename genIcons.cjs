const fs = require('fs');
const map = require('@svg-maps/india').default;

const indiaPaths = map.locations.map(l => `<path d="${l.path}" fill="none" stroke="currentColor" strokeWidth="2" />`).join('\n      ');

const mh = map.locations[0]; // Just use the first one as the State icon
const mhPath = mh.path;

const coords = [...mhPath.matchAll(/-?\d+\.?\d*/g)].map(m => parseFloat(m[0]));
let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
for (let i = 0; i < coords.length; i += 2) {
  if(coords[i] < minX) minX = coords[i];
  if(coords[i] > maxX) maxX = coords[i];
  if(coords[i+1] < minY) minY = coords[i+1];
  if(coords[i+1] > maxY) maxY = coords[i+1];
}
const mhViewBox = `${minX - 5} ${minY - 5} ${maxX - minX + 10} ${maxY - minY + 10}`;

const districtPath = 'M30,10 L50,15 L70,10 L85,30 L90,55 L75,80 L50,90 L25,85 L10,65 L15,35 Z M50,15 L55,25 M75,80 L60,70 M25,85 L35,65';

const content = `import React from 'react';

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
  <svg viewBox="0 0 612 696" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    ${indiaPaths}
  </svg>
);

export const StateIcon = () => (
  <svg viewBox="${mhViewBox}" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="${mhPath}" />
  </svg>
);

export const DistrictIcon = () => (
  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="${districtPath}" />
  </svg>
);

export const BlockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
  </svg>
);

export const PanchayatIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 22h20M12 2L2 10h20ZM4 10v12M20 10v12M9 10v12M15 10v12" />
  </svg>
);

export const VillageIcon = () => (
  <svg viewBox="0 0 24 24" fill="rgba(140, 224, 255, 0.15)" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
`;

fs.writeFileSync('src/homepage/components/Icons.jsx', content);
