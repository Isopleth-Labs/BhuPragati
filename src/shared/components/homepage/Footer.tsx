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
				<title id="Twitter">Twitter</title>
				<path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
			</svg>
		),
	},
	{
		label: "LinkedIn",
		href: "#linkedin",
		icon: (
			<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
				<title id="LinkedIn">LinkedIn</title>
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
				<title id="GitHub">GitHub</title>
				<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
			</svg>
		),
	},
	{
		label: "YouTube",
		href: "#youtube",
		icon: (
			<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
				<title id="YouTube">YouTube</title>
				<path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
				<polygon
					points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"
					fill="#000"
				/>
			</svg>
		),
	},
]

function Footer() {
	return (
		<footer
			className="relative w-full px-[clamp(24px,4.5vw,72px)] pt-[110px] pb-[44px] mt-[120px] bg-[rgba(5,9,16,0.95)] border-t border-[rgba(255,255,255,0.06)]"
			role="contentinfo"
		>
			<div className="flex flex-col gap-[72px] max-w-[1240px] mx-auto">
				<div className="grid grid-cols-[1.5fr_2fr_1fr] gap-[64px] items-start [@media(max-width:1120px)]:grid-cols-[1fr_1fr] [@media(max-width:1120px)]:gap-[54px] [@media(max-width:760px)]:grid-cols-1 [@media(max-width:760px)]:gap-[48px]">
					{/* Brand */}
					<div className="flex gap-[20px] items-center">
						<svg
							className="shrink-0 w-[44px] h-[44px]"
							width="36"
							height="36"
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
						<div className="flex flex-col gap-[4px]">
							<span className="font-barlow text-[18px] font-extrabold tracking-[0.06em] text-[#eef7ff]">
								BETTER BHARAT MAP
							</span>
							<span className="font-inter text-[11px] font-semibold text-[#8a9db5] tracking-[0.05em] uppercase">
								EARTH INTELLIGENCE PLATFORM
							</span>
						</div>
					</div>

					{/* Link columns */}
					<div className="flex justify-between gap-[32px] w-full [@media(max-width:540px)]:flex-col [@media(max-width:540px)]:gap-[38px]">
						{COLUMNS.map((col) => (
							<nav
								className="flex flex-col gap-[22px]"
								key={col.heading}
								aria-label={col.heading}
							>
								<h4 className="font-barlow text-[12px] font-bold tracking-[0.1em] uppercase text-[#6ad1ff]">
									{col.heading}
								</h4>
								<ul className="flex flex-col gap-[14px] p-0 m-0 list-none">
									{col.links.map((link) => (
										<li key={link.label}>
											<a
												href={link.href}
												className="font-inter text-[14px] text-[#93a7c3] no-underline transition-colors duration-200 hover:text-white"
												id={`footer-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
											>
												{link.label}
											</a>
										</li>
									))}
								</ul>
							</nav>
						))}
					</div>

					{/* Vision Card */}
					<div className="flex flex-col gap-[22px] [@media(max-width:1120px)]:col-span-2 [@media(max-width:1120px)]:max-w-[400px] [@media(max-width:760px)]:col-span-1">
						<h4 className="font-barlow text-[12px] font-bold tracking-[0.1em] uppercase text-[#6ad1ff]">
							OUR VISION
						</h4>
						<p className="m-0 font-inter text-[15px] leading-[1.65] text-[#93a7c3]">
							A data-driven India where every decision creates a better future
							for every citizen.
						</p>
						<div className="flex gap-[12px]">
							{SOCIAL_LINKS.map((social) => (
								<a
									href={social.href}
									className="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] text-[#8ba2be] transition-all duration-200 hover:-translate-y-[2px] hover:bg-[rgba(106,209,255,0.1)] hover:border-[rgba(106,209,255,0.25)] hover:text-[#6ad1ff]"
									key={social.label}
									aria-label={social.label}
									id={`footer-social-${social.label.toLowerCase()}`}
								>
									<span className="" aria-hidden="true">
										{social.icon}
									</span>
									<span className="sr-only">{social.label}</span>
								</a>
							))}
						</div>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="flex items-center justify-between pt-[32px] border-t border-[rgba(255,255,255,0.06)]">
					<p className="m-0 font-inter text-[13px] text-[#5c728e]">
						© 2026 Better Bharat Map. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	)
}

export default Footer
