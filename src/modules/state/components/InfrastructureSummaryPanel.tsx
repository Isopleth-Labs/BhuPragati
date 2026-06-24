import HudIcon from "@/shared/ui/dashboard/HudIcon"
import MetricPanel from "@/shared/ui/dashboard/MetricPanel"

export default function InfrastructureSummaryPanel() {
	return (
		<MetricPanel className="p-[12px_14px] border-[rgba(100,150,255,0.22)] rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)] flex-col gap-1.5 transition-none">
			<div className="flex flex-col gap-0.5 pl-0.5">
				<h3 className="m-0 font-['Plus_Jakarta_Sans',Inter,sans-serif] text-[11px] font-extrabold text-[#38bdf8] uppercase tracking-[0.06em] [text-shadow:0_0_8px_rgba(56,189,248,0.25)]">
					INFRASTRUCTURE SUMMARY
				</h3>
				<p className="m-0 text-[10px] font-medium leading-[1.2] text-[rgba(255,255,255,0.72)]">
					Snapshot of national infrastructure
				</p>
			</div>
			<div className="grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] gap-1 items-center mt-1.5">
				<div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.75 items-center justify-center min-w-0">
					<div className="contents">
						<HudIcon
							size="md"
							className="row-[1/span_2] col-[1] text-[#38bdf8] bg-[rgba(56,189,248,0.12)] border-[rgba(56,189,248,0.24)] shadow-[0_0_10px_rgba(56,189,248,0.15),inset_0_1px_0_rgba(255,255,255,0.12)]"
							aria-hidden
						>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="block w-[22px] h-[22px]"
							>
								<title>Ports</title>
								<circle
									cx="12"
									cy="5"
									r="3"
									fill="currentColor"
									fillOpacity="0.15"
								/>
								<line x1="12" y1="8" x2="12" y2="20" />
								<path d="M5 12h14" />
								<path d="M12 20a6 6 0 0 1-6-6M12 20a6 6 0 0 0 6-6" />
							</svg>
						</HudIcon>
						<span className="row-[2] col-[2] font-['Plus_Jakarta_Sans',Inter,sans-serif] text-[12.5px] font-semibold leading-[1.15] text-[rgba(255,255,255,0.95)] text-left tracking-[-0.015em]">
							Ports
						</span>
					</div>
					<span className="row-[1] col-[2] font-['Plus_Jakarta_Sans',Inter,sans-serif] text-[15px] font-bold leading-none text-[#38bdf8] text-left [text-shadow:0_0_8px_rgba(56,189,248,0.3)]">
						13
					</span>
				</div>
				<span
					className="shrink-0 w-px h-[34px] bg-[linear-gradient(to_bottom,transparent,rgba(56,189,248,0.22)_50%,transparent)]"
					aria-hidden
				/>

				<div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.75 items-center justify-center min-w-0">
					<div className="contents">
						<HudIcon
							size="md"
							className="row-[1/span_2] col-[1] text-[#38bdf8] bg-[rgba(56,189,248,0.12)] border-[rgba(56,189,248,0.24)] shadow-[0_0_10px_rgba(56,189,248,0.15),inset_0_1px_0_rgba(255,255,255,0.12)]"
							aria-hidden
						>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="block w-[22px] h-[22px]"
							>
								<title>Corridors</title>
								<path
									d="M2 20V10l5 3V10l5 3V10l10 4v6z"
									fill="currentColor"
									fillOpacity="0.15"
								/>
								<path d="M17 18h1" />
								<path d="M12 18h1" />
								<path d="M7 18h1" />
							</svg>
						</HudIcon>
						<span className="row-[2] col-[2] font-['Plus_Jakarta_Sans',Inter,sans-serif] text-[12.5px] font-semibold leading-[1.15] text-[rgba(255,255,255,0.95)] text-left tracking-[-0.015em]">
							Corridors
						</span>
					</div>
					<span className="row-[1] col-[2] font-['Plus_Jakarta_Sans',Inter,sans-serif] text-[15px] font-bold leading-none text-[#38bdf8] text-left [text-shadow:0_0_8px_rgba(56,189,248,0.3)]">
						11
					</span>
				</div>
				<span
					className="shrink-0 w-px h-[34px] bg-[linear-gradient(to_bottom,transparent,rgba(56,189,248,0.22)_50%,transparent)]"
					aria-hidden
				/>

				<div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.75 items-center justify-center min-w-0">
					<div className="contents">
						<HudIcon
							size="md"
							className="row-[1/span_2] col-[1] text-[#38bdf8] bg-[rgba(56,189,248,0.12)] border-[rgba(56,189,248,0.24)] shadow-[0_0_10px_rgba(56,189,248,0.15),inset_0_1px_0_rgba(255,255,255,0.12)]"
							aria-hidden
						>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="block w-[22px] h-[22px]"
							>
								<title>Smart Cities</title>
								<rect
									x="2"
									y="10"
									width="8"
									height="10"
									rx="1"
									fill="currentColor"
									fillOpacity="0.15"
								/>
								<rect
									x="14"
									y="4"
									width="8"
									height="16"
									rx="1"
									fill="currentColor"
									fillOpacity="0.15"
								/>
								<rect
									x="8"
									y="12"
									width="6"
									height="8"
									rx="1"
									fill="currentColor"
									fillOpacity="0.15"
								/>
							</svg>
						</HudIcon>
						<span className="row-[2] col-[2] font-['Plus_Jakarta_Sans',Inter,sans-serif] text-[12.5px] font-semibold leading-[1.15] text-[rgba(255,255,255,0.95)] text-left tracking-[-0.015em]">
							Smart Cities
						</span>
					</div>
					<span className="row-[1] col-[2] font-['Plus_Jakarta_Sans',Inter,sans-serif] text-[15px] font-bold leading-none text-[#38bdf8] text-left [text-shadow:0_0_8px_rgba(56,189,248,0.3)]">
						100
					</span>
				</div>
				<span
					className="shrink-0 w-px h-[34px] bg-[linear-gradient(to_bottom,transparent,rgba(56,189,248,0.22)_50%,transparent)]"
					aria-hidden
				/>

				<div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.75 items-center justify-center min-w-0">
					<div className="contents">
						<HudIcon
							size="md"
							className="row-[1/span_2] col-[1] text-[#38bdf8] bg-[rgba(56,189,248,0.12)] border-[rgba(56,189,248,0.24)] shadow-[0_0_10px_rgba(56,189,248,0.15),inset_0_1px_0_rgba(255,255,255,0.12)]"
							aria-hidden
						>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="block w-[22px] h-[22px]"
							>
								<title>Water Supply</title>
								<path
									d="M12 22a7 7 0 0 0 7-7c0-4.3-7-13-7-13S5 10.7 5 15a7 7 0 0 0 7 7z"
									fill="currentColor"
									fillOpacity="0.18"
								/>
							</svg>
						</HudIcon>
						<span className="row-[2] col-[2] font-['Plus_Jakarta_Sans',Inter,sans-serif] text-[12.5px] font-semibold leading-[1.15] text-[rgba(255,255,255,0.95)] text-left tracking-[-0.015em]">
							Water Supply
						</span>
					</div>
					<span className="row-[1] col-[2] font-['Plus_Jakarta_Sans',Inter,sans-serif] text-[15px] font-bold leading-none text-[#38bdf8] text-left [text-shadow:0_0_8px_rgba(56,189,248,0.3)]">
						91.6%
					</span>
				</div>
			</div>
		</MetricPanel>
	)
}
