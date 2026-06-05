import { memo, type ReactNode, type ElementType, type HTMLAttributes } from "react";

// Reusable neon HUD panel. Wraps the shared `panel-surface` styling
// so individual panels stay focused on their own structure.

type NeonPanelProps<T extends ElementType = 'section'> = {
  as?: T;
  className?: string;
  children?: ReactNode;
  ariaLabel?: string;
} & Omit<HTMLAttributes<HTMLElement>, 'children'>;

function NeonPanel<T extends ElementType = 'section'>({
  as: Tag = 'section' as T,
  className = '',
  children,
  ariaLabel,
  ...rest
}: NeonPanelProps<T>) {
  const composed = `panel-surface ${className}`.trim();
  return (
    <Tag className={composed} aria-label={ariaLabel} {...(rest as any)}>
      {children}
    </Tag>
  );
}

export default memo(NeonPanel);
