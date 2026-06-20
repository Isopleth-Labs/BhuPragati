import EarthViewer from "./EarthViewer"

function StandaloneEarth() {
	return (
		<div className="flex h-screen w-screen items-center justify-center overflow-hidden bg-transparent">
			<EarthViewer className="relative h-[min(80vmin,940px)] w-[min(80vmin,940px)]" />
		</div>
	)
}

export default StandaloneEarth
