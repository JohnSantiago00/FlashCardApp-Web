"use client";

import React, { useEffect, useState } from "react";
import { useFlashcardContext } from "../../context/FlashcardContext";

export default function StudyPage() {
  const { cards } = useFlashcardContext();

  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    setIndex(0);
    setShowAnswer(false);
  }, [cards]);

  const handleNext = () => {
    if (cards.length > 0) {
      setIndex((prev) => (prev + 1) % cards.length);
      setShowAnswer(false);
    }
  };

  if (cards.length === 0) {
    return (
      <div className="container">
        <h1>🧠 Study Mode</h1>
        <p>You haven’t added any flashcards yet.</p>
      </div>
    );
  }

  const currentCard = cards[index];

  return (
    <div className="container">
      <h1 className="page-title">🧠 Study Mode</h1>

      <div className="card" onClick={() => setShowAnswer((prev) => !prev)}>
        <p className="card-text">
          {showAnswer ? currentCard.answer : currentCard.question}
        </p>
        <small className="card-hint">
          (Tap to see {showAnswer ? "question" : "answer"})
        </small>
      </div>

      <button
        onClick={handleNext}
        className="primary-button"
        disabled={cards.length <= 1}
      >
        {cards.length <= 1 ? "Only 1 card" : "Next ➡️"}
      </button>

      <style jsx>{`
        .container {
          padding: 2rem;
          text-align: center;
          max-width: 500px;
          margin: 0 auto;
        }
        .page-title {
          font-size: 2rem;
          margin-bottom: 1rem;
        }
        .card {
          background: #fff3e0;
          border: 2px solid #ffa726;
          padding: 2rem;
          border-radius: 12px;
          margin-bottom: 1rem;
          cursor: pointer;
          transition: background 0.3s;
        }
        .card:hover {
          background: #ffe0b2;
        }
        .card-text {
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
        }
        .card-hint {
          color: #888;
        }
        .primary-button {
          background-color: #43a047;
          color: white;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1rem;
        }
        .primary-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
