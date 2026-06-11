import fs from 'fs';
import path from 'path';

const srcDir = path.join(process.cwd(), 'src');
const modulesDir = path.join(srcDir, 'modules');
const dataDir = path.join(srcDir, 'data');

const configs = [
  { module: 'administrative', file: 'administrativeBoundaries.json', service: 'AdministrativeService', getter: 'getBoundaries' },
  { module: 'agriculture', file: 'agricultureData.json', service: 'AgricultureService', getter: 'getData' },
  { module: 'analysis-grid', file: 'analysisGrid.json', service: 'AnalysisGridService', getter: 'getGrid' },
  { module: 'command-center', file: 'commandCenter.json', service: 'CommandCenterService', getter: 'getCenter' },
  { module: 'electricity', file: 'electricityData.json', service: 'ElectricityService', getter: 'getData' },
  { module: 'flood', file: 'floodRiskData.json', service: 'FloodService', getter: 'getRiskData' },
  { module: 'healthcare', file: 'healthcareData.json', service: 'HealthcareService', getter: 'getData' },
  { module: 'roads', file: 'roadData.json', service: 'RoadsService', getter: 'getData' }
];

configs.forEach(conf => {
  const modPath = path.join(modulesDir, conf.module);
  const modDataDir = path.join(modPath, 'data');
  if (!fs.existsSync(modDataDir)) fs.mkdirSync(modDataDir, { recursive: true });
  
  // Move JSON
  const oldJsonPath = path.join(dataDir, conf.file);
  const newJsonPath = path.join(modDataDir, conf.file);
  if (fs.existsSync(oldJsonPath)) {
    fs.renameSync(oldJsonPath, newJsonPath);
  }

  // Create Service
  const serviceContent = `import data from './data/${conf.file}';
import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';

export class ${conf.service} {
  static ${conf.getter}(): FeatureCollection<Geometry, GeoJsonProperties> {
    return data as FeatureCollection<Geometry, GeoJsonProperties>;
  }
}
`;
  fs.writeFileSync(path.join(modPath, `${conf.module}.service.ts`), serviceContent);

  // Update overlay.ts
  const overlayPath = path.join(modPath, 'overlay.ts');
  if (fs.existsSync(overlayPath)) {
    let content = fs.readFileSync(overlayPath, 'utf8');
    content = content.replace(/import \{.*?\} from ".*?data\/geojson";/g, `import { ${conf.service} } from "./${conf.module}.service";`);
    
    // The specific export from geojson was used directly. Replace its usage.
    const importName = conf.file.replace('.json', ''); // e.g. administrativeBoundaries
    content = content.replace(new RegExp(`\\b${importName}\\b( as FeatureCollection<Geometry, GeoJsonProperties>)?`, 'g'), `${conf.service}.${conf.getter}()`);
    
    fs.writeFileSync(overlayPath, content);
  }
});

// For settlements which has 3 files
const settlementsModPath = path.join(modulesDir, 'settlements');
const settlementsDataDir = path.join(settlementsModPath, 'data');
if (!fs.existsSync(settlementsDataDir)) fs.mkdirSync(settlementsDataDir, { recursive: true });

['infrastructureNodes.json', 'regionalRivers.json', 'settlements.json'].forEach(f => {
  const oldJsonPath = path.join(dataDir, f);
  const newJsonPath = path.join(settlementsDataDir, f);
  if (fs.existsSync(oldJsonPath)) {
    fs.renameSync(oldJsonPath, newJsonPath);
  }
});

const settlementsServiceContent = `import infrastructureNodesData from './data/infrastructureNodes.json';
import regionalRiversData from './data/regionalRivers.json';
import settlementsData from './data/settlements.json';
import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';

export class SettlementsService {
  static getInfrastructureNodes(): FeatureCollection<Geometry, GeoJsonProperties> {
    return infrastructureNodesData as FeatureCollection<Geometry, GeoJsonProperties>;
  }
  static getRegionalRivers(): FeatureCollection<Geometry, GeoJsonProperties> {
    return regionalRiversData as FeatureCollection<Geometry, GeoJsonProperties>;
  }
  static getSettlements(): FeatureCollection<Geometry, GeoJsonProperties> {
    return settlementsData as FeatureCollection<Geometry, GeoJsonProperties>;
  }
}
`;
fs.writeFileSync(path.join(settlementsModPath, 'settlements.service.ts'), settlementsServiceContent);

// Update settlements overlay.ts
const setOverlayPath = path.join(settlementsModPath, 'overlay.ts');
if (fs.existsSync(setOverlayPath)) {
  let content = fs.readFileSync(setOverlayPath, 'utf8');
  content = content.replace(/import \{[\s\S]*?\} from "..\/..\/data\/regional";/g, `import { SettlementsService } from "./settlements.service";`);
  
  content = content.replace(/\binfrastructureNodes\b( as FeatureCollection<Geometry, GeoJsonProperties>)?/g, `SettlementsService.getInfrastructureNodes()`);
  content = content.replace(/\bregionalRivers\b( as FeatureCollection<Geometry, GeoJsonProperties>)?/g, `SettlementsService.getRegionalRivers()`);
  content = content.replace(/\bsettlements\b( as FeatureCollection<Geometry, GeoJsonProperties>)?/g, `SettlementsService.getSettlements()`);
  
  fs.writeFileSync(setOverlayPath, content);
}

// Delete geojson.ts and regional.ts
if (fs.existsSync(path.join(dataDir, 'geojson.ts'))) fs.unlinkSync(path.join(dataDir, 'geojson.ts'));
if (fs.existsSync(path.join(dataDir, 'regional.ts'))) fs.unlinkSync(path.join(dataDir, 'regional.ts'));

console.log("Migration Complete");
