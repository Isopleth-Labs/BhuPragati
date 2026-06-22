const getProgressTier = (score: number) => {
	if (score >= 75) return "tier-lime"
	if (score >= 72) return "tier-green"
	if (score >= 68) return "tier-cyan"
	if (score >= 64) return "tier-blue"
	if (score >= 62) return "tier-indigo"
	return "tier-purple"
}

interface RankingRow {
	id: string
	name: string
	score: number
}

interface RankingPanelProps {
	activeIndicator: string
	dynamicRanking: RankingRow[]
	selectedStateId: string | null
	onStateClick: (stateId: string) => void
	getIndicatorLabel: (key: string) => string
}

export default function RankingPanel({
	activeIndicator,
	dynamicRanking,
	selectedStateId,
	onStateClick,
	getIndicatorLabel,
}: RankingPanelProps) {
	return (
		<div className="state-panel__ranking">
			<div className="state-panel__table-head state-panel__table-head--slim state-panel__table-head--title">
				<span className="state-panel__section-title state-panel__section-title--inline">
					STATES RANKING BY {getIndicatorLabel(activeIndicator).toUpperCase()}
				</span>
			</div>
			<div className="state-panel__table-head state-panel__table-head--slim">
				<span>#</span>
				<span>State</span>
				<span aria-hidden />
				<span className="state-panel__score">
					{getIndicatorLabel(activeIndicator)}
				</span>
			</div>
			<div className="state-panel__table-body state-panel__table-body--slim">
				{dynamicRanking.map((row, idx) => {
					const fillWidth = (row.score / 100) * 80
					return (
						<button
							key={row.id}
							type="button"
							className={`ranking-row${selectedStateId === row.id ? " is-active" : ""}`}
							onClick={() => onStateClick(row.id)}
						>
							<span className="rank-badge">{idx + 1}</span>
							<span className="state-name">{row.name}</span>
							<div className="ranking-progress" aria-hidden>
								<div
									className={`ranking-progress-fill ${getProgressTier(row.score)}`}
									style={{ width: `${fillWidth}px` }}
								/>
							</div>
							<span className="score-cell">{row.score.toFixed(1)}</span>
						</button>
					)
				})}
			</div>
			<div className="state-panel__ranking-cta">
				<button
					type="button"
					className="state-panel__cta state-panel__cta--slim"
				>
					View All States &amp; UTs <span aria-hidden>→</span>
				</button>
			</div>
		</div>
	)
}
