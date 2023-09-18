"use client";
import React from "react";
import Icon from "./Icon";

export default function Posts({}) {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingLeft: "10px",
          paddingRight: "10px",
        }}
      >
        <textarea
          autoComplete="on"
          name="new_post"
          maxLength={2000}
          id="new_post_text_input"
          placeholder="Compose new post..."
          rows={1}
          style={{ height: "56px", width: "100%", cursor: "text" }}
        ></textarea>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          flexDirection: "row",
          paddingLeft: "10px",
          paddingRight: "10px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Icon symbol="ballot" tooltip="Add a Quiz" />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Icon symbol="how_to_vote" tooltip="Add a Poll" />
        </div>
      </div>
      <div className="divider"></div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="homepage">
          <i className="button sm active" style={{ marginRight: "10px" }}>
            All
          </i>
          <i className="button sm" style={{ marginRight: "10px" }}>
            Purchased
          </i>
          <Icon symbol="edit" size="sm" />
        </div>
        <div className="homepage-right">
          <Icon symbol="more_horiz" size="sm" />
        </div>
      </div>
    </>
  );
}
