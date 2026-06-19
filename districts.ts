import fs from "node:fs"

// import { normalize } from "node:path"
type Feature = {
	properties?: {
		shapeName?: string
	}
}

// adjust this path to your actual file
const geojson = JSON.parse(
	fs.readFileSync("./public/geojson/india/allStates.json", "utf-8"),
)

const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ")

const stateDistrictMap = JSON.parse(
	fs.readFileSync("./public/geojson/states.json", "utf-8"),
) as Record<string, string[]>

const districtSet = new Set(
	Object.values(stateDistrictMap).flat().map(normalize),
)

const geoDistricts = new Set(
	(geojson.features as Feature[])
		.map((f) => f.properties?.shapeName)
		.filter((s): s is string => typeof s === "string")
		.map(normalize),
)

// 🔥 DIFFERENCE: GeoJSON - DistrictSet
const notInDistrictSet: string[] = []

for (const d of geoDistricts) {
	if (!districtSet.has(d)) {
		notInDistrictSet.push(d)
	}
}

notInDistrictSet.sort()

console.log(
	`❌ In GeoJSON but NOT in districtSet: ${notInDistrictSet.length}\n`,
)

let i = 1
for (const name of notInDistrictSet) {
	console.log(`${i++}: ${name}`)
}
