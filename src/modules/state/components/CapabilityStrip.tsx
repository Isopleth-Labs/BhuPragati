import { Fragment } from "react"
import HudIcon from "@/shared/ui/dashboard/HudIcon"
import HudPanel from "@/shared/ui/dashboard/HudPanel"

type InfoIcon = "landmark" | "house" | "database" | "cpu" | "shield"

const INFO_STRIP_ITEMS: {
	icon: InfoIcon
	color: string
	title: string
	subtitle: string
	variant: string
}[] = [
	{
		icon: "landmark",
		color: "#8bd5ff",
		title: "100% District Coverage",
		subtitle: "All 767 Districts",
		variant: "coverage",
	},
	{
		icon: "house",
		color: "#f4c26b",
		title: "6.4 Lakh+ Villages",
		subtitle: "Complete Rural Coverage",
		variant: "villages",
	},
	{
		icon: "database",
		color: "#7ad1a5",
		title: "200+ Data Parameters",
		subtitle: "Multi-Source Integration",
		variant: "data",
	},
	{
		icon: "cpu",
		color: "#c5a5ff",
		title: "AI-Powered Insights",
		subtitle: "Smart Decision Support",
		variant: "ai",
	},
	{
		icon: "shield",
		color: "#6fd0ff",
		title: "Secure & Reliable",
		subtitle: "Government Grade Security",
		variant: "security",
	},
]

function renderFeatureIcon(icon: InfoIcon) {
	const commonProps = {
		className: "block w-5 h-5",
		stroke: "currentColor",
		fill: "none",
		strokeWidth: 1.7,
		strokeLinecap: "round" as const,
		strokeLinejoin: "round" as const,
	}
	switch (icon) {
		case "landmark":
			return (
				<svg viewBox="0 0 24 24" {...commonProps}>
					<title id="Landmark">Landmark</title>
					<path d="M4 10h16" />
					<path d="M6 10v6" />
					<path d="M10 10v6" />
					<path d="M14 10v6" />
					<path d="M18 10v6" />
					<path d="M3 18h18" />
					<path d="M12 4 4 8h16z" />
				</svg>
			)
		case "house":
			return (
				<svg viewBox="0 0 24 24" {...commonProps}>
					<title id="House">House</title>
					<path d="m3 11 9-7 9 7" />
					<path d="M5 10v9h14v-9" />
					<path d="M10 19v-5h4v5" />
				</svg>
			)
		case "database":
			return (
				<svg viewBox="0 0 24 24" {...commonProps}>
					<title id="Database">Database</title>
					<ellipse cx="12" cy="5" rx="7" ry="3" />
					<path d="M5 5v14c0 1.7 3.1 3 7 3s7-1.3 7-3V5" />
					<path d="M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3" />
				</svg>
			)
		case "cpu":
			return (
				<svg viewBox="0 0 24 24" {...commonProps}>
					<title id="CPU">CPU</title>
					<rect x="7" y="7" width="10" height="10" rx="2" />
					<path d="M10 2v3" />
					<path d="M14 2v3" />
					<path d="M10 19v3" />
					<path d="M14 19v3" />
					<path d="M2 10h3" />
					<path d="M2 14h3" />
					<path d="M19 10h3" />
					<path d="M19 14h3" />
				</svg>
			)
		case "shield":
			return (
				<svg viewBox="0 0 24 24" {...commonProps}>
					<title id="Shield">Shield</title>
					<path d="M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6z" />
					<path d="m9.5 12.5 2 2 3-3" />
				</svg>
			)
		default:
			return null
	}
}

export default function CapabilityStrip() {
	return (
		<HudPanel className="box-border grid grid-cols-1 gap-0 items-center h-14 min-h-[56px] px-8 bg-[linear-gradient(180deg,rgba(11,25,48,0.95),rgba(5,14,28,0.95))] border-[rgba(72,128,255,0.15)] !rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_0_40px_rgba(0,50,120,0.12)] !backdrop-blur-[6px]">
			<div className="flex gap-0 items-center w-full">
				{INFO_STRIP_ITEMS.map((item, index) => (
					<Fragment key={item.title}>
						<div className="flex flex-1 gap-3.5 items-center justify-center min-w-0 h-full px-3 text-[rgba(220,232,248,0.9)]">
							<HudIcon
								size="lg"
								className="!rounded-xl !bg-transparent border-[rgba(255,255,255,0.1)] shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_6px_16px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-[12px] hover:-translate-y-0.5 transition-transform duration-220 ease-[cubic-bezier(0.4,0,0.2,1)]"
								style={{ color: item.color }}
								aria-hidden
							>
								{renderFeatureIcon(item.icon)}
							</HudIcon>
							<div className="flex flex-col gap-0.5 text-left">
								<div className="block text-[0.94rem] font-bold leading-[1.2] text-white tracking-[-0.01em] whitespace-nowrap">
									{item.title}
								</div>
								<div className="block text-[0.8rem] font-medium leading-[1.2] text-[rgba(255,255,255,0.72)] whitespace-nowrap">
									{item.subtitle}
								</div>
							</div>
						</div>
						{index < INFO_STRIP_ITEMS.length - 1 && (
							<span
								className="shrink-0 self-center w-px h-8 bg-[linear-gradient(to_bottom,transparent,rgba(120,180,255,0.25),transparent)] shadow-none opacity-80"
								aria-hidden
							/>
						)}
					</Fragment>
				))}
			</div>
		</HudPanel>
	)
}
