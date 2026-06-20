import { Link } from "@tanstack/react-router"
import { cn } from "@/shared/lib/utils"

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
			className={cn(
				"fixed top-0 right-0 left-0 z-[100]",
				"flex items-center justify-between",
				"h-20 pt-2 px-[clamp(24px,4vw,64px)]",
				"bg-[linear-gradient(180deg,rgba(2,5,10,0.58),rgba(2,5,10,0.1)_74%,transparent)]",
				"max-[1120px]:gap-4 max-[720px]:h-[68px] max-[720px]:pt-0 max-[720px]:px-[18px]",
			)}
			aria-label="Main navigation"
		>
			{/* Brand */}
			<a
				href="#top"
				aria-label="Better Bharat Map home"
				className="group inline-flex gap-[10px] items-center w-fit text-[#e8eef8] no-underline"
			>
				<svg
					className={cn(
						"flex-shrink-0",
						"drop-shadow-[0_0_8px_rgba(106,209,255,0.18)]",
						"transition-[filter,transform] duration-300 ease-in-out",
						"group-hover:drop-shadow-[0_0_14px_rgba(106,209,255,0.4)] group-hover:scale-[1.02]",
						"max-[720px]:w-[30px] max-[720px]:h-[30px]",
					)}
					width="44"
					height="44"
					viewBox="0 0 44 44"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
				>
					<circle cx="22" cy="22" r="15" stroke="#6ad1ff" strokeWidth="1.8" fill="none" />
					<line x1="7" y1="22" x2="37" y2="22" stroke="#6ad1ff" strokeWidth="1.5" />
					<path d="M 22 7 A 5 15 0 0 0 22 37" stroke="#6ad1ff" strokeWidth="1.5" fill="none" />
					<path d="M 22 7 A 5 15 0 0 1 22 37" stroke="#6ad1ff" strokeWidth="1.5" fill="none" />
					<path d="M 22 7 A 10 15 0 0 0 22 37" stroke="#6ad1ff" strokeWidth="1.5" fill="none" />
					<path d="M 22 7 A 10 15 0 0 1 22 37" stroke="#6ad1ff" strokeWidth="1.5" fill="none" />
				</svg>

				<div className="flex flex-col min-w-0 overflow-hidden text-ellipsis leading-[1.05]">
					<span
						className={cn(
							"text-[22px] font-bold antialiased text-white uppercase tracking-[0.02em]",
							"max-[720px]:text-[13px]",
						)}
					>
						BETTER BHARAT MAP
					</span>
					<span
						className={cn(
							"mt-[3px] text-[10px] font-bold antialiased text-[#7994b6] uppercase tracking-[0.18em] opacity-85",
							"max-[720px]:text-[8px]",
							"max-[480px]:hidden",
						)}
					>
						EARTH INTELLIGENCE PLATFORM
					</span>
				</div>
			</a>

			{/* Nav links */}
			<ul
				className={cn(
					"flex gap-[clamp(28px,3.6vw,48px)] items-center list-none",
					"max-[1120px]:gap-4",
					"max-[720px]:hidden",
				)}
			>
				{NAV_LINKS.map((link) => (
					<li key={link.label}>
						<Link
							to={link.href}
							href={link.href}
							id={`nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
							className={cn(
								"text-base font-semibold text-[rgba(232,238,248,0.78)] no-underline",
								"transition-colors duration-200 hover:text-white",
								"max-[1120px]:text-xs",
							)}
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
