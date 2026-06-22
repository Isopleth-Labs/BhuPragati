import { useState } from "react"
import { useMapReady } from "#/shared/map/hooks/useMapReady"
import { INDIA_INITIAL_VIEW_STATE } from "@/shared/lib/config/mapConfig"

interface StateMapOverlaysProps {
	activeIndicator: string
	onReset: () => void
}

export default function StateMapOverlays({
	activeIndicator,
	onReset,
}: StateMapOverlaysProps) {
	const map = useMapReady()
	const [showLegend, setShowLegend] = useState(true)

	const getIndicatorLabel = (key: string) => {
		switch (key) {
			case "overall":
				return "Overall Index"
			case "population":
				return "Population Index"
			case "infrastructure":
				return "Infrastructure Index"
			case "health":
				return "Health Index"
			case "education":
				return "Education Index"
			case "agriculture":
				return "Agriculture Index"
			case "connectivity":
				return "Connectivity Index"
			case "power":
				return "Power Coverage"
			default:
				return "Index"
		}
	}

	const handleResetView = () => {
		if (map) {
			map.easeTo({
				center: INDIA_INITIAL_VIEW_STATE.center,
				zoom: INDIA_INITIAL_VIEW_STATE.zoom,
				pitch: INDIA_INITIAL_VIEW_STATE.pitch,
				bearing: INDIA_INITIAL_VIEW_STATE.bearing,
				duration: 800,
			})
		}
		onReset()
	}

	const handleZoomIn = () => {
		if (map) map.zoomIn({ duration: 200 })
	}

	const handleZoomOut = () => {
		if (map) map.zoomOut({ duration: 200 })
	}

	return (
		<>
			{/* Top-Right Custom Controls overlay */}
			<div className="absolute top-4 right-4 z-10 flex items-center bg-[rgba(3,8,20,0.85)] border border-[rgba(120,160,220,0.16)] rounded-[8px] overflow-hidden backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5)] pointer-events-auto">
				<button
					type="button"
					onClick={() => setShowLegend((prev) => !prev)}
					className={`flex gap-1.5 items-center h-8 px-2.5 text-[12px] cursor-pointer transition-colors duration-150 border-none outline-none ${
						showLegend
							? "bg-[rgba(59,130,246,0.25)] text-[#60a5fa] font-bold"
							: "text-white/80 hover:bg-white/5 hover:text-white"
					}`}
				>
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<title>Toggle Legend</title>
						<line x1="8" y1="6" x2="21" y2="6" />
						<line x1="8" y1="12" x2="21" y2="12" />
						<line x1="8" y1="18" x2="21" y2="18" />
						<line x1="3" y1="6" x2="3.01" y2="6" />
						<line x1="3" y1="12" x2="3.01" y2="12" />
						<line x1="3" y1="18" x2="3.01" y2="18" />
					</svg>
					<span>Legend</span>
				</button>
				<span className="shrink-0 w-[1px] h-4 bg-[rgba(120,160,220,0.22)]" />
				<button
					type="button"
					onClick={handleResetView}
					className="flex gap-1.5 items-center h-8 px-2.5 text-[12px] text-white/80 hover:bg-white/5 hover:text-white border-none outline-none cursor-pointer transition-colors duration-150"
				>
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<title>Reset view</title>
						<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
						<path d="M21 3v5h-5" />
						<path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
						<path d="M3 21v-5h5" />
					</svg>
					<span>Reset View</span>
				</button>
				<span className="shrink-0 w-[1px] h-4 bg-[rgba(120,160,220,0.22)]" />
				<button
					type="button"
					onClick={handleZoomIn}
					className="w-8 h-8 flex items-center justify-center text-white/80 hover:bg-white/5 hover:text-white border-none outline-none cursor-pointer transition-colors duration-150"
				>
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<title>Zoom In</title>
						<line x1="12" y1="5" x2="12" y2="19" />
						<line x1="5" y1="12" x2="19" y2="12" />
					</svg>
				</button>
				<span className="shrink-0 w-[1px] h-4 bg-[rgba(120,160,220,0.22)]" />
				<button
					type="button"
					onClick={handleZoomOut}
					className="w-8 h-8 flex items-center justify-center text-white/80 hover:bg-white/5 hover:text-white border-none outline-none cursor-pointer transition-colors duration-150"
				>
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<title>Zoom Out</title>
						<line x1="5" y1="12" x2="19" y2="12" />
					</svg>
				</button>
				<span className="shrink-0 w-[1px] h-4 bg-[rgba(120,160,220,0.22)]" />
				<button
					type="button"
					onClick={() => {
						if (map) {
							map.easeTo({ bearing: 0, pitch: 0, duration: 500 })
						}
					}}
					className="w-8 h-8 flex items-center justify-center text-white/80 hover:bg-white/5 hover:text-white border-none outline-none cursor-pointer transition-colors duration-150"
				>
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<title>Compass</title>
						<polygon points="3 11 22 2 13 21 11 13 3 11" />
					</svg>
				</button>
			</div>

			{/* Bottom-Right Legend Panel overlay */}
			{showLegend && (
				<div className="absolute bottom-12 right-4 z-10 w-[220px] p-3.5 bg-[rgba(4,12,28,0.88)] border border-[rgba(100,150,255,0.14)] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-[20px] pointer-events-auto">
					<h3 className="m-0 mb-2.5 text-[10px] font-extrabold text-[#38bdf8] uppercase tracking-[0.08em] [text-shadow:0_0_8px_rgba(56,189,248,0.25)]">
						{getIndicatorLabel(activeIndicator)}
					</h3>
					<ul className="flex flex-col gap-2 p-0 m-0 list-none">
						<li className="flex gap-2.5 items-center text-[11px] text-[#e1ebfa]/85 font-medium">
							<span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-[#9ae934] to-[#7ad52d] shadow-[0_0_8px_rgba(154,233,52,0.4)]" />
							<span className="w-14 shrink-0 font-bold text-white/90">
								80 - 100
							</span>
							<span className="text-[10px] text-white/70">Very High</span>
						</li>
						<li className="flex gap-2.5 items-center text-[11px] text-[#e1ebfa]/85 font-medium">
							<span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-[#5bd488] to-[#22b976] shadow-[0_0_8px_rgba(91,212,136,0.4)]" />
							<span className="w-14 shrink-0 font-bold text-white/90">
								60 - 80
							</span>
							<span className="text-[10px] text-white/70">High</span>
						</li>
						<li className="flex gap-2.5 items-center text-[11px] text-[#e1ebfa]/85 font-medium">
							<span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-[#2dd4bf] to-[#0ea5e9] shadow-[0_0_8px_rgba(45,212,191,0.4)]" />
							<span className="w-14 shrink-0 font-bold text-white/90">
								40 - 60
							</span>
							<span className="text-[10px] text-white/70">Medium</span>
						</li>
						<li className="flex gap-2.5 items-center text-[11px] text-[#e1ebfa]/85 font-medium">
							<span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
							<span className="w-14 shrink-0 font-bold text-white/90">
								20 - 40
							</span>
							<span className="text-[10px] text-white/70">Low</span>
						</li>
						<li className="flex gap-2.5 items-center text-[11px] text-[#e1ebfa]/85 font-medium">
							<span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] shadow-[0_0_8px_rgba(139,92,246,0.4)]" />
							<span className="w-14 shrink-0 font-bold text-white/90">
								0 - 20
							</span>
							<span className="text-[10px] text-white/70">Very Low</span>
						</li>
					</ul>
					<div className="w-full h-[1px] my-2.5 bg-gradient-to-r from-transparent via-[rgba(100,170,255,0.16)] to-transparent" />
					<p className="m-0 text-[9px] leading-1.25 text-[rgba(215,230,245,0.62)]">
						Higher values indicate better performance
					</p>
				</div>
			)}
		</>
	)
}
