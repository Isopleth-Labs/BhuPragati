import { type ComponentPropsWithoutRef, type ElementType, memo } from "react"
import { cn } from "@/shared/lib/utils"

// ── HudPanel ─────────────────────────────────────────────────────────────────
// Primitive wrapper for the translucent dark glass panels used across the
// State Intelligence Dashboard (sidebar, right column, map overlay cards).
//
// Applies the `hud-panel` @utility defined in src/styles.css which centralises
// the shared glassmorphic surface: rgba(4,12,28,0.88) background, neon blue
// border, deep box-shadow, and backdrop-filter blur(20px).
//
// Usage:
//   <HudPanel as="section" aria-label="State Intelligence" className="…">
//     …children…
//   </HudPanel>
//
// DO NOT add inline background / border / shadow overrides here — override via
// className at the call-site so the audit trail remains clear.
// ─────────────────────────────────────────────────────────────────────────────

type HudPanelProps<T extends ElementType = "div"> = {
	as?: T
	className?: string
	children?: React.ReactNode
	"aria-label"?: string
} & Omit<ComponentPropsWithoutRef<T>, "className" | "children" | "aria-label">

function HudPanel<T extends ElementType = "div">({
	as: Tag = "div" as T,
	className,
	children,
	"aria-label": ariaLabel,
	...rest
}: HudPanelProps<T>) {
	const Tag_ = Tag as ElementType
	return (
		<Tag_
			className={cn("hud-panel", className)}
			aria-label={ariaLabel}
			{...rest}
		>
			{children}
		</Tag_>
	)
}

export default memo(HudPanel)
