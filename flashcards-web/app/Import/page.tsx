"use client";

import Spinner from "@/components/loaders/Spinner";
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function BulkImportPage() {
  const router = useRouter();

  const [bulkText, setBulkText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [decks, setDecks] = useState<{ id: string; name: string }[]>([]);
  const [deckId, setDeckId] = useState("");
  const [newDeckName, setNewDeckName] = useState("");

  useEffect(() => {
    const fetchDecks = async () => {
      const snapshot = await getDocs(collection(db, "decks"));
      const loaded = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setDecks(loaded);
    };
    fetchDecks();
  }, []);

  const parseFlashcards = (text: string) => {
    return text
      .trim()
      .split(/\n\s*\n/)
      .map((block) => {
        const q = block.match(/Q:\s*(.+)/i);
        const a = block.match(/A:\s*(.+)/i);
        if (!q || !a) return null;
        return { question: q[1].trim(), answer: a[1].trim() };
      })
      .filter(Boolean) as { question: string; answer: string }[];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cards = parseFlashcards(bulkText);

    if (cards.length === 0) {
      setError("⚠️ Could not find any valid Q/A pairs. Check your formatting.");
      return;
    }

    setError("");
    setLoading(true);

    let finalDeckId = deckId;

    if (newDeckName.trim()) {
      const newDeckRef = await addDoc(collection(db, "decks"), {
        name: newDeckName.trim(),
        createdAt: serverTimestamp(),
      });
      finalDeckId = newDeckRef.id;
    }

    if (!finalDeckId) {
      setError("⚠️ Please select or create a deck.");
      setLoading(false);
      return;
    }

    for (const card of cards) {
      await addDoc(collection(db, "decks", finalDeckId, "flashcards"), {
        ...card,
        createdAt: serverTimestamp(),
      });
    }

    setLoading(false);
    alert(`✅ Successfully imported ${cards.length} cards!`);
    setBulkText("");
    setDeckId("");
    setNewDeckName("");
    router.push(`/Cards/${finalDeckId}`);
  };

  return (
    <div className="container">
      <h1 className="title">📥 Import Decks</h1>

      <form onSubmit={handleSubmit} className="form">
        <div className="field">
          <label className="label">Select Existing Deck</label>
          <select
            className="input"
            value={deckId}
            onChange={(e) => setDeckId(e.target.value)}
            disabled={!!newDeckName}
          >
            <option value="">-- Choose a deck --</option>
            {decks.map((deck) => (
              <option key={deck.id} value={deck.id}>
                {deck.name}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="label">Or Create New Deck</label>
          <input
            className="input"
            type="text"
            placeholder="E.g. Backend Interview"
            value={newDeckName}
            onChange={(e) => setNewDeckName(e.target.value)}
            disabled={!!deckId}
          />
        </div>

        <div className="field">
          <label className="label">Paste Flashcards (Q/A Format)</label>
          <textarea
            className="textarea"
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            placeholder={`Q: What is React?\nA: A JS library for UIs\n\nQ: What is 2 + 2?\nA: 4`}
            disabled={loading}
          />
        </div>

        {error && <p className="error">{error}</p>}

        <button className="button" type="submit" disabled={loading}>
          {loading ? "Importing..." : "Import Cards"}
        </button>

        {loading && (
          <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
            <Spinner />
          </div>
        )}
      </form>

      <style jsx>{`
        .container {
          padding: 2rem 1rem;
          max-width: 700px;
          margin: 0 auto;
        }

        .title {
          text-align: center;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 2rem;
          color: #333;
        }

        .form {
          background: #fff;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .field {
          margin-bottom: 1.5rem;
        }

        .label {
          display: block;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #444;
        }

        .input,
        .textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 8px;
        }

        .textarea {
          min-height: 180px;
          resize: vertical;
        }

        .button {
          width: 100%;
          background-color: #1976d2;
          color: white;
          padding: 0.85rem 1rem;
          font-size: 1rem;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        .button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error {
          color: red;
          font-weight: bold;
          margin-bottom: 1rem;
        }

        @media (max-width: 480px) {
          .form {
            padding: 1.25rem;
          }

          .title {
            font-size: 1.5rem;
          }

          .button {
            font-size: 0.95rem;
          }
        }
      `}</style>
    </div>
  );
}
