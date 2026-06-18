import EarthScene from "./EarthScene"
import "./standalone-earth.css"

function StandaloneEarth() {
	return (
		<div className="earth-prototype">
			<EarthScene className="earth-prototype__canvas" />
		</div>
	)
}

export default StandaloneEarth
