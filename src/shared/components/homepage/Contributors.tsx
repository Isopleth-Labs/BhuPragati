const CONTRIBUTORS = [
	{
		colorClass:
			"contributor-card__icon--green text-[var(--accent-2)] bg-[rgba(124,243,197,0.15)] border border-solid border-[rgba(124,243,197,0.35)] group-hover:bg-[rgba(124,243,197,0.22)] group-hover:border-[rgba(124,243,197,0.5)] group-hover:[filter:drop-shadow(0_0_10px_rgba(124,243,197,0.6))]",
		title: "Open Source",
		subtitle: "Community Driven",
		icon: (
			<svg
				width="30"
				height="30"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.75"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<title id="Open Source">Open Source</title>
				<rect x="16" y="16" width="6" height="6" rx="1.5" />
				<rect x="2" y="16" width="6" height="6" rx="1.5" />
				<rect x="9" y="2" width="6" height="6" rx="1.5" />
				<path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" />
				<path d="M12 12V8" />
			</svg>
		),
	},
	{
		colorClass:
			"contributor-card__icon--blue text-[var(--accent)] bg-[rgba(106,209,255,0.15)] border border-solid border-[rgba(106,209,255,0.35)] group-hover:bg-[rgba(106,209,255,0.22)] group-hover:border-[rgba(106,209,255,0.5)] group-hover:[filter:drop-shadow(0_0_10px_rgba(106,209,255,0.6))]",
		title: "Researchers",
		subtitle: "& Data Scientists",
		icon: (
			<svg
				width="30"
				height="30"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.75"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<title id="Researchers">Researchers</title>
				<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
				<circle cx="9" cy="7" r="4" />
				<circle cx="18" cy="11" r="3" />
				<path d="M20 13l2 2" />
			</svg>
		),
	},
	{
		colorClass:
			"contributor-card__icon--orange text-[#ffd700] bg-[rgba(255,215,0,0.15)] border border-solid border-[rgba(255,215,0,0.35)] group-hover:bg-[rgba(255,215,0,0.22)] group-hover:border-[rgba(255,215,0,0.5)] group-hover:[filter:drop-shadow(0_0_10px_rgba(255,215,0,0.6))]",
		title: "Government",
		subtitle: "Collaborators",
		icon: (
			<svg
				width="30"
				height="30"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.75"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<title id="Government">Government</title>
				<line x1="3" x2="21" y1="22" y2="22" />
				<line x1="6" x2="6" y1="18" y2="11" />
				<line x1="10" x2="10" y1="18" y2="11" />
				<line x1="14" x2="14" y1="18" y2="11" />
				<line x1="18" x2="18" y1="18" y2="11" />
				<polygon points="12 2 20 7 4 7" />
			</svg>
		),
	},
	{
		colorClass:
			"contributor-card__icon--purple text-[#b182ff] bg-[rgba(177,130,255,0.15)] border border-solid border-[rgba(177,130,255,0.35)] group-hover:bg-[rgba(177,130,255,0.22)] group-hover:border-[rgba(177,130,255,0.5)] group-hover:[filter:drop-shadow(0_0_10px_rgba(177,130,255,0.6))]",
		title: "Developers",
		subtitle: "& Volunteers",
		icon: (
			<svg
				width="30"
				height="30"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.75"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<title id="Developers">Developers</title>
				<rect x="2" y="4" width="20" height="16" rx="3" />
				<path d="M9 10l-2 2 2 2" />
				<path d="M15 10l2 2-2 2" />
			</svg>
		),
	},
]

function Contributors() {
	return (
		<section
			className="section-row contributors-section items-start py-10 max-[900px]:py-7 max-[480px]:py-5"
			id="contributors"
		>
			<div className="contributors__left self-start">
				<p className="eyebrow" style={{ color: "var(--accent-gold)" }}>
					CONTRIBUTORS
				</p>
				<h2 className="section-heading mt-2.5 mx-0 mb-3 text-[clamp(26px,3.2vw,34px)] leading-[1.2] font-extrabold">
					Built for Bharat,
					<br />
					Together
				</h2>
				<p className="section-body max-w-[360px] text-[14px] leading-[1.65] text-[var(--muted)]">
					Better Bharat Map is an open initiative dedicated to data-driven
					development across India. Developers, researchers, institutions, and
					citizens are welcome to contribute and help build a stronger Bharat.
				</p>
			</div>

			<div className="contributors__right self-start grid grid-cols-4 gap-6 max-[900px]:grid-cols-2 max-[720px]:grid-cols-1 w-full">
				{CONTRIBUTORS.map((card) => (
					<article
						className="contributor-card group flex gap-4 items-center h-[92px] p-[12px_20px] bg-gradient-to-b from-[rgba(14,20,32,0.78)] to-[rgba(7,14,24,0.9)] border border-solid border-[rgba(146,197,255,0.12)] rounded-[14px] [box-shadow:inset_0_1px_0_rgba(255,255,255,0.05),0_10px_30px_rgba(0,0,0,0.24)] transition-all duration-300 ease-out hover:border-[rgba(146,197,255,0.3)] hover:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.08),0_15px_40px_rgba(0,0,0,0.35)] hover:-translate-y-[3px]"
						key={card.title}
					>
						<div
							className={`contributor-card__icon flex shrink-0 items-center justify-center w-16 h-16 text-[24px] rounded-2xl transition-all duration-300 ease-out ${card.colorClass}`}
							aria-hidden="true"
						>
							{card.icon}
						</div>
						<div className="contributor-card__content flex flex-col justify-center">
							<h3 className="contributor-card__title m-0 mb-0.5 text-[16px] font-bold text-white">
								{card.title}
							</h3>
							<p className="contributor-card__subtitle m-0 text-[13px] leading-[1.3] text-[var(--muted)]">
								{card.subtitle}
							</p>
						</div>
					</article>
				))}
			</div>
		</section>
	)
}

export default Contributors
