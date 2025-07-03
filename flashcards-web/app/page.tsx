// app/page.tsx

import Link from "next/link";
export const metadata = {
  title: "Flashcards App",
};

export default function HomePage() {
  return (
    <section
      style={{
        textAlign: "center",
        padding: "2rem 1rem",
        maxWidth: "500px",
        margin: "0 auto",
        backgroundColor: "#fdfdfc",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem", color: "#333" }}>
        🧠 Welcome to Flashcards App
      </h1>
      <p style={{ fontSize: "1.1rem", color: "#555", marginBottom: "2rem" }}>
        Practice smarter. Create, review, and master anything — one card at a
        time.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Link
          href="/Cards"
          style={{
            textDecoration: "none",
            padding: "0.75rem",
            backgroundColor: "#5C67F2",
            color: "#fff",
            borderRadius: "8px",
            fontWeight: "bold",
          }}
        >
          📋 View Your Decks
        </Link>

        <Link
          href="/Add"
          style={{
            textDecoration: "none",
            padding: "0.75rem",
            backgroundColor: "#22c55e",
            color: "#fff",
            borderRadius: "8px",
            fontWeight: "bold",
          }}
        >
          ➕ Create New Deck
        </Link>

        <Link
          href="/Study"
          style={{
            textDecoration: "none",
            padding: "0.75rem",
            backgroundColor: "#0ea5e9",
            color: "#fff",
            borderRadius: "8px",
            fontWeight: "bold",
          }}
        >
          🎯 Study Mode
        </Link>

        <Link
          href="/Import"
          style={{
            textDecoration: "none",
            padding: "0.75rem",
            backgroundColor: "#a855f7",
            color: "#fff",
            borderRadius: "8px",
            fontWeight: "bold",
          }}
        >
          📥 Bulk Import
        </Link>
      </div>
    </section>
  );
}
