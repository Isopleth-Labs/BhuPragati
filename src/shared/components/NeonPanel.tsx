import {
	type ComponentPropsWithoutRef,
	type ElementType,
	memo,
	type ReactNode,
} from "react";

type NeonPanelProps<T extends ElementType = "section"> = {
	as?: T;
	className?: string;
	children?: ReactNode;
	ariaLabel?: string;
} & Omit<ComponentPropsWithoutRef<T>, "className" | "children" | "aria-label">;

function NeonPanel<T extends ElementType = "section">({
	as: Tag = "section" as T,
	className = "",
	children,
	ariaLabel,
	...rest
}: NeonPanelProps<T>) {
	const composed = `panel-surface ${className}`.trim();

	// TypeScript cannot verify generic element spreads at the call site — this is
	// a known open issue (microsoft/TypeScript#28768). The props are correctly
	// constrained by NeonPanelProps<T>; the assertion is safe.
	const Tag_ = Tag as ElementType;

	return (
		<Tag_ className={composed} aria-label={ariaLabel} {...rest}>
			{children}
		</Tag_>
	);
}

export default memo(NeonPanel);
