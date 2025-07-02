"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useFlashcardContext } from "../../context/FlashcardContext";

export default function AddFlashcardPage() {
  const { addCard } = useFlashcardContext();
  const router = useRouter();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    await addCard({ question, answer });
    setQuestion("");
    setAnswer("");
    router.push("/Cards");
  };

  return (
    <section
      style={{
        background: "#f5f7ff", // light pastel background
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
        <h1
          style={{
            fontSize: "1.8rem",
            textAlign: "center",
            color: "#333",
            marginBottom: "1.5rem",
          }}
        >
          ➕ Add a Flashcard
        </h1>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <label style={{ fontWeight: "bold", color: "#333" }}>
            Question
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="E.g. What is the capital of France?"
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
            Answer
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="E.g. Paris"
              style={{
                width: "100%",
                padding: "0.75rem",
                fontSize: "1rem",
                minHeight: "100px",
                marginTop: "0.25rem",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
          </label>

          <button
            type="submit"
            style={{
              background: "#6C63FF",
              color: "#fff",
              padding: "0.75rem",
              fontSize: "1rem",
              fontWeight: "bold",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "background 0.3s",
            }}
            onMouseOver={(e) =>
              ((e.target as HTMLButtonElement).style.background = "#594fe7")
            }
            onMouseOut={(e) =>
              ((e.target as HTMLButtonElement).style.background = "#6C63FF")
            }
          >
            Save Flashcard
          </button>
        </form>
      </div>
    </section>
  );
}
