import HudPanel from "@/shared/ui/dashboard/HudPanel"
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
		<HudPanel
			as="section"
			aria-label="State Intelligence"
			// flex-col layout + padding replace state-main__left; rounded-xl replaces
			// the shared border-radius: 12px group rule for this element.
			className="flex flex-col gap-3.5 p-[24px_20px_20px] rounded-xl"
		>
			<header className="grid gap-1.5">
				{/* Replaces: panel-kicker panel-kicker--sm
				    Uses the final computed values from the --compact compound rule. */}
				<p className="m-0 mb-2 font-['Plus_Jakarta_Sans',Inter,sans-serif] text-[16px] font-extrabold text-white uppercase tracking-[0.08em] [text-shadow:0_0_16px_rgba(169,200,255,0.4),0_0_40px_rgba(100,150,255,0.15)]">
					STATE INTELLIGENCE
				</p>

				{/* Replaces: state-panel__title state-panel__title--compact */}
				<h2 className="m-0 mb-0.5 max-w-full font-['Plus_Jakarta_Sans',Inter,sans-serif] text-[15.5px] font-semibold leading-[1.4] text-[rgba(255,255,255,0.9)] tracking-[-0.01em] whitespace-normal">
					Discover, analyze and compare
				</h2>

				{/* Replaces: state-panel__subtitle state-panel__subtitle--sm */}
				<p className="m-0 font-['Plus_Jakarta_Sans',Inter,sans-serif] text-[14.5px] font-normal leading-[1.45] text-[rgba(255,255,255,0.88)]">
					All 28 States &amp; 8 UTs of India
				</p>
			</header>

			<FilterPanel />

			{/* Replaces: state-panel__section-separator */}
			<div
				className="w-full h-px my-0 bg-[linear-gradient(90deg,transparent,rgba(100,170,255,0.22)_15%,rgba(100,170,255,0.22)_85%,transparent)]"
				aria-hidden
			/>

			<RankingPanel
				activeIndicator={activeIndicator}
				dynamicRanking={dynamicRanking}
				selectedStateId={selectedStateId}
				onStateClick={onStateClick}
				getIndicatorLabel={getIndicatorLabel}
			/>
		</HudPanel>
	)
}
