export const TEXT_FIELD = ["get", "name"]
export const TEXT_FONT = ["Open Sans Semibold", "Arial Unicode MS Bold"]

export const TEXT_SIZE = [
	"interpolate",
	["linear"],
	["zoom"],
	8,
	["match", ["get", "place"], "city", 15, "town", 9, 0],
	11,
	["match", ["get", "place"], "city", 24, "town", 13, 0],
	13,
	["match", ["get", "place"], "city", 30, "town", 15, "village", 10.5, 8],
	16,
	["match", ["get", "place"], "city", 38, "town", 20, "village", 14, 11],
]

export const TEXT_LETTER_SPACING = [
	"match",
	["get", "place"],
	"city",
	0.06,
	"town",
	0.04,
	0.02,
]

export const TEXT_OFFSET = [0, 1.2]
export const TEXT_ANCHOR = "top"
export const TEXT_PADDING = 5
export const TEXT_ALLOW_OVERLAP = false

export const SYMBOL_SORT_KEY = [
	"match",
	["get", "place"],
	"city",
	1,
	"town",
	2,
	"village",
	3,
	4,
]

export const TEXT_COLOR = [
	"match",
	["get", "place"],
	"city",
	"rgba(255, 255, 255, 0.96)",
	"town",
	"rgba(225, 235, 250, 0.84)",
	"village",
	"rgba(190, 205, 225, 0.6)",
	"rgba(170, 185, 205, 0.5)",
]

export const TEXT_HALO_COLOR = "rgba(4, 10, 18, 0.94)"
export const TEXT_HALO_WIDTH = [
	"match",
	["get", "place"],
	"city",
	2,
	"town",
	1.4,
	1,
]
export const TEXT_HALO_BLUR = 0.6
