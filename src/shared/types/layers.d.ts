/**
 * Layer and infrastructure type definitions
 * Matches spec contract: types/layer.ts
 */

export type InfraCategory =
	| "flood"
	| "road"
	| "healthcare"
	| "agriculture"
	| "railway"
	| "electricity"
	| "education"
	| "public_safety"
	| "river"

export type GeometryType = "polygon" | "linestring" | "point"
export type ScoreType = "risk" | "quality"
export type Primitive = string | number | boolean
export type PaintValue =
	| Primitive
	| Primitive[]
	| Record<string, Primitive | Primitive[]>

export interface LayerConfig {
	id: string
	name: string
	name_hi?: string
	description: string
	category: InfraCategory
	geomType: GeometryType
	geojsonPath: string
	minZoom: number
	maxZoom: number
	paint: Record<string, PaintValue>
	layout: Record<string, PaintValue>
	scoreType: ScoreType
	defaultVisible: boolean
	phase: number
}

export interface LayerState {
	visible: boolean
	opacity: number
	activeLayer?: string
}

export interface InfrastructureScore {
	layerId: string
	score: number | null // null = insufficient data
	components?: Record<string, number>
}
