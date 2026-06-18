import { Compass, Minus, Plus } from "lucide-react";
import type { Map as MaplibreMap } from "maplibre-gl";
import { type RefObject, useEffect, useState } from "react";
import type { MapRef } from "react-map-gl/maplibre";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

interface NavigationControlsProps {
	isMapReady: boolean;
	mapRef: RefObject<MapRef | null>;
	className?: string;
}

function getMapInstance(mapRef: RefObject<MapRef | null>): MaplibreMap | null {
	return mapRef.current?.getMap() ?? null;
}

export function NavigationControls({
	isMapReady,
	mapRef,
	className,
}: NavigationControlsProps) {
	const [bearing, setBearing] = useState(0);

	useEffect(() => {
		if (!isMapReady) return;
		const map = getMapInstance(mapRef);
		if (!map) return;

		const onRotate = () => setBearing(map.getBearing());
		setBearing(map.getBearing());
		map.on("rotate", onRotate);

		return () => {
			map.off("rotate", onRotate);
		};
	}, [isMapReady, mapRef]);

	return (
		<div
			className={cn(
				"absolute right-4 top-4 z-50 flex flex-col gap-2 pointer-events-auto sm:right-6 sm:top-1/2 sm:-translate-y-1/2",
				className,
			)}
		>
			<Button
				type="button"
				variant="outline"
				size="icon-lg"
				aria-label="Reset map rotation to north"
				title="Reset North"
				onClick={() =>
					getMapInstance(mapRef)?.easeTo({
						bearing: 0,
						pitch: 0,
						duration: 500,
					})
				}
				className="size-10 rounded-lg border-white/20 bg-background/95 text-foreground shadow-[0_14px_34px_rgba(0,0,0,0.3)] backdrop-blur hover:bg-muted dark:border-white/15 dark:bg-background/85 dark:hover:bg-muted/80"
			>
				<Compass
					size={18}
					style={{ transform: `rotate(-${bearing}deg)` }}
					className="transition-transform duration-75"
				/>
			</Button>

			<fieldset className="flex flex-col overflow-hidden rounded-lg border border-white/20 bg-background/95 p-0 shadow-[0_14px_34px_rgba(0,0,0,0.3)] backdrop-blur dark:border-white/15 dark:bg-background/85">
				<legend className="sr-only">Map zoom controls</legend>
				<Button
					type="button"
					variant="ghost"
					size="icon-lg"
					aria-label="Zoom in"
					title="Zoom In"
					onClick={() => getMapInstance(mapRef)?.zoomIn({ duration: 200 })}
					className="size-10 rounded-none border-b border-border text-foreground hover:bg-muted"
				>
					<Plus size={18} />
				</Button>
				<Button
					type="button"
					variant="ghost"
					size="icon-lg"
					aria-label="Zoom out"
					title="Zoom Out"
					onClick={() => getMapInstance(mapRef)?.zoomOut({ duration: 200 })}
					className="size-10 rounded-none text-foreground hover:bg-muted"
				>
					<Minus size={18} />
				</Button>
			</fieldset>
		</div>
	);
}
