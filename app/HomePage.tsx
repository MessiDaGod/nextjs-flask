"use client";
import React, { useState, useEffect } from "react";
import Icon from "./Icon";
import cn from "classnames";
import Posts from "./Posts";
import Link from "next/link";

export default function HomePage({}) {
  return (
    <>
      <div
        style={{
          display: "flex",
          borderColor: "#e2e5e8",
          border: "2px solid #e2e5e8",
          justifyContent: "space-between",
        }}
      >
        <div className="homepage">
          <Link href="/">
            <span>Home</span>
          </Link>
        </div>
        <div className="homepage-right">
          <Icon symbol="more_vert" />
        </div>
      </div>
      <Posts />
    </>
  );
}
