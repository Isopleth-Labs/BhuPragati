import React from "react";

const INSIGHT_CARDS = [
	{
		icon: (
			<svg
				className="why-card__icon why-card__icon--blue"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				{/* Suspension bridge with vertical stay cables */}
				<line x1="2" y1="16" x2="22" y2="16" />
				<line x1="7" y1="6" x2="7" y2="18" />
				<line x1="17" y1="6" x2="17" y2="18" />
				<line x1="7" y1="10" x2="17" y2="10" />
				<path d="M2 8c4 3 6 4 10 4s6-1 10-4" />
				<line x1="10" y1="12" x2="10" y2="16" />
				<line x1="14" y1="12" x2="14" y2="16" />
				<line x1="4" y1="11" x2="4" y2="16" />
				<line x1="20" y1="11" x2="20" y2="16" />
			</svg>
		),
		title: "Infrastructure Gaps",
		description:
			"Identify critical gaps in roads, healthcare, education, electricity and more.",
	},
	{
		icon: (
			<svg
				className="why-card__icon why-card__icon--green"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				{/* Clover intelligence node network */}
				<path d="M12 22a5 5 0 0 1-5-5c0-2 1.5-3.5 3-4.5-1.5-1-3-2.5-3-4.5a5 5 0 1 1 10 0c0 2-1.5 3.5-3 4.5 1.5 1 3 2.5 3 4.5a5 5 0 0 1-5 5z" />
				<circle cx="12" cy="7.5" r="1" fill="currentColor" />
				<circle cx="9.5" cy="15" r="1" fill="currentColor" />
				<circle cx="14.5" cy="15" r="1" fill="currentColor" />
				<line x1="12" y1="7.5" x2="12" y2="12" />
				<line x1="12" y1="12" x2="9.5" y2="15" />
				<line x1="12" y1="12" x2="14.5" y2="15" />
			</svg>
		),
		title: "Better Decisions",
		description:
			"Empower data-backed decisions for stronger policies and investments.",
	},
	{
		icon: (
			<svg
				className="why-card__icon why-card__icon--orange"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				{/* Shield with central crest checkmark emblem */}
				<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
				<circle cx="12" cy="11" r="3.5" />
				<circle cx="12" cy="11" r="1" fill="currentColor" />
				<path d="M12 7.5v2m0 3v2M8.5 11h2m3 0h2" />
			</svg>
		),
		title: "Transparent Governance",
		description:
			"Open data and clear insights ensure accountability and public trust.",
	},
	{
		icon: (
			<svg
				className="why-card__icon why-card__icon--purple"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				{/* Group of three people hugging / community team outline */}
				<circle cx="12" cy="6" r="2.5" />
				<path d="M7 14a5 5 0 0 1 10 0" />
				<circle cx="7.5" cy="9.5" r="2" />
				<path d="M3 17a4.5 4.5 0 0 1 5.5-3" />
				<circle cx="16.5" cy="9.5" r="2" />
				<path d="M15.5 14a4.5 4.5 0 0 1 5.5 3" />
				<path d="M6 20h12" />
			</svg>
		),
		title: "Inclusive Growth",
		description:
			"Target resources where they are needed most for equitable development.",
	},
];

function WhyItMatters() {
	return (
		<section className="section-row why-it-matters" id="why-it-matters">
			<div className="why-it-matters__left">
				<p className="eyebrow">WHY IT MATTERS</p>
				<h2 className="section-heading">
					Building a Better Bharat Through Intelligence
				</h2>
				<p className="section-body">
					Data-driven insights help us identify gaps, unlock opportunities, and
					ensure no one is left behind.
				</p>
				<a href="#insights" className="btn btn-secondary" id="why-explore-btn">
					<span>EXPLORE INSIGHTS</span>
					<span className="btn__arrow" aria-hidden="true" />
				</a>
			</div>

			<div className="why-it-matters__right">
				{INSIGHT_CARDS.map((card) => (
					<article className="why-card" key={card.title}>
						{card.icon}
						<h3 className="why-card__title">{card.title}</h3>
						<p className="why-card__desc">{card.description}</p>
					</article>
				))}
			</div>
		</section>
	);
}

export default WhyItMatters;
