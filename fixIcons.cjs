const fs = require('fs');
const map = require('@svg-maps/india').default;

const mh = map.locations.find(l => l.id === 'mh');
const goa = map.locations.find(l => l.id === 'ga');

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
  <svg viewBox="0 0 612 696" fill="rgba(140, 224, 255, 0.15)" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    ${map.locations.map(l => `<path d="${l.path}" />`).join('\n    ')}
    <circle cx="200" cy="300" r="10" fill="currentColor" stroke="none" />
    <circle cx="350" cy="250" r="10" fill="currentColor" stroke="none" />
    <circle cx="280" cy="450" r="10" fill="currentColor" stroke="none" />
    <circle cx="450" cy="350" r="10" fill="currentColor" stroke="none" />
    <circle cx="150" cy="200" r="10" fill="currentColor" stroke="none" />
  </svg>
);

export const StateIcon = () => (
  <svg viewBox="90 360 180 150" fill="rgba(140, 224, 255, 0.15)" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="${mh.path}" />
    <circle cx="150" cy="420" r="3" fill="currentColor" stroke="none" />
    <circle cx="220" cy="450" r="3" fill="currentColor" stroke="none" />
    <circle cx="180" cy="390" r="3" fill="currentColor" stroke="none" />
    <circle cx="130" cy="460" r="3" fill="currentColor" stroke="none" />
  </svg>
);

export const DistrictIcon = () => (
  <svg viewBox="113 500 18 24" fill="rgba(140, 224, 255, 0.15)" stroke="currentColor" strokeWidth="0.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="${goa.path}" />
    <circle cx="120" cy="510" r="0.8" fill="currentColor" stroke="none" />
    <circle cx="125" cy="515" r="0.8" fill="currentColor" stroke="none" />
    <circle cx="118" cy="518" r="0.8" fill="currentColor" stroke="none" />
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
