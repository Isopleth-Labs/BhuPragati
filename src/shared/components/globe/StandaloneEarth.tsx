import EarthScene from "@/shared/components/globe/EarthScene"
import "@/shared/styles/standalone-earth.css"

function StandaloneEarth() {
	return (
		<div className="earth-prototype">
			<EarthScene className="earth-prototype__canvas" />
		</div>
	)
}

export default StandaloneEarth
