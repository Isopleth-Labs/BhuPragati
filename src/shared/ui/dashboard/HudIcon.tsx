import { memo } from "react"
import { cn } from "@/shared/lib/utils"

// ── HudIcon ───────────────────────────────────────────────────────────────────
// Primitive square icon container shared by:
//   - state-bottom__icon     (IndicatorCard)
//   - state-overview__icon   (IndiaOverviewPanel / NationalOverviewPanel)
//   - state-overview__stats-icon (NationalOverviewPanel)
//   - state-infra-summary__icon  (InfrastructureSummaryPanel)
//
// All four legacy classes share the same structural pattern:
//   flex + shrink-0 + centered children + icon-bg / icon-border / icon-glow
//   CSS custom properties + border-radius + transition.
//
// The `size` prop maps to common pixel widths used in the dashboard:
//   sm  → w-[30px] h-[30px]   (IndicatorCard icon)
//   md  → w-[36px] h-[36px]   (overview / infra icons)
//   lg  → w-[40px] h-[40px]   (feature strip icons)
//
// CSS custom properties (--icon-bg, --icon-border, --icon-glow) must be set
// by the parent via the `style` prop — identical to the existing pattern in
// IndicatorCard.getIconStyles().
//
// Usage:
//   <HudIcon size="md" style={getIconStyles(card.color)} aria-hidden>
//     <SomeIcon />
//   </HudIcon>
// ─────────────────────────────────────────────────────────────────────────────

type HudIconSize = "sm" | "md" | "lg"

interface HudIconProps {
	size?: HudIconSize
	className?: string
	children?: React.ReactNode
	style?: React.CSSProperties
	"aria-hidden"?: true | "true"
}

const SIZE_CLASSES: Record<HudIconSize, string> = {
	sm: "w-[30px] h-[30px]",
	md: "w-[36px] h-[36px]",
	lg: "w-[40px] h-[40px] min-w-[40px]",
}

function HudIcon({
	size = "md",
	className,
	children,
	style,
	"aria-hidden": ariaHidden,
}: HudIconProps) {
	return (
		<span
			className={cn("hud-icon", SIZE_CLASSES[size], className)}
			style={style}
			aria-hidden={ariaHidden}
		>
			{children}
		</span>
	)
}

export default memo(HudIcon)
