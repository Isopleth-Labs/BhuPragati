const LAYERS = [
	{
		icon: (
			<svg
				className="w-[36px] h-[36px] mb-[20px] stroke-current stroke-[1.5] text-[#6ad1ff] transition-all duration-300 group-hover:bg-[rgba(106,209,255,0.14)] group-hover:border-[rgba(106,209,255,0.4)] group-hover:drop-shadow-[0_0_8px_rgba(106,209,255,0.6)]"
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
		icon: (
			<svg
				className="w-[36px] h-[36px] mb-[20px] stroke-current stroke-[1.5] text-[#ff503c] transition-all duration-300 group-hover:bg-[rgba(255,107,107,0.14)] group-hover:border-[rgba(255,107,107,0.4)] group-hover:drop-shadow-[0_0_8px_rgba(255,107,107,0.6)]"
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
		icon: (
			<svg
				className="w-[36px] h-[36px] mb-[20px] stroke-current stroke-[1.5] text-[#ffd76a] transition-all duration-300 group-hover:bg-[rgba(255,215,0,0.14)] group-hover:border-[rgba(255,215,0,0.4)] group-hover:drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]"
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
		icon: (
			<svg
				className="w-[36px] h-[36px] mb-[20px] stroke-current stroke-[1.5] text-[#6ad1ff] transition-all duration-300 group-hover:bg-[rgba(106,209,255,0.14)] group-hover:border-[rgba(106,209,255,0.4)] group-hover:drop-shadow-[0_0_8px_rgba(106,209,255,0.6)]"
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
		icon: (
			<svg
				className="w-[36px] h-[36px] mb-[20px] stroke-current stroke-[1.5] text-[#5de582] transition-all duration-300 group-hover:bg-[rgba(124,243,197,0.14)] group-hover:border-[rgba(124,243,197,0.4)] group-hover:drop-shadow-[0_0_8px_rgba(124,243,197,0.6)]"
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
		icon: (
			<svg
				className="w-[36px] h-[36px] mb-[20px] stroke-current stroke-[1.5] text-[#ffd76a] transition-all duration-300 group-hover:bg-[rgba(255,215,0,0.14)] group-hover:border-[rgba(255,215,0,0.4)] group-hover:drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]"
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
			className=" relative grid grid-cols-[360px_minmax(0,1fr)] gap-[48px] items-center max-w-[min(1800px,92vw)] w-full mx-auto my-0 px-[40px] py-[56px] max-[1080px]:grid-cols-1 max-[760px]:py-[80px]"
			id="infrastructure"
		>
			<div className=" self-start flex flex-col items-start w-full max-[1080px]:max-w-[640px]">
				<p className="m-0 mb-[14px] font-barlow text-[13px] font-bold text-[#ffd76a] uppercase tracking-[0.14em]">
					INFRASTRUCTURE INTELLIGENCE
				</p>
				<h2 className=" m-0 mb-[22px] font-barlow text-[clamp(32px,3.8vw,44px)] font-extrabold leading-[1.12] text-[#ffffff] tracking-[-0.01em]">
					Layers That Power
					<br />
					Better Decisions
				</h2>
			</div>

			<div className=" self-start grid grid-cols-6 gap-[14px] items-stretch w-full max-[1080px]:w-full max-[1080px]:grid-cols-3 max-[900px]:grid-cols-2 max-[640px]:grid-cols-1">
				{LAYERS.map((layer) => (
					<article
						className="box-border flex flex-col items-center justify-start h-full p-[16px_12px] text-center bg-gradient-to-b from-[rgba(14,20,32,0.78)] to-[rgba(7,14,24,0.9)] border border-[rgba(146,197,255,0.12)] rounded-[12px] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_10px_30px_rgba(0,0,0,0.24)] group transition-all duration-200 hover:border-[#405c7a] hover:-translate-y-[2px]"
						key={layer.title}
					>
						{layer.icon}
						<h3 className="flex items-center justify-center min-h-[48px] mt-[18px] text-[18px] font-[700] leading-[1.35] text-[#e8eef8] text-center tracking-normal">
							{layer.title}
						</h3>
						<p className="max-w-[18ch] mx-auto text-[14px] font-[400] leading-[1.7] text-[rgba(220,235,255,0.82)] text-center opacity-[0.92]">
							{layer.description}
						</p>
					</article>
				))}
			</div>
		</section>
	)
}

export default Infrastructure
