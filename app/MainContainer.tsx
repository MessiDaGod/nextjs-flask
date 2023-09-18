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
    marginRight: "5px",
    height: "100%",
  };

  const middleColumnStyle: React.CSSProperties = {
    flex: "1",
    backgroundColor: "#c0c0c0",
    resize: "horizontal",
    cursor: "ew-resize",
    overflow: "auto",
    height: "100%",
  };

  const rightColumnStyle: React.CSSProperties = {
    flex: "0.4",
    backgroundColor: "#a0a0a0",
    overflow: "auto",
    marginRight: "5px",
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
    // Check if the mouse is within the right edge margin of the column
    if (e.currentTarget.offsetWidth - e.nativeEvent.offsetX <= 5) {
      setIsResizing(true);
    }
  };

  return (
    <>
      <div
        style={{ ...leftColumnStyle, width: leftColumnWidth }}
        onMouseDown={handleMouseDown}
      >
        Left Column
      </div>
      <div style={middleColumnStyle}>Middle Column</div>
      <div style={rightColumnStyle}>Right Column</div>
    </>
  );
}
