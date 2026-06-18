export type MapEngineHandles = {
	addInfraLayer: (layerId: string) => void
	removeInfraLayer: (layerId: string) => void
	flyToRegion: (center: [number, number], zoom?: number) => void
}
