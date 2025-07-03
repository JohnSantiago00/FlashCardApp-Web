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
  const { cards, decks, currentDeck, setCurrentDeck } = useFlashcardContext();

  const [shuffledCards, setShuffledCards] = useState<typeof cards>([]);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [shuffleEnabled, setShuffleEnabled] = useState(true);

  // Load shuffle preference
  useEffect(() => {
    const saved = localStorage.getItem("shuffle");
    if (saved === "false") setShuffleEnabled(false);
  }, []);

  // Update shuffled cards when `cards` or `shuffle` changes
  useEffect(() => {
    if (!currentDeck) return;
    const shuffled = shuffleEnabled ? shuffleArray(cards) : cards;
    setShuffledCards(shuffled);
    setIndex(0);
    setShowAnswer(false);
  }, [cards, shuffleEnabled, currentDeck]);

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

  const currentCard = shuffledCards[index];

  return (
    <div className="container">
      <h1 className="page-title">🧠 Study Mode</h1>

      {/* Deck Selector */}
      {decks.length > 0 && (
        <div className="deck-selector">
          <label htmlFor="deck-select">📁 Choose a deck:</label>
          <select
            id="deck-select"
            value={currentDeck?.id || ""}
            onChange={(e) => {
              const selected = decks.find((d) => d.id === e.target.value);
              if (selected) {
                setCurrentDeck(selected);
              }
            }}
          >
            <option value="" disabled>
              -- Select a deck --
            </option>
            {decks.map((deck) => (
              <option key={deck.id} value={deck.id}>
                {deck.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {!currentDeck && <p>Please select a deck to begin studying.</p>}

      {currentDeck && shuffledCards.length > 0 && (
        <>
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
        </>
      )}

      {currentDeck && shuffledCards.length === 0 && (
        <p>This deck has no flashcards yet.</p>
      )}

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
        .deck-selector {
          margin-bottom: 1.5rem;
        }
        .deck-selector select {
          padding: 0.5rem;
          font-size: 1rem;
          margin-left: 0.5rem;
          border-radius: 6px;
          border: 1px solid #ccc;
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
