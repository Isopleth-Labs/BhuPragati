import { defineConfig } from 'vitest/config'
import * as path from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@/modules": path.resolve(__dirname, "src/modules"),
      "@/types": path.resolve(__dirname, "src/types"),
      "@/shared": path.resolve(__dirname, "src/shared"),
    },
  },
})

