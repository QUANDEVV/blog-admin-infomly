"use client";
import { useEffect } from "react";

export default function Track({ category, id }) {
  useEffect(() => {
    fetch("/api/increment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, id }),
    }).catch(error => {
      // Failed to track views
    });
  }, [category, id]);

  return null;
}
