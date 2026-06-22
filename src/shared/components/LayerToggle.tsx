import { memo, useCallback } from "react"
import type { CSSVars } from "@/shared/styles/types"
import type { InfrastructureLayer } from "@/shared/types"
import LayerIcon from "./LayerIcon"

// Tactical layer-toggle row. Compact, icon-led, used in the
// command panel layer list.

type LayerToggleProps = {
	layer: InfrastructureLayer
	isActive: boolean
	onToggle: (id: string) => void
}

function LayerToggle({ layer, isActive, onToggle }: LayerToggleProps) {
	const handleClick = useCallback(
		() => onToggle(layer.id),
		[layer.id, onToggle],
	)

	const style: CSSVars = { "--layer-color": layer.color ?? "transparent" }

	return (
		<button
			type="button"
			className="group grid grid-cols-[30px_minmax(0,1fr)_12px] gap-3 items-center w-full min-h-[44px] py-[9px] px-3 text-[0.86rem] text-[#e1ebfa]/90 text-left cursor-pointer bg-[linear-gradient(145deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01)),rgba(5,12,20,0.55)] border border-[#99bfde]/10 rounded-lg transition-[border-color,background,transform] duration-180 ease hover:outline-none focus-visible:outline-none hover:border-[color-mix(in_srgb,var(--layer-color)_55%,transparent)] focus-visible:border-[color-mix(in_srgb,var(--layer-color)_55%,transparent)] hover:translate-x-[1px] focus-visible:translate-x-[1px] aria-pressed:text-white aria-pressed:bg-[linear-gradient(90deg,color-mix(in_srgb,var(--layer-color)_18%,transparent),transparent_75%),rgba(255,255,255,0.025)] aria-pressed:border-[color-mix(in_srgb,var(--layer-color)_65%,transparent)] aria-pressed:shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--layer-color)_22%,transparent),0_0_22px_color-mix(in_srgb,var(--layer-color)_16%,transparent)]"
			style={style}
			aria-pressed={isActive}
			onClick={handleClick}
			title={layer.summary}
		>
			<span
				className="inline-flex items-center justify-center w-[30px] h-[30px] text-[var(--layer-color)] bg-[color-mix(in_srgb,var(--layer-color)_14%,transparent)] rounded-[7px] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--layer-color)_28%,transparent)] group-aria-pressed:bg-[color-mix(in_srgb,var(--layer-color)_24%,transparent)] group-aria-pressed:shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--layer-color)_50%,transparent),0_0_18px_color-mix(in_srgb,var(--layer-color)_36%,transparent)]"
				aria-hidden="true"
			>
				<LayerIcon iconKey={layer.iconKey} size={18} />
			</span>
			<span className="font-semibold tracking-[0.005em]">
				{layer.intelligenceLabel}
			</span>
			<span
				className="w-1.5 h-1.5 bg-white/16 rounded-full transition-[background,box-shadow] duration-180 ease group-aria-pressed:bg-[var(--layer-color)] group-aria-pressed:shadow-[0_0_10px_var(--layer-color)]"
				aria-hidden="true"
			/>
		</button>
	)
}

export default memo(LayerToggle)
