import { Layers, MapIcon, Moon, Satellite, Sun } from "lucide-react";
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import type { MapStyleType } from "../MapConstraints";

interface MapStyleOption {
	id: MapStyleType;
	label: string;
	icon: typeof Moon;
	swatchClassName: string;
}

const MAP_STYLE_OPTIONS: MapStyleOption[] = [
	{
		id: "dark",
		label: "Dark",
		icon: Moon,
		swatchClassName: "bg-zinc-950",
	},
	{
		id: "light",
		label: "Light",
		icon: Sun,
		swatchClassName: "bg-zinc-100",
	},
	{
		id: "voyager",
		label: "Voyager",
		icon: MapIcon,
		swatchClassName: "bg-amber-200",
	},
	{
		id: "bright",
		label: "Bright",
		icon: Layers,
		swatchClassName: "bg-sky-300",
	},
	{
		id: "stadia_satellite",
		label: "Satellite",
		icon: Satellite,
		swatchClassName: "bg-emerald-700",
	},
];

interface MapStyleControlsProps {
	value: MapStyleType;
	onChange: (style: MapStyleType) => void;
	className?: string;
}

export function MapStyleControls({
	value,
	onChange,
	className,
}: MapStyleControlsProps) {
	const [isMobilePickerOpen, setIsMobilePickerOpen] = useState(false);

	const activeOption =
		MAP_STYLE_OPTIONS.find((option) => option.id === value) ??
		MAP_STYLE_OPTIONS[0];
	const ActiveIcon = activeOption.icon;

	const selectStyle = (style: MapStyleType) => {
		onChange(style);
		setIsMobilePickerOpen(false);
	};

	const renderStyleButton = (option: MapStyleOption) => {
		const Icon = option.icon;
		const isActive = value === option.id;

		return (
			<Button
				key={option.id}
				type="button"
				variant={isActive ? "secondary" : "ghost"}
				size="sm"
				aria-pressed={isActive}
				onClick={() => selectStyle(option.id)}
				className={cn(
					"h-14 min-w-20 flex-col gap-1 border border-transparent px-2 text-xs",
					isActive &&
						"border-primary/70 bg-primary/15 text-foreground hover:bg-primary/20",
				)}
			>
				<span
					className={cn(
						"flex size-6 items-center justify-center rounded-md border border-white/20 text-white shadow-inner",
						option.swatchClassName,
					)}
				>
					<Icon className="size-3.5" />
				</span>
				<span>{option.label}</span>
			</Button>
		);
	};

	return (
		<div className={cn("absolute bottom-4 left-4 z-50", className)}>
			<div className="hidden max-w-[calc(100vw-2rem)] gap-2 overflow-x-auto rounded-lg border border-white/20 bg-background/95 p-2 shadow-[0_14px_34px_rgba(0,0,0,0.3)] backdrop-blur sm:flex dark:border-white/15 dark:bg-background/85">
				{MAP_STYLE_OPTIONS.map(renderStyleButton)}
			</div>

			<div className="relative sm:hidden">
				{isMobilePickerOpen && (
					<div
						className="absolute bottom-14 left-0 grid w-[min(calc(100vw-2rem),20rem)] grid-cols-2 gap-2 rounded-lg border border-white/20 bg-background/95 p-2 shadow-[0_14px_34px_rgba(0,0,0,0.3)] backdrop-blur dark:border-white/15 dark:bg-background/85"
						role="toolbar"
						aria-label="Map style"
					>
						{MAP_STYLE_OPTIONS.map(renderStyleButton)}
					</div>
				)}

				<Button
					type="button"
					variant="outline"
					size="lg"
					aria-expanded={isMobilePickerOpen}
					aria-label="Map style"
					onClick={() => setIsMobilePickerOpen((isOpen) => !isOpen)}
					className="h-12 gap-2 border-white/20 bg-background/95 px-3 shadow-[0_14px_34px_rgba(0,0,0,0.3)] backdrop-blur dark:border-white/15 dark:bg-background/85"
				>
					<span
						className={cn(
							"flex size-6 items-center justify-center rounded-md border border-white/20 text-white shadow-inner",
							activeOption.swatchClassName,
						)}
					>
						<ActiveIcon className="size-3.5" />
					</span>
					<span>{activeOption.label}</span>
				</Button>
			</div>
		</div>
	);
}
