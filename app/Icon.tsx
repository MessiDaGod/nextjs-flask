interface IconProps {
  symbol: string;
  size?: string;
  tooltip?: string;
}

export default function Icon({ symbol, size = "l", tooltip = "" }: IconProps) {
  return (
    <i title={tooltip} className={`${"symbol button"} ${size}`}>
      {symbol}
    </i>
  );
}
