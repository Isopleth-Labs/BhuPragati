import FilterPanel from "./FilterPanel"
import RankingPanel from "./RankingPanel"

interface RankingRow {
	id: string
	name: string
	score: number
}

interface StateSidebarProps {
	activeIndicator: string
	dynamicRanking: RankingRow[]
	selectedStateId: string | null
	onStateClick: (stateId: string) => void
	getIndicatorLabel: (key: string) => string
}

export default function StateSidebar({
	activeIndicator,
	dynamicRanking,
	selectedStateId,
	onStateClick,
	getIndicatorLabel,
}: StateSidebarProps) {
	return (
		<section
			className="panel-surface state-main__left"
			aria-label="State Intelligence"
		>
			<header className="state-panel__header state-panel__header--compact">
				<p className="panel-kicker panel-kicker--sm">STATE INTELLIGENCE</p>
				<h2 className="state-panel__title state-panel__title--compact">
					Discover, analyze and compare
				</h2>
				<p className="state-panel__subtitle state-panel__subtitle--sm">
					All 28 States &amp; 8 UTs of India
				</p>
			</header>

			<FilterPanel />

			<div className="state-panel__section-separator" aria-hidden />

			<RankingPanel
				activeIndicator={activeIndicator}
				dynamicRanking={dynamicRanking}
				selectedStateId={selectedStateId}
				onStateClick={onStateClick}
				getIndicatorLabel={getIndicatorLabel}
			/>
		</section>
	)
}
