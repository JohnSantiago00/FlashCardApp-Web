"use client";

import { useFlashcardContext } from "@/context/FlashcardContext";
import Link from "next/link";
import React from "react";

export default function DecksPage() {
  const { decks } = useFlashcardContext();

  return (
    <div className="container">
      <h1 className="page-title">📚 Your Decks</h1>

      {decks.length === 0 ? (
        <p>You haven&apos;t created any decks yet.</p>
      ) : (
        <ul className="deck-list">
          {decks.map((deck) => (
            <li key={deck.id} className="deck-card">
              <Link href={`/Cards/${deck.id}`}>📁 {deck.name}</Link>
            </li>
          ))}
        </ul>
      )}

      <style jsx>{`
        .container {
          padding: 2rem;
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
        }
        .page-title {
          font-size: 2rem;
          margin-bottom: 1rem;
        }
        .deck-list {
          list-style: none;
          padding: 0;
        }
        .deck-card {
          background: #f5f5f5;
          padding: 1rem;
          margin: 0.5rem 0;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.3s;
        }
        .deck-card:hover {
          background: #e0e0e0;
        }
      `}</style>
    </div>
  );
}
