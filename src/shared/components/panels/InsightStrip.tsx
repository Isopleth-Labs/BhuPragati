import { type ComponentProps, memo } from "react"
import LayerIcon from "@/shared/components/LayerIcon"
import { infrastructureLayers } from "@/shared/lib/config/layers"

function InsightStrip() {
	return (
		<section
			className="panel-surface flex flex-col gap-2.5 pt-3.5 pb-4 px-4 rounded-[10px] max-[820px]:w-full max-[820px]:min-w-0 max-[820px]:max-h-none"
			aria-label="Quick overview"
		>
			<header className="flex items-center">
				<p className="panel-kicker">Kusheshwar Asthan — Quick Overview</p>
			</header>

			<div className="grid grid-cols-5 gap-3 max-[1180px]:grid-cols-[repeat(5,minmax(150px,1fr))] max-[1180px]:overflow-x-auto max-[820px]:flex max-[820px]:overflow-x-auto">
				{infrastructureLayers.map((layer) => (
					<article
						key={layer.id}
						className="grid grid-cols-[44px_minmax(0,1fr)] gap-3 items-center min-h-[76px] py-2.5 px-3.5 bg-[linear-gradient(145deg,color-mix(in_srgb,var(--layer-color)_8%,transparent),transparent_60%),rgba(6,13,22,0.55)] border border-[#99bfde]/10 rounded-lg transition-[border-color,transform,box-shadow] duration-180 ease hover:border-[color-mix(in_srgb,var(--layer-color)_55%,transparent)] hover:shadow-[0_0_22px_color-mix(in_srgb,var(--layer-color)_18%,transparent)] hover:-translate-y-[1px] max-[820px]:min-w-[200px]"
						style={{ "--layer-color": layer.color } as React.CSSProperties}
					>
						<span
							className="inline-flex items-center justify-center w-11 h-11 text-[var(--layer-color)] bg-[color-mix(in_srgb,var(--layer-color)_16%,transparent)] rounded-[10px] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--layer-color)_35%,transparent),0_0_22px_color-mix(in_srgb,var(--layer-color)_22%,transparent)]"
							aria-hidden="true"
						>
							<LayerIcon
								iconKey={
									layer.iconKey as ComponentProps<typeof LayerIcon>["iconKey"]
								}
								size={26}
								strokeWidth={1.4}
							/>
						</span>
						<div className="flex flex-col gap-0.5 min-w-0">
							<span className="text-[0.78rem] text-[#dce8f8]/70 tracking-[0.005em]">
								{layer.intelligenceLabel}
							</span>
							<h3 className="m-0 font-['Barlow_Condensed',Barlow,sans-serif] text-[1.32rem] font-bold leading-[1.05] text-[var(--layer-color)] [text-shadow:0_0_14px_color-mix(in_srgb,var(--layer-color)_60%,transparent)]">
								{layer.verdict}
							</h3>
							<p className="m-0 text-[0.72rem] text-[#bed2e8]/55">
								At {layer.score}/100 {layer.unitNote}
							</p>
						</div>
					</article>
				))}
			</div>
		</section>
	)
}

export default memo(InsightStrip)
