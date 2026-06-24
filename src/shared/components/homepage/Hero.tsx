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

function Sparkline({ tone }) {
	return (
		<svg
			className={`stat-panel__spark--${tone} block w-full h-[28px] mt-[12px] overflow-visible`}
			viewBox="0 0 150 30"
			aria-hidden="true"
		>
			<path
				d="M2 21 C18 22 24 17 38 19 S60 25 74 18 96 20 108 10 128 8 148 13"
				className="fill-none stroke-[rgba(194,220,244,0.78)] stroke-[1.4px]"
			/>
		</svg>
	)
}

function StatPanel({ side, title, type, metrics, linkLabel, href }) {
	return (
		<aside
			className={`hero__panel--${side} absolute z-[4] w-[clamp(220px,17vw,258px)] top-[clamp(148px,25vh,208px)] ${side === "left" ? "left-[clamp(16px,2.5vw,42px)]" : "right-[clamp(16px,2.5vw,42px)]"} [@media(max-width:1120px)]:w-[218px] [@media(max-width:980px)]:hidden`}
			aria-label={title}
		>
			<div className="min-h-[300px] pt-[22px] px-[22px] pb-[18px] bg-[rgba(8,12,20,0.35)] border border-[rgba(255,255,255,0.08)] rounded-[10px] shadow-[0_12px_32px_rgba(0,0,0,0.25),_inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-[20px] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[rgba(8,12,20,0.45)] hover:border-[rgba(255,255,255,0.15)] hover:shadow-[0_20px_48px_rgba(0,0,0,0.4),_0_0_32px_rgba(255,255,255,0.02),_inset_0_1px_0_rgba(255,255,255,0.1)] hover:-translate-y-[4px] [@media(max-width:1120px)]:min-h-[330px] [@media(max-width:1120px)]:p-[18px]">
				<div className="flex gap-[12px] items-center min-h-[44px] pb-[17px] mb-[18px] text-[11px] font-extrabold text-[#eef7ff] uppercase tracking-normal border-b border-[rgba(255,255,255,0.08)]">
					<span
						className={`stat-panel__symbol--${type} relative inline-flex shrink-0 w-[22px] h-[22px] before:absolute before:content-[''] after:absolute after:content-[''] ${type === "health" ? "before:inset-[5px_2px_7px] before:border before:border-[#9fdcff] before:rounded-[8px_8px_10px_10px] before:rotate-45 before:transform after:inset-[7px] after:border-r after:border-b after:border-[#9fdcff] after:rotate-45 after:transform" : "before:right-[2px] before:bottom-[6px] before:left-[2px] before:h-[12px] before:border before:border-[#9fdcff] before:border-t-0 before:rounded-[0_0_12px_12px] after:right-[3px] after:bottom-[1px] after:left-[3px] after:h-[7px] after:border-t after:border-[#9fdcff] after:rounded-full"}`}
						aria-hidden="true"
					/>
					<span>{title}</span>
				</div>

				{metrics.map((metric, index) => (
					<div
						className="pb-[14px] mb-[20px] border-b border-[rgba(255,255,255,0.08)] last-of-type:mb-0"
						key={metric.label}
					>
						<p className="mb-[6px] text-[9px] font-bold text-[#7f91a9] uppercase tracking-normal">
							{metric.label}
						</p>
						<p className="flex gap-[12px] items-baseline justify-between text-[22px] font-medium leading-[1.12] text-[#ffffff] [@media(max-width:1120px)]:text-[20px]">
							<span>{metric.value}</span>
							<span
								className={`stat-panel__change--${metric.trend} inline-flex gap-[4px] items-center text-[10px] font-extrabold whitespace-nowrap ${metric.trend === "up" || metric.trend === "down" ? "text-[#5de582]" : "text-[#ff654f]"}`}
							>
								{metric.change}
								<span
									className={`w-0 h-0 border-r-[4px] border-r-transparent border-l-[4px] border-l-transparent ${metric.trend === "down" ? "border-t-[6px] border-t-current border-b-0" : "border-b-[6px] border-b-current border-t-0"}`}
									aria-hidden="true"
								/>
							</span>
						</p>
						{index === 0 && <Sparkline tone={type} />}
						{metric.progress && (
							<span
								className="block h-[5px] mt-[13px] overflow-hidden bg-[rgba(116,140,169,0.25)] rounded-full"
								aria-hidden="true"
							>
								<span
									className="block h-full bg-gradient-to-r from-[#78a7ff] to-[#9db9ff] rounded-full"
									style={{ width: `${metric.progress}%` }}
								/>
							</span>
						)}
					</div>
				))}

				<a
					className="flex items-center justify-between mt-[18px] text-[10px] font-extrabold text-[#b8cadc] uppercase tracking-normal no-underline transition-colors duration-200 hover:text-[#6ad1ff]"
					href={href}
				>
					{linkLabel}
					<span
						className="w-[7px] h-[7px] border-t border-r border-current rotate-45 transform"
						aria-hidden="true"
					/>
				</a>
			</div>
		</aside>
	)
}

function Hero() {
	return (
		<section
			className="relative flex items-center justify-center h-[100vh] min-h-[100vh] pt-[72px] pb-[110px] px-[clamp(30px,4.8vw,78px)] overflow-hidden bg-[#000000] isolate box-border [@media(max-width:720px)]:min-h-[calc(100svh-106px)] [@media(max-width:720px)]:pt-[88px] [@media(max-width:720px)]:pb-[38px] [@media(max-width:720px)]:px-[18px] [@media(max-width:480px)]:min-h-[calc(100svh-104px)]"
			id="top"
		>
			<div className="hidden" aria-hidden="true" />
			<div className="hidden" aria-hidden="true" />
			<div className="hidden" aria-hidden="true" />

			<div className=" absolute inset-0 z-[1] pointer-events-none">
				<div className="absolute -top-[40px] left-0 w-full h-[calc(100%+40px)] pointer-events-auto">
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

			<div className="relative z-[5] flex flex-col items-center max-w-[780px] mt-[clamp(76px,20vh,172px)] text-center [@media(max-width:980px)]:mt-[clamp(96px,21vh,170px)] [@media(max-width:720px)]:max-w-[330px] [@media(max-width:720px)]:mt-[clamp(102px,22vh,160px)] [@media(max-width:480px)]:max-w-[300px] [@media(max-width:480px)]:mt-[clamp(106px,23vh,154px)]">
				<p className="mb-[8px] text-[15px] font-medium text-[rgba(232,238,248,0.8)] uppercase tracking-[0.05em] drop-shadow-[0_2px_22px_rgba(0,0,0,0.95)] [@media(max-width:720px)]:text-[11px]">
					EARTH INTELLIGENCE PLATFORM
				</p>
				<h1 className="text-[clamp(56px,6.2vw,84px)] font-extrabold leading-none text-[#ffffff] tracking-normal drop-shadow-[0_4px_36px_rgba(0,0,0,0.82)] [@media(max-width:720px)]:text-[clamp(31px,9.5vw,38px)] [@media(max-width:720px)]:leading-[1.04] [@media(max-width:480px)]:text-[clamp(30px,9vw,35px)]">
					Better Bharat Map
				</h1>
				<p className="max-w-[720px] mt-[18px] text-[21px] font-normal text-[rgba(238,244,251,0.9)] drop-shadow-[0_2px_18px_rgba(0,0,0,0.85)] [@media(max-width:720px)]:max-w-[310px] [@media(max-width:720px)]:text-[13px]">
					Visualizing Infrastructure, Development and Public Data
				</p>
				<div className="mt-[52px]">
					<Link
						to="/state-map"
						className="inline-flex gap-[14px] items-center justify-center min-h-[76px] min-w-[400px] px-[64px] text-[22px] font-[800] uppercase tracking-[0.02em] no-underline cursor-pointer border border-[rgba(255,221,126,0.78)] rounded-[8px] text-[#08101c] bg-gradient-to-b from-[#ffd76a] to-[#e7aa25] shadow-[0_10px_34px_rgba(247,198,75,0.34),_inset_0_1px_0_rgba(255,255,255,0.36)] transition-all duration-200 hover:shadow-[0_15px_44px_rgba(247,198,75,0.44),_inset_0_1px_0_rgba(255,255,255,0.42)] hover:-translate-y-[1px] [@media(max-width:720px)]:min-w-0 [@media(max-width:720px)]:min-h-[48px] [@media(max-width:720px)]:px-[22px] [@media(max-width:720px)]:text-[11px]"
						id="hero-cta"
					>
						<span>ENTER EARTH NETWORK</span>
						<span
							className="w-[8px] h-[8px] border-t-[2px] border-r-[2px] border-current rotate-45 transform"
							aria-hidden="true"
						/>
					</Link>
				</div>
				<a
					href="#explore"
					className="inline-flex gap-[10px] items-center mt-[18px] text-[12px] font-bold text-[#9fc9ed] uppercase tracking-normal no-underline transition-colors duration-200 hover:text-[#ffffff]"
					id="hero-explore-link"
				>
					<span>EXPLORE PLATFORM</span>
					<span
						className="relative w-[17px] h-[17px] border border-current rounded-full before:absolute before:top-[5px] before:left-[5px] before:w-[5px] before:h-[5px] before:border-t before:border-r before:border-current before:rotate-45 before:content-['']"
						aria-hidden="true"
					/>
				</a>
			</div>

			<div
				className=" absolute bottom-[110px] left-[50%] z-[5] flex flex-col gap-[8px] items-center pointer-events-none opacity-60 -translate-x-[50%] transition-opacity duration-300 hover:opacity-100 [@media(max-width:720px)]:bottom-[14px]"
				aria-hidden="true"
			>
				<span className="text-[9px] font-bold text-[#9fb0c8] uppercase tracking-[0.15em]">
					Scroll to explore
				</span>
				<div className="relative w-[1px] h-[24px] overflow-hidden bg-gradient-to-b from-[#9fb0c8] to-transparent">
					<div className="absolute top-0 left-0 w-full h-[8px] bg-[#6ad1ff] animate-scroll-line" />
				</div>
			</div>

			<CapabilityStrip />
		</section>
	)
}

export default Hero
