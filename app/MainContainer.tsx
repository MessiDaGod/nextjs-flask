"use client";
import React, { useState, useEffect } from "react";

export default function MainContainer({}) {
  const [isResizing, setIsResizing] = useState(false);
  const [leftColumnWidth, setLeftColumnWidth] = useState("30%");

  const leftColumnStyle: React.CSSProperties = {
    overflow: "auto",
    resize: "horizontal",
    backgroundColor: "#e0e0e0",
    flexBasis: leftColumnWidth, // This sets the initial width
    flexGrow: 0, // This prevents the column from growing beyond its initial width
    flexShrink: 0, // This prevents the column from shrinking below its initial width
    height: "100%",
  };

  const resizerStyle: React.CSSProperties = {
    cursor: "ew-resize",
    backgroundColor: "#e0e0e0",
    width: "10px",
    marginRight: "5px",
    height: "100%",
  };

  const middleColumnStyle: React.CSSProperties = {
    backgroundColor: "#c0c0c0",
    overflow: "auto",
    flexGrow: 1, // This allows the column to take up remaining space
    marginRight: "5px",
    height: "100%",
  };

  const rightColumnStyle: React.CSSProperties = {
    backgroundColor: "#a0a0a0",
    overflow: "auto",
    flexGrow: 0.4, // This defines the proportion of the remaining space this column should occupy
    height: "100%",
  };

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (isResizing) {
        // Adjust the width based on mouse movement
        setLeftColumnWidth(`${e.clientX}px`);
      }
    }

    function handleMouseUp() {
      // Stop resizing
      setIsResizing(false);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      // Cleanup event listeners
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsResizing(true);
  };

  return (
    <>
      <div style={{ ...leftColumnStyle }}>

      </div>
      <div style={resizerStyle} onMouseDown={handleMouseDown}>

      </div>
      <div style={middleColumnStyle}>

      </div>
      <div style={rightColumnStyle}>

      </div>
    </>
  );
}
