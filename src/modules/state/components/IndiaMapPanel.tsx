import type React from "react"

interface IndiaMapPanelProps {
	activeIndicator: string
	getIndicatorLabel: (key: string) => string
	mapSlot: React.ReactNode
}

export default function IndiaMapPanel({
	activeIndicator,
	getIndicatorLabel,
	mapSlot,
}: IndiaMapPanelProps) {
	return (
		<section
			className="panel-surface state-main__map"
			aria-label="India State Map"
		>
			<div className="state-map__card">
				<header className="state-map__header">
					<div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
						<div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
							<h2 className="state-map__title" style={{ margin: 0 }}>
								INDIA INTELLIGENCE MAP
							</h2>
							<span className="state-indicator-badge">
								Active Indicator:{" "}
								{getIndicatorLabel(activeIndicator).toUpperCase()}
							</span>
						</div>
						<p className="state-map__subtitle" style={{ margin: 0 }}>
							{getIndicatorLabel(activeIndicator)} View
						</p>
					</div>
				</header>
				<div className="state-map__body">
					<div className="state-map__scale" aria-hidden>
						<span>0</span>
						<div className="state-map__scale-bar" />
						<span>1000 km</span>
					</div>
					<div className="state-map__canvas relative w-full h-full overflow-hidden rounded-none [&_.gis-map-shell]:absolute [&_.gis-map-shell]:inset-0 [&_.gis-map-shell]:z-0 [&_.gis-map-shell]:w-full [&_.gis-map-shell]:h-full [&_.maplibregl-ctrl-top-right]:hidden">
						{mapSlot}
					</div>
				</div>
			</div>
		</section>
	)
}
