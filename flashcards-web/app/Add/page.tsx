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

export default function AddFlashcardPage() {
  const router = useRouter();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [deckId, setDeckId] = useState("");
  const [newDeckName, setNewDeckName] = useState("");
  const [decks, setDecks] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch existing decks on mount
  useEffect(() => {
    const fetchDecks = async () => {
      const snapshot = await getDocs(collection(db, "decks"));
      const allDecks = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setDecks(allDecks);
    };
    fetchDecks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    setLoading(true);

    let finalDeckId = deckId;

    // If creating a new deck
    if (newDeckName.trim()) {
      const deckRef = await addDoc(collection(db, "decks"), {
        name: newDeckName.trim(),
        createdAt: serverTimestamp(),
      });
      finalDeckId = deckRef.id;
    }

    if (!finalDeckId) {
      alert("Please select or create a deck.");
      setLoading(false);
      return;
    }

    // Add card to the deck's cards subcollection
    await addDoc(collection(db, "decks", finalDeckId, "flashcards"), {
      question,
      answer,
      createdAt: serverTimestamp(),
    });

    setQuestion("");
    setAnswer("");
    setNewDeckName("");
    setDeckId("");
    setLoading(false);
    router.push("/Cards");
  };

  return (
    <section
      style={{
        background: "#f5f7ff",
        minHeight: "100vh",
        padding: "2rem 1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "12px",
          padding: "2rem",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          width: "100%",
          maxWidth: "500px",
        }}
      >
        <h1 style={{ fontSize: "1.8rem", textAlign: "center", color: "#333" }}>
          ➕ Add a Flashcard
        </h1>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <label style={{ fontWeight: "bold", color: "#333" }}>
            Select Existing Deck
            <select
              value={deckId}
              onChange={(e) => setDeckId(e.target.value)}
              disabled={!!newDeckName}
              style={{
                width: "100%",
                padding: "0.75rem",
                fontSize: "1rem",
                marginTop: "0.25rem",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            >
              <option value="">-- Choose a deck --</option>
              {decks.map((deck) => (
                <option key={deck.id} value={deck.id}>
                  {deck.name}
                </option>
              ))}
            </select>
          </label>

          <label style={{ fontWeight: "bold", color: "#333" }}>
            Or Create New Deck
            <input
              type="text"
              value={newDeckName}
              onChange={(e) => setNewDeckName(e.target.value)}
              placeholder="E.g. Full Stack"
              disabled={!!deckId}
              style={{
                width: "100%",
                padding: "0.75rem",
                fontSize: "1rem",
                marginTop: "0.25rem",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
          </label>

          <label style={{ fontWeight: "bold", color: "#333" }}>
            Question
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="E.g. What is a REST API?"
              style={{
                width: "100%",
                padding: "0.75rem",
                fontSize: "1rem",
                marginTop: "0.25rem",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
              disabled={loading}
            />
          </label>

          <label style={{ fontWeight: "bold", color: "#333" }}>
            Answer
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="E.g. A stateless API architecture using HTTP"
              style={{
                width: "100%",
                padding: "0.75rem",
                fontSize: "1rem",
                minHeight: "100px",
                marginTop: "0.25rem",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
              disabled={loading}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: "#6C63FF",
              color: "#fff",
              padding: "0.75rem",
              fontSize: "1rem",
              fontWeight: "bold",
              border: "none",
              borderRadius: "8px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Saving..." : "Save Flashcard"}
          </button>
        </form>

        {loading && (
          <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
            <Spinner />
          </div>
        )}
      </div>
    </section>
  );
}
