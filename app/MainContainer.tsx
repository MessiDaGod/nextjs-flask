"use client";
import React, { useState, useEffect, useId } from "react";
import Icon from "./Icon";
import cn from "classnames";
import HomePage from "./HomePage";
import Link from "next/link";
import Upload from "./upload/page";
import WeightedAveragePage from "./weightedAverage/page";


export default function MainContainer({}) {
  const inputId = useId();
  const [isResizing, setIsResizing] = useState(false);
  const [leftColumnWidth, setLeftColumnWidth] = useState("202px");
  const [activeButton, setActiveButton] = useState("home");

  const leftColumnStyle: React.CSSProperties = {
    overflow: "auto",
    backgroundColor: "#ffffff",
    flexBasis: leftColumnWidth, // This sets the initial width
    flexGrow: 0, // This prevents the column from growing beyond its initial width
    flexShrink: 0, // This prevents the column from shrinking below its initial width
    height: "100%",
    overflowX: "hidden",
    minWidth: "76px",
  };

  const resizerStyle: React.CSSProperties = {
    cursor: "ew-resize",
    backgroundColor: "#ffffff",
    width: "10px",
    marginRight: "5px",
    height: "100%",
  };

  const middleColumnStyle: React.CSSProperties = {
    backgroundColor: "#ffffff",
    overflow: "auto",
    flexGrow: 1, // This allows the column to take up remaining space
    marginRight: "5px",
    height: "100%",
  };

  const rightColumnStyle: React.CSSProperties = {
    backgroundColor: "#ffffff",
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

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  return (
    <>
      <div style={{ ...leftColumnStyle }}>
        <div
          onClick={() => handleButtonClick("home")}
          style={{ width: "100%", userSelect: "none" }}
          className={cn(
            "button ml-6 mb-4 mt-4",
            activeButton === "home" ? "active" : ""
          )}
        >
          <Link href="/">
            <Icon symbol="home" />
            <span
              className="button-label"
              style={{
                paddingLeft: "20px",
                display:
                  parseInt(leftColumnWidth.replace("px", "")) <= 150
                    ? "none"
                    : "flex",
              }}
            >
              Home
            </span>
          </Link>
        </div>
        <div
          onClick={() => handleButtonClick("notifications")}
          style={{ width: "100%", userSelect: "none" }}
          className={cn(
            "button ml-6 mb-6",
            activeButton === "notifications" ? "active" : ""
          )}
        >
          <Icon symbol="notifications" />
          <span
            className="button-label"
            style={{
              paddingLeft: "20px",
              display:
                parseInt(leftColumnWidth.replace("px", "")) <= 150
                  ? "none"
                  : "flex",
            }}
          >
            Notifications
          </span>
        </div>
        <div
          onClick={() => handleButtonClick("message")}
          style={{ width: "100%", userSelect: "none" }}
          className={cn(
            "button ml-6 mb-6",
            activeButton === "message" ? "active" : ""
          )}
        >
          <Icon symbol="message" />
          <span
            className="button-label"
            style={{
              paddingLeft: "20px",
              display:
                parseInt(leftColumnWidth.replace("px", "")) <= 150
                  ? "none"
                  : "flex",
            }}
          >
            Messages
          </span>
        </div>
        <div
          onClick={() => handleButtonClick("group")}
          style={{ width: "100%", userSelect: "none" }}
          className={cn(
            "button ml-6 mb-6",
            activeButton === "group" ? "active" : ""
          )}
        >
          <Icon symbol="group" />
          <span
            className="button-label"
            style={{
              paddingLeft: "20px",
              display:
                parseInt(leftColumnWidth.replace("px", "")) <= 150
                  ? "none"
                  : "flex",
            }}
          >
            Subscriptions
          </span>
        </div>
        <div
          onClick={() => handleButtonClick("account_circle")}
          style={{ width: "100%", userSelect: "none" }}
          className={cn(
            "button ml-6 mb-6",
            activeButton === "account_circle" ? "active" : ""
          )}
        >
          <Icon symbol="account_circle" />
          <span
            className="button-label"
            style={{
              paddingLeft: "20px",
              display:
                parseInt(leftColumnWidth.replace("px", "")) <= 150
                  ? "none"
                  : "flex",
            }}
          >
            Profile
          </span>
        </div>
        <div
          onClick={() => handleButtonClick("pending")}
          style={{ width: "100%", userSelect: "none" }}
          className={cn(
            "button ml-6 mb-6",
            activeButton === "pending" ? "active" : ""
          )}
        >
          <Icon symbol="pending" />
          <span
            className="button-label"
            style={{
              paddingLeft: "20px",
              display:
                parseInt(leftColumnWidth.replace("px", "")) <= 150
                  ? "none"
                  : "flex",
            }}
          >
            More
          </span>
        </div>
        <div
          onClick={() => handleButtonClick("upload")}
          style={{ width: "100%", userSelect: "none" }}
          className={cn(
            "button ml-6 mb-6",
            activeButton === "upload" ? "active" : ""
          )}
        >
          <Link href="/upload">
            <Icon symbol="upload" />
            <span
              className="button-label"
              style={{
                paddingLeft: "20px",
                display:
                  parseInt(leftColumnWidth.replace("px", "")) <= 150
                    ? "none"
                    : "flex",
              }}
            >
              Upload
            </span>
          </Link>
        </div>
        <div
          onClick={() => handleButtonClick("weightedAverage")}
          style={{ width: "100%", userSelect: "none" }}
          className={cn(
            "button ml-6 mb-6",
            activeButton === "weightedAverage" ? "active" : ""
          )}
        >
          <Link href="/weightedAverage">
            <Icon symbol="upload" />
            <span
              className="button-label"
              style={{
                paddingLeft: "20px",
                display:
                  parseInt(leftColumnWidth.replace("px", "")) <= 150
                    ? "none"
                    : "flex",
              }}
            >
              Weighted Average
            </span>
          </Link>
        </div>
      </div>
      <div style={resizerStyle} onMouseDown={handleMouseDown}></div>
      <div style={middleColumnStyle}>
        {activeButton === 'home' && <HomePage />}
        {activeButton === 'upload' && <Upload id={inputId} />}
        {activeButton === 'weightedAverage' && <WeightedAveragePage />}
      </div>
      {/* <div style={rightColumnStyle}></div> */}
    </>
  );
}