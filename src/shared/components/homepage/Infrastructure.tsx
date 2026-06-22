import { Eyebrow, SectionHeading } from "@/shared/components/homepage/shared"
import { cn } from "@/shared/lib/utils"

const LAYERS = [
	{
		iconBase:
			"text-[#6ad1ff] bg-[rgba(106,209,255,0.06)] border-[rgba(106,209,255,0.18)] drop-shadow-[0_0_4px_rgba(106,209,255,0.4)]",
		iconHover:
			"group-hover:bg-[rgba(106,209,255,0.14)] group-hover:border-[rgba(106,209,255,0.4)] group-hover:drop-shadow-[0_0_8px_rgba(106,209,255,0.6)]",
		icon: (
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				<path d="M4 22L8 2M20 22l-4-20" />
				<line x1="12" y1="4" x2="12" y2="8" strokeDasharray="2 2" />
				<line x1="12" y1="12" x2="12" y2="16" strokeDasharray="2 2" />
			</svg>
		),
		title: "Roads",
		description: "Connectivity and accessibility intelligence",
	},
	{
		iconBase:
			"text-[#ff6b6b] bg-[rgba(255,107,107,0.06)] border-[rgba(255,107,107,0.18)] drop-shadow-[0_0_4px_rgba(255,107,107,0.4)]",
		iconHover:
			"group-hover:bg-[rgba(255,107,107,0.14)] group-hover:border-[rgba(255,107,107,0.4)] group-hover:drop-shadow-[0_0_8px_rgba(255,107,107,0.6)]",
		icon: (
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				<circle cx="12" cy="12" r="10" />
				<line x1="12" y1="8" x2="12" y2="16" />
				<line x1="8" y1="12" x2="16" y2="12" />
			</svg>
		),
		title: "Healthcare",
		description: "Facilities, access and service availability",
	},
	{
		iconBase:
			"text-[#ffd700] bg-[rgba(255,215,0,0.06)] border-[rgba(255,215,0,0.18)] drop-shadow-[0_0_4px_rgba(255,215,0,0.4)]",
		iconHover:
			"group-hover:bg-[rgba(255,215,0,0.14)] group-hover:border-[rgba(255,215,0,0.4)] group-hover:drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]",
		icon: (
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				<path d="M22 10v6M2 10l10-5 10 5-10 5z" />
				<path d="M6 12v5c0 2 2.7 3.5 6 3.5s6-1.5 6-3.5v-5" />
			</svg>
		),
		title: "Education",
		description: "Schools, colleges and learning infrastructure",
	},
	{
		iconBase:
			"text-[#00ced1] bg-[rgba(0,206,209,0.06)] border-[rgba(0,206,209,0.18)] drop-shadow-[0_0_4px_rgba(0,206,209,0.4)]",
		iconHover:
			"group-hover:bg-[rgba(0,206,209,0.14)] group-hover:border-[rgba(0,206,209,0.4)] group-hover:drop-shadow-[0_0_8px_rgba(0,206,209,0.6)]",
		icon: (
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				<path d="M3 10L12 3l9 7" />
				<path d="M5 10v7" />
				<path d="M19 10v7" />
				<path d="M2 15c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
				<path d="M2 20c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
			</svg>
		),
		title: "Flood Intelligence",
		description: "Risk mapping and vulnerability analysis",
	},
	{
		iconBase:
			"text-[#7cf3c5] bg-[rgba(124,243,197,0.06)] border-[rgba(124,243,197,0.18)] drop-shadow-[0_0_4px_rgba(124,243,197,0.4)]",
		iconHover:
			"group-hover:bg-[rgba(124,243,197,0.14)] group-hover:border-[rgba(124,243,197,0.4)] group-hover:drop-shadow-[0_0_8px_rgba(124,243,197,0.6)]",
		icon: (
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				<path d="M2 22 16 8" />
				<path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" />
				<path d="M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" />
				<path d="M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" />
				<path d="M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z" />
				<path d="M11.47 17.47 13 19l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L5 19l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z" />
				<path d="M15.47 13.47 17 15l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L9 15l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z" />
				<path d="M19.47 9.47 21 11l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L13 11l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z" />
			</svg>
		),
		title: "Agriculture",
		description: "Irrigation, land use and productivity insights",
	},
	{
		iconBase:
			"text-[#ffd700] bg-[rgba(255,215,0,0.06)] border-[rgba(255,215,0,0.18)] drop-shadow-[0_0_4px_rgba(255,215,0,0.4)]",
		iconHover:
			"group-hover:bg-[rgba(255,215,0,0.14)] group-hover:border-[rgba(255,215,0,0.4)] group-hover:drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]",
		icon: (
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				<g transform="translate(0.5, -1.5)">
					<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
				</g>
			</svg>
		),
		title: "Electricity",
		description: "Power access, grid infrastructure and reliability.",
	},
]

function Infrastructure() {
	return (
		<section
			className="grid [grid-template-columns:360px_minmax(0,1fr)] [column-gap:48px] py-[56px] px-[40px] w-full max-w-[min(1800px,92vw)] mx-auto scroll-mt-20 max-[900px]:[grid-template-columns:1fr] max-[900px]:[row-gap:28px] max-[900px]:py-[36px] max-[900px]:px-[24px] max-[720px]:py-[28px] max-[720px]:px-[18px] max-[480px]:py-[22px] max-[480px]:px-[16px] max-[480px]:[row-gap:20px]"
			id="infrastructure"
		>
			{/* Left */}
			<div className="flex flex-col justify-center gap-0">
				<Eyebrow className="mb-5 text-[13px] tracking-[0.18em]">
					INFRASTRUCTURE INTELLIGENCE
				</Eyebrow>
				<SectionHeading>
					Layers That Power
					<br />
					Better Decisions
				</SectionHeading>
			</div>

			{/* Right: 6-col card grid (single row) */}
			<div className="grid [grid-template-columns:repeat(6,minmax(0,1fr))] gap-[14px] items-stretch w-full max-[900px]:grid-cols-3 max-[720px]:grid-cols-2 max-[480px]:grid-cols-1">
				{LAYERS.map((layer) => (
					<article
						key={layer.title}
						className={cn(
							"group flex flex-col items-center justify-start h-full p-[16px_12px] text-center",
							"bg-[linear-gradient(180deg,rgba(14,20,32,0.78),rgba(7,14,24,0.9))]",
							"border border-[rgba(146,197,255,0.12)] rounded-[12px]",
							"shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_10px_30px_rgba(0,0,0,0.24)]",
							"transition-[border-color,transform] duration-200",
							"hover:border-[rgba(255,255,255,0.12)] hover:-translate-y-[2px]",
						)}
					>
						<span
							className={cn(
								"flex flex-shrink-0 items-center justify-center w-[48px] h-[48px] p-[10px]",
								"border rounded-full",
								"transition-[background,color,border-color,filter] duration-300 ease-in-out",
								layer.iconBase,
								layer.iconHover,
							)}
						>
							{layer.icon}
						</span>
						<h3 className="flex items-center justify-center min-h-[48px] mt-[18px] text-[18px] font-bold leading-[1.35] text-[#e8eef8] text-center">
							{layer.title}
						</h3>
						<p className="max-w-[18ch] mx-auto text-[14px] leading-[1.7] text-[rgba(220,235,255,0.82)] text-center opacity-[0.92]">
							{layer.description}
						</p>
					</article>
				))}
			</div>
		</section>
	)
}

export default Infrastructure
