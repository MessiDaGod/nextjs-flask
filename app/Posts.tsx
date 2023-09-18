"use client";
import React, { useState, useEffect } from "react";
import Icon from "./Icon";
import cn from "classnames";

export default function Posts({}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div className="homepage">
        <span>Home</span>
      </div>
      <div className="homepage-right">
        <Icon symbol="more_vert" />
      </div>
    </div>
  );
}
