import type React from "react"
import { useEffect, useMemo } from "react"
import { STATE_INDICATORS_DATA } from "@/data/state-indicators"
import IndiaMapPanel from "./components/IndiaMapPanel"
import IndiaOverviewPanel from "./components/IndiaOverviewPanel"
import IndicatorStrip from "./components/IndicatorStrip"
import StateDashboardHeader from "./components/StateDashboardHeader"
import StateSidebar from "./components/StateSidebar"
import "./state-dashboard.css"

interface StateIntelligenceDashboardProps {
	activeIndicator: string
	onSetIndicator: (indicator: string) => void
	selectedStateId: string | null
	onStateClick: (stateId: string) => void
	resolvedMode: "day" | "night"
	onToggleTheme: () => void
	mapSlot: React.ReactNode
}

export default function StateIntelligenceDashboard({
	activeIndicator,
	onSetIndicator,
	selectedStateId,
	onStateClick,
	resolvedMode,
	onToggleTheme,
	mapSlot,
}: StateIntelligenceDashboardProps) {
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

	const dynamicRanking = useMemo(() => {
		return Object.values(STATE_INDICATORS_DATA)
			.map((state) => ({
				id: state.id,
				name: state.name,
				score:
					state.metrics[activeIndicator as keyof typeof state.metrics] ?? 0,
			}))
			.sort((a, b) => b.score - a.score)
			.slice(0, 8)
	}, [activeIndicator])

	const handleCardClick = (cardKey: string) => {
		onSetIndicator(activeIndicator === cardKey ? "overall" : cardKey)
	}

	useEffect(() => {
		const root = document.documentElement
		if (resolvedMode === "day") {
			root.classList.add("theme-light")
			root.classList.remove("theme-dark")
			root.setAttribute("data-theme", "light")
		} else {
			root.classList.add("theme-dark")
			root.classList.remove("theme-light")
			root.setAttribute("data-theme", "dark")
		}
	}, [resolvedMode])

	return (
		<div className="state-dashboard">
			<StateDashboardHeader
				resolvedMode={resolvedMode}
				onToggleTheme={onToggleTheme}
			/>

			<div className="state-dashboard__main">
				<StateSidebar
					activeIndicator={activeIndicator}
					dynamicRanking={dynamicRanking}
					selectedStateId={selectedStateId}
					onStateClick={onStateClick}
					getIndicatorLabel={getIndicatorLabel}
				/>

				<IndiaMapPanel
					activeIndicator={activeIndicator}
					getIndicatorLabel={getIndicatorLabel}
					mapSlot={mapSlot}
				/>

				<IndiaOverviewPanel />
			</div>

			<IndicatorStrip
				activeIndicator={activeIndicator}
				onCardClick={handleCardClick}
			/>
		</div>
	)
}
