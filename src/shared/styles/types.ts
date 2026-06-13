export type CSSVars = React.CSSProperties & {
  [key: `--${string}`]: string | number;
};
