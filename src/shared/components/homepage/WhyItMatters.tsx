import { cn } from "@/shared/lib/utils"
import { BtnArrow, BtnSecondary, Eyebrow, SectionBody, SectionHeading } from "@/shared/components/homepage/shared"

const INSIGHT_CARDS = [
	{
		iconBase: "text-[#6ad1ff] bg-[rgba(106,209,255,0.06)] border border-[rgba(106,209,255,0.18)] drop-shadow-[0_0_4px_rgba(106,209,255,0.4)]",
		iconHover: "group-hover:bg-[rgba(106,209,255,0.14)] group-hover:border-[rgba(106,209,255,0.35)] group-hover:drop-shadow-[0_0_8px_rgba(106,209,255,0.6)]",
		icon: (
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
		description: "Identify critical gaps in roads, healthcare, education, electricity and more.",
	},
	{
		iconBase: "text-[#7cf3c5] bg-[rgba(124,243,197,0.06)] border border-[rgba(124,243,197,0.18)] drop-shadow-[0_0_4px_rgba(124,243,197,0.4)]",
		iconHover: "group-hover:bg-[rgba(124,243,197,0.14)] group-hover:border-[rgba(124,243,197,0.35)] group-hover:drop-shadow-[0_0_8px_rgba(124,243,197,0.6)]",
		icon: (
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
		description: "Empower data-backed decisions for stronger policies and investments.",
	},
	{
		iconBase: "text-[#ffd700] bg-[rgba(255,215,0,0.06)] border border-[rgba(255,215,0,0.18)] drop-shadow-[0_0_4px_rgba(255,215,0,0.4)]",
		iconHover: "group-hover:bg-[rgba(255,215,0,0.14)] group-hover:border-[rgba(255,215,0,0.35)] group-hover:drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]",
		icon: (
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
				<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
				<circle cx="12" cy="11" r="3.5" />
				<circle cx="12" cy="11" r="1" fill="currentColor" />
				<path d="M12 7.5v2m0 3v2M8.5 11h2m3 0h2" />
			</svg>
		),
		title: "Transparent Governance",
		description: "Open data and clear insights ensure accountability and public trust.",
	},
	{
		iconBase: "text-[#c56cf0] bg-[rgba(197,108,240,0.06)] border border-[rgba(197,108,240,0.18)] drop-shadow-[0_0_4px_rgba(197,108,240,0.4)]",
		iconHover: "group-hover:bg-[rgba(197,108,240,0.14)] group-hover:border-[rgba(197,108,240,0.35)] group-hover:drop-shadow-[0_0_8px_rgba(197,108,240,0.6)]",
		icon: (
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
		description: "Target resources where they are needed most for equitable development.",
	},
]

function WhyItMatters() {
	return (
		<section
			className="grid [grid-template-columns:360px_minmax(0,1fr)] [column-gap:48px] pt-[80px] pb-[56px] px-[40px] w-full max-w-[min(1800px,92vw)] mx-auto scroll-mt-20 max-[900px]:[grid-template-columns:1fr] max-[900px]:[row-gap:28px] max-[900px]:pt-[48px] max-[900px]:pb-[36px] max-[900px]:px-[24px] max-[720px]:pt-[28px] max-[720px]:pb-[28px] max-[720px]:px-[18px] max-[480px]:pt-[32px] max-[480px]:pb-[22px] max-[480px]:px-[16px] max-[480px]:[row-gap:20px]"
			id="why-it-matters"
		>
			{/* Left */}
			<div className="flex flex-col justify-center gap-4">
				<Eyebrow>WHY IT MATTERS</Eyebrow>
				<SectionHeading>Building a Better Bharat Through Intelligence</SectionHeading>
				<SectionBody>
					Data-driven insights help us identify gaps, unlock opportunities, and ensure no one is left behind.
				</SectionBody>
				<BtnSecondary href="#insights" id="why-explore-btn" className="mt-[18px] self-start">
					<span>EXPLORE INSIGHTS</span>
					<BtnArrow />
				</BtnSecondary>
			</div>

			{/* Right: 4-col card grid */}
			<div className="grid grid-cols-4 gap-5 items-stretch w-full max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
				{INSIGHT_CARDS.map((card) => (
					<article
						key={card.title}
						className={cn(
							"group flex flex-col items-start justify-start h-full p-[24px_20px]",
							"bg-[linear-gradient(180deg,rgba(14,20,32,0.78),rgba(7,14,24,0.9))]",
							"border border-[rgba(146,197,255,0.12)] rounded-[12px]",
							"shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_10px_30px_rgba(0,0,0,0.24)]",
						)}
					>
						<span
							className={cn(
								"flex-shrink-0 flex items-center justify-center w-[56px] h-[56px] p-[12px] rounded-[12px]",
								"transition-[background,color,border-color,filter] duration-300 ease-in-out",
								card.iconBase,
								card.iconHover,
							)}
						>
							{card.icon}
						</span>
						<h3 className="mt-5 mb-[14px] text-[20px] font-bold leading-[1.3] text-[#e8eef8] tracking-[-0.01em]">{card.title}</h3>
						<p className="max-w-[28ch] text-[15px] leading-[1.75] text-[rgba(220,235,255,0.82)]">{card.description}</p>
					</article>
				))}
			</div>
		</section>
	)
}

export default WhyItMatters
