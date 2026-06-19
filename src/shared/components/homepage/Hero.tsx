import { Link } from "@tanstack/react-router"
import GlobeViz from "@/shared/components/globe/GlobeViz"
import CapabilityStrip from "@/shared/components/homepage/CapabilityStrip"

const HEALTHCARE_METRICS = [
	{
		label: "Total Facilities",
		value: "1,48,734",
		change: "+2.4%",
		trend: "up",
	},
	{
		label: "Population Coverage",
		value: "92.6%",
		change: "+1.8%",
		trend: "up",
		progress: 82,
	},
	{ label: "Critical Districts", value: "284", change: "-3.2%", trend: "down" },
]

const FLOOD_METRICS = [
	{ label: "At Risk Districts", value: "312", change: "+5.6%", trend: "alert" },
	{
		label: "Affected Population",
		value: "2.8M",
		change: "+7.3%",
		trend: "alert",
		progress: 68,
	},
	{
		label: "Rainfall (24h)",
		value: "118.6 mm",
		change: "+12.4%",
		trend: "alert",
	},
]

const TREND_COLOR: Record<"up" | "down" | "alert", string> = {
	up: "text-[#5de582]",
	down: "text-[#5de582]",
	alert: "text-[#ff654f]",
}

type Metric = {
	label: string
	value: string
	change: string
	trend: "up" | "down" | "alert"
	progress?: number
}

function Sparkline({ tone }: { tone: string }) {
	return (
		<svg
			className="block w-full h-[28px] mt-3 overflow-visible"
			data-tone={tone}
			viewBox="0 0 150 30"
			aria-hidden="true"
		>
			<path
				className="fill-none stroke-[rgba(194,220,244,0.78)] stroke-[1.4]"
				d="M2 21 C18 22 24 17 38 19 S60 25 74 18 96 20 108 10 128 8 148 13"
			/>
		</svg>
	)
}

function StatPanel({
	side,
	title,
	type,
	metrics,
	linkLabel,
	href,
}: {
	side: "left" | "right"
	title: string
	type: "health" | "flood"
	metrics: Metric[]
	linkLabel: string
	href: string
}) {
	return (
		<aside
			className={`absolute z-[4] w-[clamp(220px,17vw,258px)] top-[clamp(148px,25vh,208px)] ${
				side === "left"
					? "left-[clamp(16px,2.5vw,42px)]"
					: "right-[clamp(16px,2.5vw,42px)]"
			}`}
			aria-label={title}
		>
			<div className="min-h-[300px] px-[22px] pt-[22px] pb-[18px] bg-[rgba(8,12,20,0.35)] border border-white/[0.08] rounded-[10px] shadow-[0_12px_32px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-[20px] transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:bg-[rgba(8,12,20,0.45)] hover:border-white/[0.15] hover:shadow-[0_20px_48px_rgba(0,0,0,0.4),0_0_32px_rgba(255,255,255,0.02),inset_0_1px_0_rgba(255,255,255,0.1)]">
				<div className="flex items-center gap-3 min-h-[44px] pb-[17px] mb-[18px] text-[11px] font-extrabold text-[#eef7ff] uppercase border-b border-white/[0.08]">
					<span
						className={`stat-panel__symbol stat-panel__symbol--${type} relative inline-flex shrink-0 w-[22px] h-[22px]`}
						aria-hidden="true"
					/>
					<span>{title}</span>
				</div>

				{metrics.map((metric, index) => (
					<div
						className="pb-[14px] mb-5 border-b border-white/[0.08] last-of-type:mb-0"
						key={metric.label}
					>
						<p className="mb-1.5 text-[9px] font-bold text-[#7f91a9] uppercase">
							{metric.label}
						</p>
						<p className="flex items-baseline justify-between gap-3 text-[22px] font-medium leading-[1.12] text-white">
							<span>{metric.value}</span>
							<span
								className={`inline-flex items-center gap-1 text-[10px] font-extrabold whitespace-nowrap ${TREND_COLOR[metric.trend]}`}
							>
								{metric.change}
								<span
									className={`stat-panel__direction${
										metric.trend === "down"
											? " stat-panel__direction--down"
											: ""
									}`}
									aria-hidden="true"
								/>
							</span>
						</p>
						{index === 0 && <Sparkline tone={type} />}
						{metric.progress && (
							<span className="block h-[5px] mt-[13px] overflow-hidden bg-[rgba(116,140,169,0.25)] rounded-full">
								<span
									className="block h-full rounded-[inherit] bg-gradient-to-r from-[#78a7ff] to-[#9db9ff]"
									style={{ width: `${metric.progress}%` }}
								/>
							</span>
						)}
					</div>
				))}

				<a
					className="flex items-center justify-between mt-[18px] text-[10px] font-extrabold text-[#b8cadc] uppercase no-underline transition-colors duration-200 hover:text-[#6ad1ff]"
					href={href}
				>
					{linkLabel}
					<span className="stat-panel__link-arrow" aria-hidden="true" />
				</a>
			</div>
		</aside>
	)
}

function Hero() {
	return (
		<section
			className="relative box-border flex items-center justify-center h-screen min-h-screen px-[clamp(30px,4.8vw,78px)] pt-[72px] pb-[110px] overflow-hidden bg-black isolate"
			id="top"
		>
			<div className="absolute inset-0 z-[1] pointer-events-none">
				<div className="absolute top-[-40px] left-0 w-full h-[calc(100%+40px)] pointer-events-auto">
					<GlobeViz />
				</div>
			</div>

			<StatPanel
				side="left"
				title="Healthcare Analytics"
				type="health"
				metrics={HEALTHCARE_METRICS}
				linkLabel="View Analytics"
				href="#healthcare-analytics"
			/>

			<StatPanel
				side="right"
				title="Flood Monitoring"
				type="flood"
				metrics={FLOOD_METRICS}
				linkLabel="View Flood Map"
				href="#flood-map"
			/>

			<div className="relative z-[5] flex flex-col items-center max-w-[780px] mt-[clamp(76px,20vh,172px)] text-center">
				<p className="mb-2 text-[15px] font-medium text-white/80 uppercase tracking-[0.05em] [text-shadow:0_2px_22px_rgba(0,0,0,0.95)]">
					EARTH INTELLIGENCE PLATFORM
				</p>
				<h1 className="text-[clamp(56px,6.2vw,84px)] font-extrabold leading-none text-white [text-shadow:0_4px_36px_rgba(0,0,0,0.82)]">
					Better Bharat Map
				</h1>
				<p className="max-w-[720px] mt-[18px] text-[21px] font-normal text-[rgba(238,244,251,0.9)] [text-shadow:0_2px_18px_rgba(0,0,0,0.85)]">
					Visualizing Infrastructure, Development and Public Data
				</p>
				<div className="mt-[52px]">
					<Link
						to="/state-map"
						className="inline-flex items-center justify-center gap-3.5 min-w-[400px] min-h-[76px] px-16 text-[22px] font-extrabold tracking-[0.02em] uppercase no-underline text-[#08101c] rounded-lg border border-[rgba(255,221,126,0.78)] bg-gradient-to-b from-[#ffd76a] to-[#e7aa25] shadow-[0_10px_34px_rgba(247,198,75,0.34),inset_0_1px_0_rgba(255,255,255,0.36)] transition-[transform,box-shadow] hover:-translate-y-px hover:shadow-[0_15px_44px_rgba(247,198,75,0.44),inset_0_1px_0_rgba(255,255,255,0.42)]"
						id="hero-cta"
					>
						<span>ENTER EARTH NETWORK</span>
						<span className="btn__arrow" aria-hidden="true" />
					</Link>
				</div>
				<a
					href="#explore"
					className="inline-flex items-center gap-2.5 mt-[18px] text-[12px] font-bold text-[#9fc9ed] uppercase no-underline transition-colors duration-200 hover:text-white"
					id="hero-explore-link"
				>
					<span>EXPLORE PLATFORM</span>
					<span className="hero__explore-mark" aria-hidden="true" />
				</a>
			</div>

			<div
				className="absolute bottom-[110px] left-1/2 z-[5] flex flex-col items-center gap-2 -translate-x-1/2 opacity-60 transition-opacity duration-300 pointer-events-none hover:opacity-100"
				aria-hidden="true"
			>
				<span className="text-[9px] font-bold text-[#9fb0c8] uppercase tracking-[0.15em]">
					Scroll to explore
				</span>
				<div className="hero__scroll-line" />
			</div>

			<CapabilityStrip />
		</section>
	)
}

export default Hero
