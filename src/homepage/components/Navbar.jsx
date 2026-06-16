const NAV_LINKS = [
	{ label: "About", href: "#about" },
	{ label: "Platform", href: "#platform" },
	{ label: "Solutions", href: "#solutions" },
	{ label: "Data Insights", href: "#data-insights" },
	{ label: "Resources", href: "#resources" },
	{ label: "Contact", href: "#contact" },
];

function Navbar() {
	return (
		<nav className="navbar" role="navigation" aria-label="Main navigation">
			<a
				href="#top"
				className="navbar__brand"
				aria-label="Better Bharat Map home"
			>
				<svg
					className="navbar__brand-icon"
					width="44"
					height="44"
					viewBox="0 0 44 44"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
				>
					{/* Bounding Circle */}
					<circle
						cx="22"
						cy="22"
						r="15"
						stroke="#6ad1ff"
						strokeWidth="1.8"
						fill="none"
					/>

					{/* Equator */}
					<line
						x1="7"
						y1="22"
						x2="37"
						y2="22"
						stroke="#6ad1ff"
						strokeWidth="1.5"
					/>

					{/* Inner Meridians */}
					<path
						d="M 22 7 A 5 15 0 0 0 22 37"
						stroke="#6ad1ff"
						strokeWidth="1.5"
						fill="none"
					/>
					<path
						d="M 22 7 A 5 15 0 0 1 22 37"
						stroke="#6ad1ff"
						strokeWidth="1.5"
						fill="none"
					/>

					{/* Outer Meridians */}
					<path
						d="M 22 7 A 10 15 0 0 0 22 37"
						stroke="#6ad1ff"
						strokeWidth="1.5"
						fill="none"
					/>
					<path
						d="M 22 7 A 10 15 0 0 1 22 37"
						stroke="#6ad1ff"
						strokeWidth="1.5"
						fill="none"
					/>
				</svg>
				<div className="navbar__brand-text">
					<span className="navbar__brand-name">BETTER BHARAT MAP</span>
					<span className="navbar__brand-sub">EARTH INTELLIGENCE PLATFORM</span>
				</div>
			</a>

			<ul className="navbar__links">
				{NAV_LINKS.map((link) => (
					<li key={link.label}>
						<a
							href={link.href}
							className="navbar__link"
							id={`nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
						>
							{link.label}
						</a>
					</li>
				))}
			</ul>
		</nav>
	);
}

export default Navbar;
