import { Link } from "@tanstack/react-router"

const NAV_LINKS = [
	{ label: "About", href: "about" },
	{ label: "Platform", href: "platform" },
	{ label: "Solutions", href: "solutions" },
	{ label: "Data Insights", href: "data-insights" },
	{ label: "Resources", href: "resources" },
	{ label: "Contact", href: "contact" },
]

function Navbar() {
	return (
		<nav
			className="fixed inset-x-0 top-0 z-[100] flex h-[80px] items-center justify-between bg-gradient-to-b from-[rgba(2,5,10,0.58)] via-[rgba(2,5,10,0.1)] to-transparent px-[clamp(24px,4vw,64px)] pt-2"
			aria-label="Main navigation"
		>
			<a
				href="#top"
				className="group inline-flex w-fit items-center gap-2.5 text-[#e8eef8] no-underline"
				aria-label="Better Bharat Map home"
			>
				<svg
					className="shrink-0 transition-[filter,transform] duration-300 ease-out drop-shadow-[0_0_8px_rgba(106,209,255,0.18)] group-hover:scale-[1.02] group-hover:drop-shadow-[0_0_14px_rgba(106,209,255,0.4)]"
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
				<div className="flex min-w-0 flex-col overflow-hidden text-ellipsis leading-[1.05]">
					<span className="text-[22px] font-bold uppercase tracking-[0.02em] text-white antialiased">
						BETTER BHARAT MAP
					</span>
					<span className="mt-[3px] text-[10px] font-bold uppercase tracking-[0.18em] text-[#7994b6] opacity-85 antialiased">
						EARTH INTELLIGENCE PLATFORM
					</span>
				</div>
			</a>

			<ul className="flex items-center gap-[clamp(28px,3.6vw,48px)] list-none">
				{NAV_LINKS.map((link) => (
					<li key={link.label}>
						<Link
							to={link.href}
							href={link.href}
							className="text-base font-semibold text-white/[0.78] no-underline transition-colors duration-200 hover:text-white"
							id={`nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
						>
							{link.label}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	)
}

export default Navbar
