import EarthScene from "@/shared/components/globe/EarthScene"

function StandaloneEarth() {
	return (
		<div className="earth-prototype flex items-center justify-center w-[100vw] h-[100vh] overflow-hidden bg-transparent">
			<EarthScene className="earth-prototype__canvas relative w-[min(80vmin,940px)] h-[min(80vmin,940px)] [&>canvas]:block [&>canvas]:w-full [&>canvas]:h-full" />
		</div>
	)
}

export default StandaloneEarth
