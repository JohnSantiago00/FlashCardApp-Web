"use client";

import React, { useState } from "react";
import EditCardModal from "../../components/modals/EditCardModal"; // ✅ Clean import
import { useFlashcardContext } from "../../context/FlashcardContext";

export default function FlashcardListPage() {
  const { cards, deleteCard, updateCard } = useFlashcardContext();

  const [editingCard, setEditingCard] = useState<null | {
    id: string;
    question: string;
    answer: string;
  }>(null);

  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");

  const startEdit = (card: {
    id: string;
    question: string;
    answer: string;
  }) => {
    setEditingCard(card);
    setEditQuestion(card.question);
    setEditAnswer(card.answer);
  };

  const handleEditSave = async () => {
    if (!editQuestion.trim() || !editAnswer.trim()) return;

    await updateCard(editingCard!.id, {
      question: editQuestion,
      answer: editAnswer,
    });

    setEditingCard(null);
  };

  return (
    <div
      style={{
        padding: "1.5rem",
        maxWidth: "800px",
        margin: "0 auto",
        backgroundColor: "#fdfdfc",
        borderRadius: "12px",
      }}
    >
      <h1
        style={{ fontSize: "2rem", marginBottom: "1rem", textAlign: "center" }}
      >
        📋 Your Flashcards
      </h1>

      {cards.length === 0 ? (
        <p style={{ textAlign: "center" }}>
          You haven’t added any flashcards yet.
        </p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {cards.map((card) => (
            <li
              key={card.id}
              style={{
                backgroundColor: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                borderRadius: "10px",
                padding: "1rem",
                marginBottom: "1rem",
              }}
            >
              <p>
                <strong>Q:</strong> {card.question}
              </p>
              <p>
                <strong>A:</strong> {card.answer}
              </p>
              <div
                style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}
              >
                <button
                  onClick={() => startEdit(card)}
                  style={{
                    padding: "0.5rem 0.75rem",
                    backgroundColor: "#5C67F2",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => deleteCard(card.id)}
                  style={{
                    padding: "0.5rem 0.75rem",
                    backgroundColor: "#F25C5C",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* 🧱 Modal is now a clean separate component */}
      {editingCard && (
        <EditCardModal
          question={editQuestion}
          answer={editAnswer}
          onCancel={() => setEditingCard(null)}
          onSave={handleEditSave}
          setQuestion={setEditQuestion}
          setAnswer={setEditAnswer}
        />
      )}
    </div>
  );
}
