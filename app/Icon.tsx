"use client";
import React, { useState } from "react";

interface IconProps {
  symbol: string;
  size?: string | undefined;
  tooltip?: string | undefined;
}

export default function Icon({ symbol, size = "l", tooltip = "" }: IconProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <div
      className="icon-container"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <i className={`${"symbol button"} ${size}`}>
        {symbol}
      </i>
      {showTooltip && <span className="tooltip">{tooltip}</span>}
    </div>
  );
}
