import fs from "node:fs"
import path from "node:path"

const geojson = JSON.parse(
	fs.readFileSync("./public/geojson/india/allStates.json", "utf-8"),
)
const stateDistrictMap: Record<string, string[]> = JSON.parse(
	fs.readFileSync("./public/geojson/states.json", "utf-8"),
) as Record<string, string[]>
// Uttar Pradesh — 75
// Madhya Pradesh — 55
// Rajasthan — 41
// Tamil Nadu — 38
// Bihar — 38
// Maharashtra — 36
// Assam — 35
// Telangana — 33
// Chhattisgarh — 33
// Gujarat — 33
// Karnataka — 31
// Odisha — 30
// Andhra Pradesh — 26
// Arunachal Pradesh — 26
// Jharkhand — 24
// West Bengal — 23
// Punjab — 23
// Haryana — 22
// Jammu and Kashmir (UT) — 20
// Kerala — 14
// Uttarakhand — 13
// Himachal Pradesh — 12
// Manipur — 16
// Nagaland — 16
// Meghalaya — 12
// Tripura — 8
// Sikkim — 6
// Goa — 2
// 🔵 Union Territories (very low / special cases)
// Delhi (NCT) — 11
// Puducherry — 4
// Chandigarh — 1
// Ladakh — 2
// Lakshadweep — 1
// Andaman & Nicobar Islands — 3
// Dadra & Nagar Haveli and Daman & Diu — 3
// ============================
// STATE MAP
// ============================

// ============================
// HELPERS
// ============================
const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ")

// biome-ignore lint/suspicious/noExplicitAny: script uses any for general GeoJSON features
const featureMap = new Map<string, any>()

for (const f of geojson.features) {
	const name = f?.properties?.shapeName
	if (!name) continue
	featureMap.set(normalize(name), f)
}

// ============================
// OUTPUT
// ============================
const outDir = "./public/geojson/india/states"
fs.mkdirSync(outDir, { recursive: true })

// ============================
// GLOBAL STATS
// ============================
let totalMatched = 0
let totalMissing = 0

console.log("\n🚀 Starting split process...\n")

// ============================
// PROCESS STATES
// ============================
for (const [state, districts] of Object.entries(stateDistrictMap)) {
	// biome-ignore lint/suspicious/noExplicitAny: script uses any for GeoJSON feature lists
	const features: any[] = []
	const missing: string[] = []

	for (const d of districts) {
		const f = featureMap.get(normalize(d))

		if (!f) {
			missing.push(d)
			continue
		}

		features.push(f)
		totalMatched++
	}

	totalMissing += missing.length

	if (features.length === 0) {
		console.warn(`⚠ ${state}: skipped (no matches)`)
		continue
	}

	const fileName = state.toLowerCase().replace(/\s+/g, "-")

	fs.writeFileSync(
		path.join(outDir, `${fileName}.json`),
		JSON.stringify({
			type: "FeatureCollection",
			features,
		}),
	)

	console.log(`✔ ${state}: ${features.length} districts`)

	if (missing.length > 0) {
		console.log(`   ↳ Missing: ${missing.length}`)
		console.log("   ", missing.join(", "))
	}
}

// ============================
// SUMMARY
// ============================
console.log("\n📊 SUMMARY")
console.log(`✔ Matched: ${totalMatched}`)
console.log(`❌ Missing: ${totalMissing}`)
console.log("\n🎉 Done")
