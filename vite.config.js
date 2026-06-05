import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const threeExamples = path.resolve(__dirname, 'node_modules/three/examples/jsm');
const shimDir = path.resolve(__dirname, 'src/shims');

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'three/tsl': path.resolve(threeExamples, 'nodes/Nodes.js'),
      'three/webgpu': path.resolve(shimDir, 'three-webgpu.js'),
    },
  },
  optimizeDeps: {
    include: ['globe.gl', 'three'],
  },
});
