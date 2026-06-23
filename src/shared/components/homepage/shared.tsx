import type React from "react"
import { cn } from "@/shared/lib/utils"

// ─── Eyebrow label ───────────────────────────────────────
export function Eyebrow({
	children,
	className,
}: {
	children: React.ReactNode
	className?: string
}) {
	return (
		<p
			className={cn(
				"mb-[10px] text-[11px] font-bold text-[#6ad1ff] uppercase tracking-[0.14em]",
				className,
			)}
		>
			{children}
		</p>
	)
}

// ─── Section heading ─────────────────────────────────────
export function SectionHeading({
	children,
	className,
}: {
	children: React.ReactNode
	className?: string
}) {
	return (
		<h2
			className={cn(
				"mt-[10px] mb-3 text-[clamp(26px,3.2vw,34px)] font-extrabold leading-[1.2]",
				className,
			)}
		>
			{children}
		</h2>
	)
}

// ─── Section body ─────────────────────────────────────────
export function SectionBody({
	children,
	className,
}: {
	children: React.ReactNode
	className?: string
}) {
	return (
		<p
			className={cn(
				"max-w-[360px] text-[14px] leading-[1.65] text-[#9fb0c8] max-[900px]:max-w-full",
				className,
			)}
		>
			{children}
		</p>
	)
}

// ─── Primary CTA button ───────────────────────────────────
export function BtnPrimary({
	children,
	className,
	...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { className?: string }) {
	return (
		<a
			className={cn(
				// base btn
				"inline-flex gap-[14px] items-center justify-center min-h-[58px] px-8",
				"text-[13px] font-extrabold uppercase no-underline cursor-pointer",
				"border rounded-lg transition-[transform,box-shadow,background] duration-150",
				"hover:-translate-y-px",
				// primary variant
				"text-[#08101c]",
				"bg-[linear-gradient(180deg,#ffd76a,#e7aa25)]",
				"border-[rgba(255,221,126,0.78)]",
				"shadow-[0_10px_34px_rgba(247,198,75,0.34),inset_0_1px_0_rgba(255,255,255,0.36)]",
				"hover:shadow-[0_15px_44px_rgba(247,198,75,0.44),inset_0_1px_0_rgba(255,255,255,0.42)]",
				// mobile
				"max-[720px]:min-h-[48px] max-[720px]:px-[22px] max-[720px]:text-[11px]",
				className,
			)}
			{...props}
		>
			{children}
		</a>
	)
}

// ─── Secondary CTA button ─────────────────────────────────
export function BtnSecondary({
	children,
	className,
	...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { className?: string }) {
	return (
		<a
			className={cn(
				// base btn
				"inline-flex gap-[14px] items-center justify-center min-h-[58px] px-8",
				"text-[13px] font-extrabold uppercase no-underline cursor-pointer",
				"border rounded-lg transition-[transform,box-shadow,background] duration-150",
				"hover:-translate-y-px",
				// secondary variant
				"text-[#6ad1ff]",
				"bg-[rgba(106,209,255,0.02)]",
				"border-[rgba(106,209,255,0.3)]",
				"shadow-[inset_0_0_12px_rgba(106,209,255,0.03)]",
				"hover:bg-[rgba(106,209,255,0.08)] hover:border-[#6ad1ff] hover:shadow-[0_0_16px_rgba(106,209,255,0.15)]",
				// mobile
				"max-[720px]:min-h-[48px] max-[720px]:px-[22px] max-[720px]:text-[11px]",
				className,
			)}
			{...props}
		>
			{children}
		</a>
	)
}

// ─── Arrow chevron inside buttons ─────────────────────────
export function BtnArrow() {
	return (
		<span
			aria-hidden="true"
			className="inline-block w-2 h-2 border-t-2 border-r-2 border-current rotate-45"
		/>
	)
}
