import React from "react";

const CONTRIBUTORS = [
	{
		colorClass: "contributor-card__icon--green",
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
				<rect x="16" y="16" width="6" height="6" rx="1.5" />
				<rect x="2" y="16" width="6" height="6" rx="1.5" />
				<rect x="9" y="2" width="6" height="6" rx="1.5" />
				<path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" />
				<path d="M12 12V8" />
			</svg>
		),
	},
	{
		colorClass: "contributor-card__icon--blue",
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
				<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
				<circle cx="9" cy="7" r="4" />
				<circle cx="18" cy="11" r="3" />
				<path d="M20 13l2 2" />
			</svg>
		),
	},
	{
		colorClass: "contributor-card__icon--orange",
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
		colorClass: "contributor-card__icon--purple",
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
				<rect x="2" y="4" width="20" height="16" rx="3" />
				<path d="M9 10l-2 2 2 2" />
				<path d="M15 10l2 2-2 2" />
			</svg>
		),
	},
];

function Contributors() {
	return (
		<section className="section-row contributors-section" id="contributors">
			<div className="contributors__left">
				<p className="eyebrow" style={{ color: "var(--accent-gold)" }}>
					CONTRIBUTORS
				</p>
				<h2 className="section-heading">
					Built for Bharat,
					<br />
					Together
				</h2>
				<p className="section-body">
					Better Bharat Map is an open initiative dedicated to data-driven
					development across India. Developers, researchers, institutions, and
					citizens are welcome to contribute and help build a stronger Bharat.
				</p>
			</div>

			<div className="contributors__right">
				{CONTRIBUTORS.map((card) => (
					<article className="contributor-card" key={card.title}>
						<div
							className={`contributor-card__icon ${card.colorClass}`}
							aria-hidden="true"
						>
							{card.icon}
						</div>
						<div className="contributor-card__content">
							<h3 className="contributor-card__title">{card.title}</h3>
							<p className="contributor-card__subtitle">{card.subtitle}</p>
						</div>
					</article>
				))}
			</div>
		</section>
	);
}

export default Contributors;
