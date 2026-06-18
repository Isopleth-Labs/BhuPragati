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

export interface InfrastructureLayer {
	id: string
	iconKey: string
	label: string
	shortLabel?: string
	intelligenceLabel?: string
	scoreLabel?: string
	legendLabel?: string
	status?: string
	verdict?: string
	unitNote?: string
	score?: number
	trend?: string
	color?: string
	overlay?: string
	mapLayerIds: string[]
	summary?: string
}

export type LayerRegistry = InfrastructureLayer[]
