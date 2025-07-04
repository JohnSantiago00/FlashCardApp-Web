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

  useEffect(() => {
    const saved = localStorage.getItem("shuffle");
    if (saved === "false") setShuffleEnabled(false);
  }, []);

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

  const handleBack = () => {
    if (shuffledCards.length > 0) {
      setIndex((prev) => (prev === 0 ? shuffledCards.length - 1 : prev - 1));
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
    <div className="study-wrapper">
      <div className="overlay">
        <h1 className="page-title">🎓 Study Mode</h1>

        {/* Deck Selector */}
        <div className="deck-selector">
          <label>
            📁 Choose a deck:
            <select
              value={currentDeck?.id || ""}
              onChange={(e) => {
                const selected = decks.find((d) => d.id === e.target.value);
                if (selected) setCurrentDeck(selected);
              }}
            >
              <option value="">-- Select a deck --</option>
              {decks.map((deck) => (
                <option key={deck.id} value={deck.id}>
                  {deck.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        {!currentDeck && <p>Please select a deck to begin studying.</p>}

        {currentDeck && shuffledCards.length > 0 && (
          <>
            <div
              className="card-container"
              onClick={() => setShowAnswer((prev) => !prev)}
            >
              <p className="card-text">
                {showAnswer ? currentCard.answer : currentCard.question}
              </p>
              <small className="card-hint">
                (Click card to show {showAnswer ? "question" : "answer"})
              </small>
            </div>

            <div className="controls">
              <button onClick={handleBack}>⬅️ Back</button>
              <button onClick={handleNext} disabled={shuffledCards.length <= 1}>
                ➡️ Next
              </button>
            </div>

            <div className="extras">
              <label>
                <input
                  type="checkbox"
                  checked={shuffleEnabled}
                  onChange={handleShuffleToggle}
                />{" "}
                Shuffle
              </label>
              {shuffleEnabled && (
                <button onClick={handleShuffleAgain}>🔀 Shuffle Again</button>
              )}
            </div>
          </>
        )}

        {currentDeck && shuffledCards.length === 0 && (
          <p>This deck has no flashcards yet.</p>
        )}
      </div>

      <style jsx>{`
        .study-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #fff, #8ec5fc);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        .overlay {
          background: rgba(0, 0, 0, 0.65);
          padding: 2rem;
          border-radius: 16px;
          width: 100%;
          max-width: 700px;
          text-align: center;
        }
        .page-title {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }
        .deck-selector {
          margin-bottom: 1.5rem;
        }
        select {
          padding: 0.5rem;
          font-size: 1rem;
          border-radius: 8px;
          border: none;
        }
        .card-container {
          background: #fff;
          color: #333;
          border-radius: 12px;
          padding: 2.5rem;
          margin: 1rem 0;
          cursor: pointer;
          transition: transform 0.3s ease;
        }
        .card-container:hover {
          transform: scale(1.02);
        }
        .card-text {
          font-size: 1.5rem;
        }
        .card-hint {
          color: #888;
        }
        .controls {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin: 1rem 0;
        }
        .controls button {
          background-color: #22c55e;
          color: white;
          padding: 0.6rem 1.2rem;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          cursor: pointer;
        }
        .extras {
          margin-top: 1rem;
          display: flex;
          justify-content: center;
          gap: 1rem;
          align-items: center;
        }
        .extras button {
          background-color: #0ea5e9;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          border: none;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}
