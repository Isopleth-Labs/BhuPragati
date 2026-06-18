import path from "node:path"
import { fileURLToPath } from "node:url"
import babel from "@rolldown/plugin-babel"
import tailwindcss from "@tailwindcss/vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const threeExamples = path.resolve(__dirname, "node_modules/three/examples/jsm")
const shimDir = path.resolve(__dirname, "src/shims")

const config = defineConfig({
	base: process.env.NODE_ENV === "production" ? "/BhuPragati/" : "/",
	resolve: {
		tsconfigPaths: true,
		alias: {
			"three/tsl": path.resolve(threeExamples, "nodes/Nodes.js"),
			"three/webgpu": path.resolve(shimDir, "three-webgpu.js"),
		},
	},
	optimizeDeps: {
		include: ["three"],
	},
	plugins: [
		devtools(),
		tailwindcss(),
		tanstackStart(),
		viteReact(),
		babel({ presets: [reactCompilerPreset()] }),
	],
})

export default config
