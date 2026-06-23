const NAV_LINKS = [
	{ label: "About", href: "#about" },
	{ label: "Platform", href: "#platform" },
	{ label: "Solutions", href: "#solutions" },
	{ label: "Data Insights", href: "#data-insights" },
	{ label: "Resources", href: "#resources" },
	{ label: "Contact", href: "#contact" },
]

function Navbar() {
	return (
		<nav
			className="fixed top-0 left-0 z-[1000] flex items-center justify-between w-full h-[72px] px-[clamp(24px,4.5vw,72px)] bg-[rgba(5,9,16,0.85)] border-b border-[rgba(255,255,255,0.06)] backdrop-blur-[24px] saturate-[1.2]"
			aria-label="Main navigation"
		>
			<a
				href="#top"
				className="flex gap-[16px] items-center no-underline"
				aria-label="Better Bharat Map home"
			>
				<svg
					className="shrink-0 w-[40px] h-[40px]"
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
				<div className="flex flex-col gap-[2px] [@media(max-width:760px)]:hidden">
					<span className="font-barlow text-[16px] font-extrabold tracking-[0.06em] text-[#eef7ff]">
						BETTER BHARAT MAP
					</span>
					<span className="font-inter text-[10px] font-bold text-[#6ad1ff] tracking-[0.08em] uppercase">
						EARTH INTELLIGENCE PLATFORM
					</span>
				</div>
			</a>

			<ul className="flex gap-[32px] items-center p-0 m-0 list-none [@media(max-width:980px)]:hidden">
				{NAV_LINKS.map((link) => (
					<li key={link.label}>
						<a
							href={link.href}
							className="font-inter text-[13px] font-bold text-[#b8cadc] uppercase tracking-[0.04em] no-underline transition-colors duration-200 hover:text-white"
							id={`nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
						>
							{link.label}
						</a>
					</li>
				))}
			</ul>
		</nav>
	)
}

export default Navbar
