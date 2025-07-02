"use client";

import React from "react";

interface EditCardModalProps {
  question: string;
  answer: string;
  setQuestion: (val: string) => void;
  setAnswer: (val: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function EditCardModal({
  question,
  answer,
  setQuestion,
  setAnswer,
  onSave,
  onCancel,
}: EditCardModalProps) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: "12px",
          width: "90%",
          maxWidth: "500px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
      >
        <h2 style={{ marginBottom: "1rem" }}>✏️ Edit Flashcard</h2>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Edit Question"
          style={{
            width: "100%",
            padding: "0.75rem",
            marginBottom: "1rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Edit Answer"
          style={{
            width: "100%",
            padding: "0.75rem",
            marginBottom: "1rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "1rem",
          }}
        >
          <button
            onClick={onCancel}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#ccc",
              borderRadius: "6px",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#5C67F2",
              color: "#fff",
              borderRadius: "6px",
            }}
          >
            Save ✅
          </button>
        </div>
      </div>
    </div>
  );
}
