import { Link } from "@tanstack/react-router"
import GlobeViz from "@/shared/components/globe/GlobeViz"
import CapabilityStrip from "@/shared/components/homepage/CapabilityStrip"
import { BtnArrow } from "@/shared/components/homepage/shared"
import { cn } from "@/shared/lib/utils"

const HEALTHCARE_METRICS = [
	{
		label: "Total Facilities",
		value: "1,48,734",
		change: "+2.4%",
		trend: "up" as const,
	},
	{
		label: "Population Coverage",
		value: "92.6%",
		change: "+1.8%",
		trend: "up" as const,
		progress: 82,
	},
	{
		label: "Critical Districts",
		value: "284",
		change: "-3.2%",
		trend: "down" as const,
	},
]

const FLOOD_METRICS = [
	{
		label: "At Risk Districts",
		value: "312",
		change: "+5.6%",
		trend: "alert" as const,
	},
	{
		label: "Affected Population",
		value: "2.8M",
		change: "+7.3%",
		trend: "alert" as const,
		progress: 68,
	},
	{
		label: "Rainfall (24h)",
		value: "118.6 mm",
		change: "+12.4%",
		trend: "alert" as const,
	},
]

type MetricTrend = "up" | "down" | "alert"
interface Metric {
	label: string
	value: string
	change: string
	trend: MetricTrend
	progress?: number
}

function Sparkline() {
      return (
              <svg
                      className="block w-full mt-3 overflow-visible [&_path]:fill-none [&_path]:[stroke:rgba(194,220,244,0.78)] [&_path]:[stroke-width:1.4]"
                      height="28"
                      viewBox="0 0 150 30"
                      aria-hidden="true"
              >
                      <path d="M2 21 C18 22 24 17 38 19 S60 25 74 18 96 20 108 10 128 8 148 13" />
              </svg>
      )
}

function PanelSymbol({ type }: { type: "health" | "flood" }) {
      if (type === "health") {
              return (
                      <span
                              aria-hidden="true"
                              className={cn(
                                      "relative inline-flex flex-shrink-0 w-[22px] h-[22px]",
                                      "before:absolute before:content-[''] before:top-[5px] before:right-[2px] before:bottom-[7px] before:left-[2px]",
                                      "before:border before:border-[#9fdcff] before:rounded-[8px_8px_10px_10px] before:rotate-45",
                                      "after:absolute after:content-[''] after:inset-[7px]",
                                      "after:border-r after:border-b after:border-[#9fdcff] after:rotate-45",
                              )}
                      />
              )
      }
      return (
              <span
                      aria-hidden="true"
                      className={cn(
                              "relative inline-flex flex-shrink-0 w-[22px] h-[22px]",
                              "before:absolute before:content-[''] before:right-[2px] before:bottom-[6px] before:left-[2px] before:h-3",
                              "before:border before:border-t-0 before:border-[#9fdcff] before:rounded-b-[12px]",
                              "after:absolute after:content-[''] after:right-[3px] after:bottom-[1px] after:left-[3px] after:h-[7px]",
                              "after:border-t after:border-[#9fdcff] after:rounded-full",
                      )}
              />
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
                      className={cn(
                              "absolute z-[4] w-[clamp(220px,17vw,258px)]",
                              side === "left"
                                      ? "top-[clamp(148px,25vh,208px)] left-[clamp(16px,2.5vw,42px)]"
                                      : "top-[clamp(148px,25vh,208px)] right-[clamp(16px,2.5vw,42px)]",
                              "max-[1120px]:w-[218px] max-[980px]:hidden",
                      )}
                      aria-label={title}
              >
                      <div
                              className={cn(
                                      "min-h-[300px] p-[22px_22px_18px]",
                                      "bg-[rgba(8,12,20,0.35)] border border-[rgba(255,255,255,0.08)] rounded-[10px]",
                                      "shadow-[0_12px_32px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.05)]",
                                      "backdrop-blur-[20px]",
                                      "[transition:transform_0.4s_cubic-bezier(0.16,1,0.3,1),box-shadow_0.4s_ease,background-color_0.4s_ease,border-color_0.4s_ease]",
                                      "hover:bg-[rgba(8,12,20,0.45)] hover:border-[rgba(255,255,255,0.15)] hover:-translate-y-1",
                                      "hover:shadow-[0_20px_48px_rgba(0,0,0,0.4),0_0_32px_rgba(255,255,255,0.02),inset_0_1px_0_rgba(255,255,255,0.1)]",
                                      "max-[1120px]:min-h-[330px] max-[1120px]:p-[18px]",
                              )}
                      >
                              {/* Header */}
                              <div className="flex gap-3 items-center min-h-[44px] pb-[17px] mb-[18px] text-[11px] font-extrabold text-[#eef7ff] uppercase border-b border-[rgba(255,255,255,0.08)]">
                                      <PanelSymbol type={type} />
                                      <span>{title}</span>
                              </div>

				{/* Metrics */}
				{metrics.map((metric, index) => (
					<div
						key={metric.label}
						className="pb-[14px] mb-5 border-b border-[rgba(255,255,255,0.08)] last-of-type:mb-0"
					>
						<p className="mb-[6px] text-[9px] font-bold text-[#7f91a9] uppercase">
							{metric.label}
						</p>
						<p className="flex gap-3 items-baseline justify-between text-[22px] font-medium leading-[1.12] text-white max-[1120px]:text-[20px]">
							<span>{metric.value}</span>
							<span
								className={cn(
									"inline-flex gap-1 items-center text-[10px] font-extrabold whitespace-nowrap",
									metric.trend === "alert"
										? "text-[#ff654f]"
										: "text-[#5de582]",
								)}
							>
								{metric.change}
								<span
									aria-hidden="true"
									className={cn(
										"inline-block w-0 h-0",
										metric.trend === "down"
											? "border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-[#5de582]"
											: "border-l-[4px] border-r-[4px] border-b-[6px] border-l-transparent border-r-transparent border-b-current",
									)}
								/>
							</span>
						</p>
						{index === 0 && <Sparkline />}
						{metric.progress !== undefined && (
							<span
								aria-hidden="true"
								className="block h-[5px] mt-[13px] overflow-hidden bg-[rgba(116,140,169,0.25)] rounded-full"
							>
								<span
									className="block h-full bg-[linear-gradient(90deg,#78a7ff,#9db9ff)] rounded-[inherit]"
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
					<span
						aria-hidden="true"
						className="inline-block w-[7px] h-[7px] border-t border-r border-current rotate-45"
					/>
				</a>
			</div>
		</aside>
	)
}

function Hero() {
	return (
		<>
			<style>{`@keyframes scrollLinePulse{0%{transform:translateY(-8px)}60%,100%{transform:translateY(24px)}}`}</style>
			<section
				id="top"
				className={cn(
					"relative box-border flex items-center justify-center",
					"h-screen min-h-screen",
					"px-[clamp(30px,4.8vw,78px)] pt-[72px] pb-[110px]",
					"overflow-hidden bg-black isolate",
					"max-[720px]:min-h-[calc(100svh-106px)] max-[720px]:px-[18px] max-[720px]:pt-[88px] max-[720px]:pb-[38px]",
					"max-[480px]:min-h-[calc(100svh-104px)]",
				)}
			>
				{/* Globe background */}
				<div className="absolute inset-0 z-[1] pointer-events-none">
					<div className="absolute top-[-40px] left-0 w-full h-[calc(100%+40px)] pointer-events-auto">
						<GlobeViz />
					</div>
				</div>

				{/* Stat panels */}
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

				{/* Hero content */}
				<div
					className={cn(
						"relative z-[5] flex flex-col items-center max-w-[780px] text-center",
						"mt-[clamp(76px,20vh,172px)]",
						"max-[980px]:mt-[clamp(96px,21vh,170px)]",
						"max-[720px]:max-w-[330px] max-[720px]:mt-[clamp(102px,22vh,160px)]",
						"max-[480px]:max-w-[300px] max-[480px]:mt-[clamp(106px,23vh,154px)]",
					)}
				>
					<p className="mb-2 text-[15px] font-medium text-[rgba(232,238,248,0.8)] uppercase tracking-[0.05em] [text-shadow:0_2px_22px_rgba(0,0,0,0.95)] max-[720px]:text-[11px]">
						EARTH INTELLIGENCE PLATFORM
					</p>

					<h1 className="text-[clamp(56px,6.2vw,84px)] font-extrabold leading-none text-white [text-shadow:0_4px_36px_rgba(0,0,0,0.82)] max-[720px]:text-[clamp(31px,9.5vw,38px)] max-[720px]:leading-[1.04] max-[480px]:text-[clamp(30px,9vw,35px)]">
						Better Bharat Map
					</h1>

					<p className="max-w-[720px] mt-[18px] text-[21px] font-normal text-[rgba(238,244,251,0.9)] [text-shadow:0_2px_18px_rgba(0,0,0,0.85)] max-[720px]:max-w-[310px] max-[720px]:text-[13px]">
						Visualizing Infrastructure, Development and Public Data
					</p>

					<div className="mt-[52px]">
						<Link
							to="/state-map"
							id="hero-cta"
							className={cn(
								"inline-flex gap-[14px] items-center justify-center",
								"min-w-[400px] min-h-[76px] px-16",
								"text-[22px] font-extrabold tracking-[0.02em] uppercase no-underline cursor-pointer",
								"border rounded-lg transition-[transform,box-shadow,background] duration-150",
								"hover:-translate-y-px",
								"text-[#08101c]",
								"bg-[linear-gradient(180deg,#ffd76a,#e7aa25)]",
								"border-[rgba(255,221,126,0.78)]",
								"shadow-[0_10px_34px_rgba(247,198,75,0.34),inset_0_1px_0_rgba(255,255,255,0.36)]",
								"hover:shadow-[0_15px_44px_rgba(247,198,75,0.44),inset_0_1px_0_rgba(255,255,255,0.42)]",
								"max-[720px]:min-w-0 max-[720px]:min-h-[48px] max-[720px]:px-[22px] max-[720px]:text-[11px]",
							)}
						>
							<span>ENTER EARTH NETWORK</span>
							<BtnArrow />
						</Link>
					</div>

					<a
						href="#explore"
						id="hero-explore-link"
						className={cn(
							"inline-flex gap-[10px] items-center mt-[18px]",
							"text-[12px] font-bold text-[#9fc9ed] uppercase no-underline",
							"transition-colors duration-200 hover:text-white",
						)}
					>
						<span>EXPLORE PLATFORM</span>
						<span
							aria-hidden="true"
							className={cn(
								"relative w-[17px] h-[17px] border border-current rounded-full",
								"before:absolute before:content-['']",
								"before:top-[5px] before:left-[5px] before:w-[5px] before:h-[5px]",
								"before:border-t before:border-r before:border-current before:rotate-45",
							)}
						/>
					</a>
				</div>

				{/* Scroll indicator */}
				<div
					className={cn(
						"absolute bottom-[110px] left-1/2 z-[5]",
						"flex flex-col gap-2 items-center",
						"pointer-events-none -translate-x-1/2 opacity-60 transition-opacity duration-300",
						"max-[720px]:bottom-[14px]",
					)}
					aria-hidden="true"
				>
					<span className="text-[9px] font-bold text-[#9fb0c8] uppercase tracking-[0.15em]">
						Scroll to explore
					</span>
					<div className="relative w-px h-6 overflow-hidden bg-[linear-gradient(to_bottom,#9fb0c8,transparent)]">
						<span
							className="absolute top-0 left-0 w-full h-2 bg-[#6ad1ff]"
							style={{
								animation:
									"scrollLinePulse 2s cubic-bezier(0.16,1,0.3,1) infinite",
							}}
						/>
					</div>
				</div>

				<CapabilityStrip />
			</section>
		</>
	)
}

export default Hero