"use client";

import React, { useEffect, useState } from "react";
import { useFlashcardContext } from "../../context/FlashcardContext";

function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function StudyPage() {
  const { cards } = useFlashcardContext();

  const [shuffledCards, setShuffledCards] = useState<typeof cards>([]);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [shuffleEnabled, setShuffleEnabled] = useState(true);

  // Load shuffle state from localStorage on first mount
  useEffect(() => {
    const saved = localStorage.getItem("shuffle");
    if (saved === "false") setShuffleEnabled(false);
  }, []);

  // Shuffle cards when cards or shuffle preference changes
  useEffect(() => {
    const updated = shuffleEnabled ? shuffleArray(cards) : cards;
    setShuffledCards(updated);
    setIndex(0);
    setShowAnswer(false);
  }, [cards, shuffleEnabled]);

  const handleNext = () => {
    if (shuffledCards.length > 0) {
      setIndex((prev) => (prev + 1) % shuffledCards.length);
      setShowAnswer(false);
    }
  };

  const handleShuffleToggle = () => {
    const newVal = !shuffleEnabled;
    setShuffleEnabled(newVal);
    localStorage.setItem("shuffle", String(newVal));
  };

  const handleShuffleAgain = () => {
    setShuffledCards(shuffleArray(shuffledCards));
    setIndex(0);
    setShowAnswer(false);
  };

  if (shuffledCards.length === 0) {
    return (
      <div className="container">
        <h1>🧠 Study Mode</h1>
        <p>You haven’t added any flashcards yet.</p>
      </div>
    );
  }

  const currentCard = shuffledCards[index];

  return (
    <div className="container">
      <h1 className="page-title">🧠 Study Mode</h1>

      <div className="controls">
        <label>
          <input
            type="checkbox"
            checked={shuffleEnabled}
            onChange={handleShuffleToggle}
          />{" "}
          Shuffle Mode
        </label>
        {shuffleEnabled && (
          <button onClick={handleShuffleAgain} className="secondary-button">
            🔀 Shuffle Again
          </button>
        )}
      </div>

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
        disabled={shuffledCards.length <= 1}
      >
        {shuffledCards.length <= 1 ? "Only 1 card" : "Next ➡️"}
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
        .controls {
          display: flex;
          justify-content: center;
          gap: 1rem;
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
        .secondary-button {
          background-color: #0288d1;
          color: white;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          font-size: 0.9rem;
          cursor: pointer;
        }
        .primary-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
