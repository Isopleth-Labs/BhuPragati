import { createFileRoute } from "@tanstack/react-router"
import maplibregl from "maplibre-gl"
import { Layer, Map as MapGL, Source } from "react-map-gl/maplibre"
// import { MAP_STYLE_DEFAULT } from '@/shared/map/MapConstraints'

export const Route = createFileRoute("/test")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className="h-screen w-full bg-black">
			<MapGL
				mapLib={maplibregl}
				projection={"globe"}
				mapStyle={{
					version: 8,
					sources: {},
					layers: [
						{
							id: "background",
							type: "background",
							paint: {
								"background-color": "#0c044b",
							},
						},
					],
				}}
				initialViewState={{
					longitude: 78.9629,
					latitude: 20.5937,
					zoom: 1.5,
				}}
			>
				<Source
					id="nasa"
					type="raster"
					tiles={[
						"https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_Black_Marble/default/default/GoogleMapsCompatible_Level8/{z}/{y}/{x}.png",
					]}
					tileSize={256}
				>
					<Layer id="nasa-layer" type="raster" source="nasa" />
				</Source>
			</MapGL>
		</div>
	)
}
