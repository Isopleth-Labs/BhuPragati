import { cn } from "@/shared/lib/utils"

// ── Tier gradient map (replaces ranking-progress-fill.tier-* CSS classes) ───
const TIER_GRADIENT: Record<string, string> = {
	"tier-lime": "bg-[linear-gradient(90deg,#9ae934,#7ad52d)]",
	"tier-green": "bg-[linear-gradient(90deg,#5bd488,#22b976)]",
	"tier-cyan": "bg-[linear-gradient(90deg,#2dd4bf,#0ea5e9)]",
	"tier-blue": "bg-[linear-gradient(90deg,#3b82f6,#1d4ed8)]",
	"tier-indigo": "bg-[linear-gradient(90deg,#6366f1,#4338ca)]",
	"tier-purple": "bg-[linear-gradient(90deg,#8b5cf6,#6d28d9)]",
}

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
		<div className="flex flex-col gap-0">
			{/* Section title row */}
			<div className="flex items-center justify-center w-full text-center">
				<span className="inline-flex gap-2.5 items-center justify-center w-full my-2.5 font-['Plus_Jakarta_Sans',Inter,sans-serif] text-[18px] font-bold leading-[1.25] text-[rgba(255,255,255,0.94)] text-center uppercase tracking-[0.04em] [text-shadow:0_0_12px_rgba(169,200,255,0.35),0_0_30px_rgba(100,150,255,0.15)]">
					STATES RANKING BY {getIndicatorLabel(activeIndicator).toUpperCase()}
				</span>
			</div>

			{/* Column header row */}
			<div className="mt-1 grid grid-cols-[28px_128px_94px_50px] items-center justify-start justify-items-start min-h-[30px] p-2.5 text-[12px] font-bold text-[rgba(255,255,255,0.88)] tracking-[0.04em] whitespace-nowrap bg-transparent">
				<span className="justify-self-center">#</span>
				<span className="justify-self-start pl-1.5 text-left">State</span>
				<span aria-hidden />
				<span className="col-start-4 justify-self-center -ml-2 text-[14px] font-bold tracking-[0.04em]">
					{getIndicatorLabel(activeIndicator)}
				</span>
			</div>

			{/* Ranking rows */}
			<div className="grid auto-rows-[30px] gap-y-0.5 pb-3">
				{dynamicRanking.map((row, idx) => {
					const fillWidth = (row.score / 100) * 80
					const tier = getProgressTier(row.score)
					const isActive = selectedStateId === row.id
					return (
						<button
							key={row.id}
							type="button"
							className={cn(
								// grid columns + base styles from @utility ranking-row-base
								"ranking-row-base text-left font-['Plus_Jakarta_Sans',Inter,sans-serif]",
								// hover & active state
								"hover:bg-[linear-gradient(90deg,rgba(60,120,220,0.08),rgba(40,90,180,0.14))] hover:shadow-[0_8px_24px_rgba(0,80,200,0.18)] hover:-translate-y-[1px]",
								isActive &&
									"bg-[linear-gradient(90deg,rgba(60,120,220,0.08),rgba(40,90,180,0.14))] shadow-[0_8px_24px_rgba(0,80,200,0.18)] -translate-y-[1px]",
							)}
							onClick={() => onStateClick(row.id)}
						>
							{/* Rank badge */}
							<span className="inline-flex items-center justify-center w-[18px] h-[18px] font-['Plus_Jakarta_Sans',Inter,sans-serif] text-[11px] font-medium text-[rgba(255,255,255,0.9)] bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.05),rgba(60,80,120,0.1))] border border-[rgba(200,220,255,0.06)] rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_1px_2px_rgba(0,0,0,0.1)]">
								{idx + 1}
							</span>

							{/* State name */}
							<span className="font-['Plus_Jakarta_Sans',Inter,sans-serif] text-[14px] font-medium text-[#f7fbff] tracking-[-0.01em] whitespace-nowrap">
								{row.name}
							</span>

							{/* Progress bar */}
							<div
								className="justify-self-start w-[94px] max-w-full h-1 mx-0.5 overflow-hidden bg-[rgba(255,255,255,0.1)] rounded-full shadow-[0_0_5px_rgba(80,140,255,0.12)]"
								aria-hidden
							>
								<div
									className={cn(
										"h-full rounded-full shadow-[0_0_4px_rgba(76,175,80,0.14)]",
										TIER_GRADIENT[tier],
									)}
									style={{ width: `${fillWidth}px` }}
								/>
							</div>

							{/* Score */}
							<span className="justify-self-end w-12 font-['Plus_Jakarta_Sans',Inter,sans-serif] text-[14px] font-semibold text-right whitespace-nowrap">
								{row.score.toFixed(1)}
							</span>
						</button>
					)
				})}
			</div>

			{/* CTA */}
			<div className="p-[0_2px_6px] mt-[18px]">
				<button
					type="button"
					className="w-full min-h-[40px] mt-1 px-3 py-2.5 font-['Plus_Jakarta_Sans',Inter,sans-serif] text-[14px] font-semibold text-[rgba(156,198,255,0.9)] tracking-[0.03em] cursor-pointer bg-[rgba(4,12,28,0.85)] border border-[rgba(100,150,255,0.14)] rounded-[8px] transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:text-white hover:bg-[rgba(6,18,42,0.95)] hover:border-[rgba(100,150,255,0.25)] hover:shadow-[0_4px_14px_rgba(100,150,255,0.06)]"
				>
					View All States &amp; UTs <span aria-hidden>→</span>
				</button>
			</div>
		</div>
	)
}
