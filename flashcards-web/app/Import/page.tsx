"use client";

import React, { useState } from "react";
import { useFlashcardContext } from "../../context/FlashcardContext";

export default function BulkImportPage() {
  const { addCard } = useFlashcardContext();
  const [bulkText, setBulkText] = useState("");
  const [error, setError] = useState("");

  const parseFlashcards = (text: string) => {
    const entries = text
      .trim()
      .split(/\n\s*\n/)
      .map((block) => {
        const questionMatch = block.match(/Q:\s*(.+)/i);
        const answerMatch = block.match(/A:\s*(.+)/i);
        if (!questionMatch || !answerMatch) return null;

        return {
          question: questionMatch[1].trim(),
          answer: answerMatch[1].trim(),
        };
      })
      .filter(Boolean);

    return entries;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cards = parseFlashcards(bulkText);

    if (cards.length === 0) {
      setError("⚠️ Could not find any valid Q/A pairs. Check your formatting.");
      return;
    }

    setError("");

    for (const card of cards) {
      await addCard(card);
    }

    alert(`✅ Successfully imported ${cards.length} flashcards!`);
    setBulkText("");
  };

  return (
    <div className="container">
      <h1 className="page-title">📥 Bulk Import Flashcards</h1>

      <p className="description">
        Paste flashcards like this:
        <br />
        <code>Q: What is React?</code>
        <br />
        <code>A: A JS library for UIs</code>
        <br />
        (Each card separated by a blank line)
      </p>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <textarea
          placeholder={`Q: What is React?\nA: A JavaScript library for building UIs\n\nQ: What is 2 + 2?\nA: 4`}
          value={bulkText}
          onChange={(e) => setBulkText(e.target.value)}
          className="bulk-textarea"
        />

        <button type="submit" className="primary-button">
          Import Flashcards
        </button>
      </form>

      <style jsx>{`
        .container {
          padding: 2rem;
          max-width: 600px;
          margin: 0 auto;
        }
        .page-title {
          font-size: 2rem;
          margin-bottom: 1rem;
        }
        .description {
          font-size: 1rem;
          margin-bottom: 1rem;
        }
        .error {
          color: red;
          font-weight: bold;
        }
        .bulk-textarea {
          width: 100%;
          min-height: 200px;
          padding: 1rem;
          font-size: 1rem;
          border-radius: 8px;
          border: 1px solid #ccc;
          margin-bottom: 1rem;
        }
        .primary-button {
          background-color: #1976d2;
          color: white;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
