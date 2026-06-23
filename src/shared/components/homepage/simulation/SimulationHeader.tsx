export function SimulationHeader() {
	return (
		<div className="self-start flex flex-col items-start w-full max-[1080px]:max-w-[640px]">
			<p className=" m-0 mb-[14px] font-barlow text-[13px] font-bold text-[#6ad1ff] uppercase tracking-[0.14em]">
				DEVELOPMENT SIMULATION
			</p>
			<h2 className=" m-0 mb-[22px] font-barlow text-[clamp(32px,3.8vw,44px)] font-extrabold leading-[1.12] text-[#ffffff] tracking-[-0.01em] text-left">
				Plan Today, Transform Tomorrow
			</h2>
			<p className=" m-0 max-w-[340px] font-inter text-[14px] leading-[1.65] text-[#b8cadc] text-left">
				Simulate infrastructure investments and see the projected impact before
				it happens.
			</p>
			<a
				href="#simulation-tool"
				className="inline-flex gap-[14px] items-center justify-center min-h-[58px] px-[32px] mt-[18px] text-[13px] font-[800] uppercase tracking-normal no-underline cursor-pointer bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.12)] rounded-[8px] text-[#e8eef8] transition-all duration-200 hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.2)] hover:-translate-y-[1px] [@media(max-width:720px)]:min-h-[48px] [@media(max-width:720px)]:px-[22px] [@media(max-width:720px)]:text-[11px]"
				id="sim-explore-btn"
			>
				<span>EXPLORE SIMULATION</span>
				<span
					className="w-[8px] h-[8px] border-t-2 border-r-2 border-current rotate-45 transform"
					aria-hidden="true"
				/>
			</a>
		</div>
	)
}
