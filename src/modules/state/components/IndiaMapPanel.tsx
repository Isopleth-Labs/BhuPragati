import type React from "react"
import HudPanel from "@/shared/ui/dashboard/HudPanel"

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
		<HudPanel
			as="section"
			className="flex flex-col flex-[1_1_auto] items-center min-w-0 h-full min-h-0 overflow-hidden"
			aria-label="India State Map"
		>
			<div className="flex flex-1 flex-col gap-0 self-stretch w-full p-0 m-0 bg-transparent border-none shadow-none">
				<header className="relative z-10 flex gap-3 items-center justify-between p-[10px_16px] bg-[rgba(4,9,20,0.35)] border-b border-[rgba(92,158,210,0.12)] w-full">
					<div className="flex flex-col gap-0.5">
						<div className="flex items-center gap-3">
							<h2 className="m-0 text-[1rem] font-bold text-white tracking-[0.5px]">
								INDIA INTELLIGENCE MAP
							</h2>
							<span className="p-[2px_8px] text-[9px] font-bold text-[#60a5fa] uppercase tracking-[0.5px] bg-[rgba(59,130,246,0.15)] border border-[rgba(59,130,246,0.3)] rounded-full">
								Active Indicator:{" "}
								{getIndicatorLabel(activeIndicator).toUpperCase()}
							</span>
						</div>
						<p className="mt-0.5 mr-0 mb-0 ml-0 text-[0.82rem] text-[rgba(215,230,245,0.65)]">
							{getIndicatorLabel(activeIndicator)} View
						</p>
					</div>
				</header>
				<div className="relative flex flex-1 min-h-0 p-0 overflow-hidden bg-transparent border-none rounded-none w-full">
					<div
						className="absolute bottom-3 left-3 flex gap-1.5 items-center text-[0.78rem] text-[rgba(255,255,255,0.9)] z-10"
						aria-hidden
					>
						<span>0</span>
						<div className="w-[120px] h-1 bg-[linear-gradient(90deg,rgba(255,255,255,0.45),rgba(255,255,255,0.05))] rounded-full" />
						<span>1000 km</span>
					</div>
					<div className="state-map__canvas relative w-full h-full overflow-hidden rounded-none [&_.gis-map-shell]:absolute [&_.gis-map-shell]:inset-0 [&_.gis-map-shell]:z-0 [&_.gis-map-shell]:w-full [&_.gis-map-shell]:h-full [&_.maplibregl-ctrl-top-right]:hidden">
						{mapSlot}
					</div>
				</div>
			</div>
		</HudPanel>
	)
}
