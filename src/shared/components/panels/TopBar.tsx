import { memo } from "react"
import { dashboardMeta, operationalStats } from "@/shared/lib/metadata/metadata"

// Premium top HUD: compact metadata mini-cards + brand card.
function TopBar() {
	return (
		<header className="flex flex-wrap gap-[14px] items-stretch justify-end mt-1.5 max-[1180px]:gap-2 max-[820px]:w-full max-[820px]:min-w-0 max-[820px]:max-h-none max-[820px]:flex-col max-[820px]:items-stretch">
			<dl className="flex gap-3 p-0 m-0 list-none max-[820px]:flex-wrap">
				{operationalStats.map((stat) => (
					<div
						key={stat.label}
						className="panel-surface min-w-[112px] py-3 px-4 rounded-[10px] backdrop-blur-[32px] backdrop-saturate-[1.3] max-[820px]:flex-[1_1_calc(50%-4px)] max-[480px]:basis-full"
					>
						<dt className="m-0 mb-1.5 text-[0.62rem] font-semibold text-[#a0c8eb]/62 uppercase tracking-[0.2em]">
							{stat.label}
						</dt>
						<dd className="m-0 text-[0.92rem] font-semibold leading-[1.2] text-white whitespace-nowrap">
							{stat.value}
						</dd>
					</div>
				))}
			</dl>

			<div className="panel-surface flex gap-[14px] items-center min-w-[260px] pt-3.5 pb-3.5 pr-5 pl-[18px] rounded-[10px] backdrop-blur-[32px] backdrop-saturate-[1.3]">
				<span
					className="flex-none w-2 h-2 bg-[#ff4035] rounded-full shadow-[0_0_14px_rgba(255,64,53,0.95),0_0_4px_#ff4035] animate-[brand-pulse_1.6s_ease-in-out_infinite]"
					aria-hidden="true"
				/>
				<div>
					<p className="m-0 mb-0.5 text-[0.66rem] text-[#a0c8eb]/62 tracking-[0.06em]">
						{dashboardMeta.kicker}
					</p>
					<h1 className="m-0 text-[0.96rem] font-bold leading-[1.2] tracking-[0.005em]">
						{dashboardMeta.title}
					</h1>
				</div>
			</div>
		</header>
	)
}

export default memo(TopBar)
