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
    <div className="study-container">
      <h1 className="page-title">🎓 Study Mode</h1>

      <div className="deck-select">
        <label htmlFor="deck">Choose a Deck:</label>
        <select
          id="deck"
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
      </div>

      {!currentDeck && (
        <p className="placeholder-text">Pick a deck to begin studying.</p>
      )}

      {currentDeck && shuffledCards.length > 0 && (
        <>
          <div className="card" onClick={() => setShowAnswer((prev) => !prev)}>
            <p className="card-text">
              {showAnswer ? currentCard.answer : currentCard.question}
            </p>
            <p className="hint-text">
              (Tap to see {showAnswer ? "question" : "answer"})
            </p>
          </div>

          <div className="nav-buttons">
            <button onClick={handleBack}>⬅️ Back</button>
            <button onClick={handleNext} disabled={shuffledCards.length <= 1}>
              Next ➡️
            </button>
          </div>

          <div className="options">
            <label className="shuffle-toggle">
              <input
                type="checkbox"
                checked={shuffleEnabled}
                onChange={handleShuffleToggle}
              />
              Shuffle
            </label>
            {shuffleEnabled && (
              <button className="shuffle-button" onClick={handleShuffleAgain}>
                🔀 Shuffle Again
              </button>
            )}
          </div>
        </>
      )}

      {currentDeck && shuffledCards.length === 0 && (
        <p className="placeholder-text">This deck has no flashcards yet.</p>
      )}

      <style jsx>{`
        .study-container {
          min-height: 100vh;
          background: linear-gradient(160deg, #5c67f2 10%, #a1c4fd 90%);
          padding: 1rem;
          color: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .page-title {
          font-size: 2rem;
          margin-top: 1rem;
          margin-bottom: 1rem;
        }

        .deck-select {
          margin-bottom: 1.5rem;
          text-align: center;
        }

        select {
          padding: 0.6rem;
          font-size: 1rem;
          border-radius: 8px;
          border: none;
          margin-top: 0.5rem;
        }

        .card {
          background: #ffffff;
          color: #333;
          border-radius: 16px;
          padding: 2rem;
          width: 90%;
          max-width: 500px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
          text-align: center;
          margin-bottom: 1rem;
          cursor: pointer;
        }

        .card-text {
          font-size: 1.25rem;
          line-height: 1.6;
        }

        .hint-text {
          font-size: 0.85rem;
          margin-top: 1rem;
          color: #777;
        }

        .placeholder-text {
          font-size: 1rem;
          color: #eee;
          margin-top: 2rem;
        }

        .nav-buttons {
          display: flex;
          gap: 1rem;
          margin: 1rem 0;
        }

        .nav-buttons button {
          background: #22c55e;
          border: none;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
        }

        .options {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-top: 1rem;
          flex-wrap: wrap;
        }

        .shuffle-toggle {
          font-size: 1rem;
        }

        .shuffle-button {
          background: #0ea5e9;
          border: none;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.95rem;
          cursor: pointer;
        }

        @media (max-width: 600px) {
          .card-text {
            font-size: 1.1rem;
          }
          .page-title {
            font-size: 1.6rem;
          }
          .nav-buttons button {
            flex: 1;
            font-size: 0.95rem;
            padding: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}
