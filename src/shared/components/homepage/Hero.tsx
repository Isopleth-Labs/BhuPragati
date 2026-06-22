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
			className={`stat-panel__spark stat-panel__spark--${tone}`}
			viewBox="0 0 150 30"
			aria-hidden="true"
		>
			<path d="M2 21 C18 22 24 17 38 19 S60 25 74 18 96 20 108 10 128 8 148 13" />
		</svg>
	)
}

function StatPanel({ side, title, type, metrics, linkLabel, href }) {
	return (
		<aside className={`hero__panel hero__panel--${side}`} aria-label={title}>
			<div className="stat-panel">
				<div className="stat-panel__header">
					<span
						className={`stat-panel__symbol stat-panel__symbol--${type}`}
						aria-hidden="true"
					/>
					<span>{title}</span>
				</div>

				{metrics.map((metric, index) => (
					<div className="stat-panel__row" key={metric.label}>
						<p className="stat-panel__label">{metric.label}</p>
						<p className="stat-panel__value">
							<span>{metric.value}</span>
							<span
								className={`stat-panel__change stat-panel__change--${metric.trend}`}
							>
								{metric.change}
								<span className="stat-panel__direction" aria-hidden="true" />
							</span>
						</p>
						{index === 0 && <Sparkline tone={type} />}
						{metric.progress && (
							<span className="stat-panel__bar" aria-hidden="true">
								<span style={{ width: `${metric.progress}%` }} />
							</span>
						)}
					</div>
				))}

				<a className="stat-panel__link" href={href}>
					{linkLabel}
					<span aria-hidden="true" />
				</a>
			</div>
		</aside>
	)
}

function Hero() {
	return (
		<section className="hero" id="top">
			<div className="hero__space" aria-hidden="true" />
			<div className="hero__network hero__network--left" aria-hidden="true" />
			<div className="hero__network hero__network--right" aria-hidden="true" />

			<div className="hero__earth">
				<div className="hero__earth-canvas">
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

			<div className="hero__content">
				<p className="hero__welcome">EARTH INTELLIGENCE PLATFORM</p>
				<h1 className="hero__title">Better Bharat Map</h1>
				<p className="hero__subtitle">
					Visualizing Infrastructure, Development and Public Data
				</p>
				<div className="hero__actions">
					<Link to="/state-map" className="btn btn-primary" id="hero-cta">
						<span>ENTER EARTH NETWORK</span>
						<span className="btn__arrow" aria-hidden="true" />
					</Link>
				</div>
				<a href="#explore" className="hero__explore" id="hero-explore-link">
					<span>EXPLORE PLATFORM</span>
					<span className="hero__explore-mark" aria-hidden="true" />
				</a>
			</div>

			<div className="hero__scroll" aria-hidden="true">
				<span className="hero__scroll-text">Scroll to explore</span>
				<div className="hero__scroll-line"></div>
			</div>

			<CapabilityStrip />
		</section>
	)
}

export default Hero
