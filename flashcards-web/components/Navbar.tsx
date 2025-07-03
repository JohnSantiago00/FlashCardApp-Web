// components/Navbar.tsx
"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: "1rem",
        padding: "1rem",
        backgroundColor: "#f9fafb",
        borderBottom: "1px solid #ddd",
        fontSize: "1rem",
      }}
    >
      <Link href="/">🏠 Home</Link>
      <Link href="/Add">➕ Create New Deck</Link>
      <Link href="/Cards">📋 View Decks</Link>
      <Link href="/Study">🎯 Study</Link>
      <Link href="/Import">📥 Import</Link>
    </nav>
  );
}
