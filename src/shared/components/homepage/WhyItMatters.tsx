const INSIGHT_CARDS = [
	{
		icon: (
			<svg
				className="w-[36px] h-[36px] mb-[20px] stroke-current stroke-[1.5] text-[#6ad1ff] transition-all duration-300 group-hover:bg-[rgba(106,209,255,0.14)] group-hover:border-[rgba(106,209,255,0.35)] group-hover:drop-shadow-[0_0_8px_rgba(106,209,255,0.6)]"
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
				className="w-[36px] h-[36px] mb-[20px] stroke-current stroke-[1.5] text-[#5de582] transition-all duration-300 group-hover:bg-[rgba(124,243,197,0.14)] group-hover:border-[rgba(124,243,197,0.35)] group-hover:drop-shadow-[0_0_8px_rgba(124,243,197,0.6)]"
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
				className="w-[36px] h-[36px] mb-[20px] stroke-current stroke-[1.5] text-[#ffd76a] transition-all duration-300 group-hover:bg-[rgba(255,215,0,0.14)] group-hover:border-[rgba(255,215,0,0.35)] group-hover:drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]"
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
				className="w-[36px] h-[36px] mb-[20px] stroke-current stroke-[1.5] text-[#b182ff] transition-all duration-300 group-hover:bg-[rgba(197,108,240,0.14)] group-hover:border-[rgba(197,108,240,0.35)] group-hover:drop-shadow-[0_0_8px_rgba(197,108,240,0.6)]"
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
]

function WhyItMatters() {
	return (
		<section
			className=" relative grid grid-cols-[360px_minmax(0,1fr)] gap-[48px] items-center max-w-[min(1800px,92vw)] w-full mx-auto my-0 px-[40px] pt-[80px] pb-[56px] [margin-top:0] max-[1080px]:grid-cols-1 max-[760px]:py-[80px]"
			id="why-it-matters"
		>
			<div className=" self-start flex flex-col items-start w-full max-[1080px]:max-w-[640px]">
				<p className=" m-0 mb-[14px] font-barlow text-[13px] font-bold text-[#6ad1ff] uppercase tracking-[0.14em]">
					WHY IT MATTERS
				</p>
				<h2 className=" m-0 mb-[22px] font-barlow text-[clamp(32px,3.8vw,44px)] font-extrabold leading-[1.12] text-[#ffffff] tracking-[-0.01em]">
					Building a Better Bharat Through Intelligence
				</h2>
				<p className=" m-0 mb-[36px] font-inter text-[18px] leading-[1.65] text-[#b8cadc] max-w-[460px] [@media(max-width:760px)]:text-[16px]">
					Data-driven insights help us identify gaps, unlock opportunities, and
					ensure no one is left behind.
				</p>
				<a
					href="#insights"
					className="inline-flex gap-[14px] items-center justify-center min-h-[58px] px-[32px] border border-[rgba(106,209,255,0.3)] rounded-[8px] bg-[rgba(106,209,255,0.02)] text-[#6ad1ff] font-barlow text-[13px] font-[800] uppercase no-underline transition-all duration-200 shadow-[inset_0_0_12px_rgba(106,209,255,0.03)] hover:bg-[rgba(106,209,255,0.08)] hover:border-[#6ad1ff] hover:shadow-[0_0_16px_rgba(106,209,255,0.15)] hover:-translate-y-[1px]"
					id="why-explore-btn"
				>
					<span>EXPLORE INSIGHTS</span>
					<span
						className="w-[8px] h-[8px] border-t-2 border-r-2 border-current rotate-45 transform"
						aria-hidden="true"
					/>
				</a>
			</div>

			<div className=" self-start grid grid-cols-4 gap-[20px] items-stretch w-full max-[1080px]:grid-cols-2 max-[640px]:grid-cols-1">
				{INSIGHT_CARDS.map((card) => (
					<article
						className="box-border flex flex-col items-start h-full p-[24px_20px] bg-gradient-to-b from-[rgba(14,20,32,0.78)] to-[rgba(7,14,24,0.9)] border border-[rgba(146,197,255,0.12)] rounded-[12px] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_10px_30px_rgba(0,0,0,0.24)] group"
						key={card.title}
					>
						{card.icon}
						<h3 className="mt-[20px] mb-[14px] text-[20px] font-[700] leading-[1.3] text-[#e8eef8] text-left tracking-[-0.01em]">
							{card.title}
						</h3>
						<p className="max-w-[28ch] m-0 text-[15px] font-[400] leading-[1.75] text-[rgba(220,235,255,0.82)] text-left">
							{card.description}
						</p>
					</article>
				))}
			</div>
		</section>
	)
}

export default WhyItMatters
