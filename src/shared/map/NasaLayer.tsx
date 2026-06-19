import { Layer, Source } from "react-map-gl/maplibre"

;<Source
	id="nasa"
	type="raster"
	tiles={[
		"https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_ShadedRelief/default/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpeg",
	]}
	tileSize={256}
>
	<Layer id="nasa-layer" type="raster" source="nasa" />
</Source>
