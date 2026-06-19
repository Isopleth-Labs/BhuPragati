const COLUMNS = [
	{
		heading: "PLATFORM",
		links: [
			{ label: "Vision", href: "#vision" },
			{ label: "Intelligence Layers", href: "#layers" },
			{ label: "Simulation", href: "#simulation" },
			{ label: "Earth to Village", href: "#earth-to-village" },
		],
	},
	{
		heading: "RESOURCES",
		links: [
			{ label: "Documentation", href: "#docs" },
			{ label: "API Reference", href: "#api" },
			{ label: "Data Sources", href: "#data" },
			{ label: "GitHub Repository", href: "#github" },
		],
	},
	{
		heading: "COMPANY",
		links: [
			{ label: "About Us", href: "#about" },
			{ label: "Contact", href: "#contact" },
			{ label: "Support", href: "#support" },
			{ label: "Privacy Policy", href: "#privacy" },
		],
	},
]

const SOCIAL_LINKS = [
	{
		label: "Twitter",
		href: "#twitter",
		icon: (
			<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
				<title>Twitter</title>
				<path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
			</svg>
		),
	},
	{
		label: "LinkedIn",
		href: "#linkedin",
		icon: (
			<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
				<title>LinkedIn</title>
				<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
				<rect x="2" y="9" width="4" height="12" />
				<circle cx="4" cy="4" r="2" />
			</svg>
		),
	},
	{
		label: "GitHub",
		href: "#github-social",
		icon: (
			<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
				<title>GitHub</title>
				<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
			</svg>
		),
	},
	{
		label: "YouTube",
		href: "#youtube",
		icon: (
			<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
				<title>YouTube</title>
				<path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
				<polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#000" />
			</svg>
		),
	},
]

function Footer() {
	return (
		<footer
			className="mt-8 pt-12 pb-6 px-[clamp(24px,7vw,96px)] bg-[rgba(0,0,0,0.35)] border-t border-[rgba(255,255,255,0.08)]"
			role="contentinfo"
		>
			<div className="max-w-[1600px] mx-auto">
				{/* Top: 5-column grid — brand | nav1 | nav2 | nav3 | vision */}
				<div className="grid [grid-template-columns:260px_auto_auto_auto_340px] gap-[40px] pb-8 border-b border-[rgba(255,255,255,0.08)] max-[900px]:[grid-template-columns:1fr] max-[900px]:gap-[28px]">

					{/* Brand: icon left, text right */}
					<div className="group flex gap-3 items-start">
						<svg
							className="flex-shrink-0 w-[28px] h-[28px] drop-shadow-[0_0_5px_rgba(106,209,255,0.15)] transition-[filter,transform] duration-300 group-hover:drop-shadow-[0_0_10px_rgba(106,209,255,0.35)] group-hover:scale-[1.02]"
							viewBox="0 0 44 44"
							fill="none"
							aria-hidden="true"
						>
							<circle cx="22" cy="22" r="15" stroke="#6ad1ff" strokeWidth="1.8" fill="none" />
							<line x1="7" y1="22" x2="37" y2="22" stroke="#6ad1ff" strokeWidth="1.5" />
							<path d="M 22 7 A 5 15 0 0 0 22 37" stroke="#6ad1ff" strokeWidth="1.5" fill="none" />
							<path d="M 22 7 A 5 15 0 0 1 22 37" stroke="#6ad1ff" strokeWidth="1.5" fill="none" />
							<path d="M 22 7 A 10 15 0 0 0 22 37" stroke="#6ad1ff" strokeWidth="1.5" fill="none" />
							<path d="M 22 7 A 10 15 0 0 1 22 37" stroke="#6ad1ff" strokeWidth="1.5" fill="none" />
						</svg>
						<div className="flex flex-col whitespace-nowrap">
							<span className="text-[14px] font-extrabold uppercase tracking-[0.06em]">BETTER BHARAT MAP</span>
							<span className="mt-1 text-[9px] uppercase tracking-[0.06em] text-[#5a6e87]">EARTH INTELLIGENCE PLATFORM</span>
						</div>
					</div>

					{/* 3 link columns: display:contents at desktop (join parent grid),
					    grid at ≤720px (become 2-col, then 1-col at ≤480px) */}
					<div className="contents max-[720px]:grid max-[720px]:grid-cols-2 max-[720px]:gap-4 max-[480px]:grid-cols-1">
						{COLUMNS.map((col) => (
							<nav key={col.heading} aria-label={col.heading}>
								<h4 className="mb-[14px] text-[10px] font-bold text-[#9fb0c8] uppercase tracking-[0.1em]">
									{col.heading}
								</h4>
								<ul className="list-none m-0 p-0">
									{col.links.map((link) => (
										<li key={link.label} className="mb-2">
											<a
												href={link.href}
												id={`footer-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
												className="text-[13px] text-[#5a6e87] no-underline transition-colors duration-200 hover:text-[#e8eef8]"
											>
												{link.label}
											</a>
										</li>
									))}
								</ul>
							</nav>
						))}
					</div>

					{/* Vision card */}
					<div className="flex flex-col p-6 bg-[rgba(14,20,32,0.6)] border border-[rgba(146,197,255,0.1)] rounded-[16px]">
						<h4 className="mb-3 text-[10px] font-bold text-white uppercase tracking-[0.1em]">OUR VISION</h4>
						<p className="mb-5 text-[13px] leading-[1.55] text-[#5a6e87]">
							A data-driven India where every decision creates a better future for every citizen.
						</p>
						<div className="flex gap-4 mt-auto">
							{SOCIAL_LINKS.map((social) => (
								<a
									key={social.label}
									href={social.href}
									id={`footer-social-${social.label.toLowerCase()}`}
									aria-label={social.label}
									className="flex items-center justify-center text-[#5a6e87] no-underline transition-[color,transform] duration-200 hover:text-[#6ad1ff] hover:-translate-y-[2px]"
								>
									<span aria-hidden="true">{social.icon}</span>
									<span className="sr-only">{social.label}</span>
								</a>
							))}
						</div>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="pt-5 text-[12px] text-[#5a6e87] text-center">
					<p className="m-0">© 2026 Better Bharat Map. All rights reserved.</p>
				</div>
			</div>
		</footer>
	)
}

export default Footer
