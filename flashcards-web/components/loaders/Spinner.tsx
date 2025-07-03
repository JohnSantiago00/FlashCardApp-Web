"use client";

import React from "react";

export default function Spinner() {
  return (
    <>
      <div className="spinner" />
      <style jsx>{`
        .spinner {
          margin-top: 1rem;
          width: 24px;
          height: 24px;
          border: 4px solid #ccc;
          border-top: 4px solid #1976d2;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-left: auto;
          margin-right: auto;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}
