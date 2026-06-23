import { memo } from "react"
import { cn } from "@/shared/lib/utils"

// ── MetricPanel ───────────────────────────────────────────────────────────────
// Primitive card surface for telemetry / overview metric items — the cards
// rendered inside the bottom indicator strip, the India Overview 3-col grid,
// and the national statistics 2-col grid.
//
// Applies the `metric-card` @utility from src/styles.css:
//   - translucent dark gradient background
//   - neon blue border with 16% alpha
//   - deep box-shadow with subtle inset glint
//   - smooth transition for hover / active states
//
// The component intentionally does NOT render any text content; callers are
// responsible for composing the inner layout so this stays composable.
//
// Props:
//   isActive  – adds the choropleth active-selection highlight style
//   cardColor – CSS custom property value fed to --card-color for
//               the active border / glow (matches IndicatorCard contract)
//   className – merged on top of metric-card utility
//
// Usage:
//   <MetricPanel isActive={activeIndicator === card.key}
//                cardColor={card.color}
//                onClick={handleClick}>
//     …
//   </MetricPanel>
// ─────────────────────────────────────────────────────────────────────────────

interface MetricPanelProps {
	isActive?: boolean
	cardColor?: string
	className?: string
	children?: React.ReactNode
	onClick?: () => void
	style?: React.CSSProperties
}

function MetricPanel({
	isActive = false,
	cardColor,
	className,
	children,
	onClick,
	style,
}: MetricPanelProps) {
	const inlineVars = cardColor
		? ({ "--card-color": cardColor, ...style } as React.CSSProperties)
		: style

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: metric panel click is supplementary
		// biome-ignore lint/a11y/noStaticElementInteractions: metric panel acts as clickable wrapper
		<div
			className={cn("metric-card", isActive && "is-active", className)}
			style={inlineVars}
			onClick={onClick}
		>
			{children}
		</div>
	)
}

export default memo(MetricPanel)
