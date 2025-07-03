"use client";

import EditCardModal from "@/components/modals/EditCardModal";
import { db } from "@/lib/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

export default function FlashcardListPage() {
  const params = useParams();
  const router = useRouter();
  const deckId = params?.deckId as string;

  const [deckName, setDeckName] = useState("");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
  const [editedQuestion, setEditedQuestion] = useState("");
  const [editedAnswer, setEditedAnswer] = useState("");

  useEffect(() => {
    const loadDeck = async () => {
      const deckRef = doc(db, "decks", deckId);
      const deckSnap = await getDoc(deckRef);
      if (deckSnap.exists()) {
        setDeckName(deckSnap.data().name);
      }

      const cardsRef = collection(db, "decks", deckId, "flashcards");
      const cardsSnap = await getDocs(cardsRef);
      const loadedCards = cardsSnap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Flashcard, "id">),
      }));
      setFlashcards(loadedCards);
    };

    if (deckId) {
      loadDeck();
    }
  }, [deckId]);

  const handleDeleteCard = async (cardId: string) => {
    await deleteDoc(doc(db, "decks", deckId, "flashcards", cardId));
    setFlashcards((prev) => prev.filter((c) => c.id !== cardId));
  };

  const handleDeleteDeck = async () => {
    const confirm = window.confirm(
      `Are you sure you want to delete the deck "${deckName}" and all its cards?`
    );
    if (!confirm) return;

    const cardsRef = collection(db, "decks", deckId, "flashcards");
    const cardsSnap = await getDocs(cardsRef);
    await Promise.all(
      cardsSnap.docs.map((docSnap) =>
        deleteDoc(doc(db, "decks", deckId, "flashcards", docSnap.id))
      )
    );

    await deleteDoc(doc(db, "decks", deckId));
    router.push("/Cards");
  };

  const startEditing = (card: Flashcard) => {
    setEditingCard(card);
    setEditedQuestion(card.question);
    setEditedAnswer(card.answer);
  };

  const handleSaveEdit = async () => {
    if (!editingCard) return;

    await updateDoc(doc(db, "decks", deckId, "flashcards", editingCard.id), {
      question: editedQuestion,
      answer: editedAnswer,
    });

    setFlashcards((prev) =>
      prev.map((c) =>
        c.id === editingCard.id
          ? { ...c, question: editedQuestion, answer: editedAnswer }
          : c
      )
    );

    setEditingCard(null);
  };

  return (
    <div className="container">
      <h1 className="page-title">📁 {deckName}</h1>

      <button className="delete-deck-button" onClick={handleDeleteDeck}>
        🗑️ Delete Deck
      </button>

      {flashcards.length === 0 ? (
        <p>This deck has no flashcards yet.</p>
      ) : (
        <ul className="card-list">
          {flashcards.map((card) => (
            <li key={card.id} className="card">
              <strong>Q:</strong> {card.question}
              <br />
              <strong>A:</strong> {card.answer}
              <div className="actions">
                <button
                  className="edit-button"
                  onClick={() => startEditing(card)}
                >
                  ✏️ Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteCard(card.id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editingCard && (
        <EditCardModal
          question={editedQuestion}
          answer={editedAnswer}
          setQuestion={setEditedQuestion}
          setAnswer={setEditedAnswer}
          onSave={handleSaveEdit}
          onCancel={() => setEditingCard(null)}
        />
      )}

      <style jsx>{`
        .container {
          padding: 2rem;
          max-width: 700px;
          margin: 0 auto;
        }
        .page-title {
          font-size: 2rem;
          margin-bottom: 1rem;
        }
        .delete-deck-button {
          background: #e53935;
          color: white;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          margin-bottom: 1.5rem;
          cursor: pointer;
        }
        .card-list {
          list-style: none;
          padding: 0;
        }
        .card {
          background: #fefefe;
          border: 1px solid #ddd;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
        }
        .actions {
          margin-top: 0.5rem;
          display: flex;
          gap: 0.5rem;
        }
        .edit-button,
        .delete-button {
          padding: 0.4rem 0.8rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .edit-button {
          background-color: #1976d2;
          color: white;
        }
        .delete-button {
          background-color: #c62828;
          color: white;
        }
      `}</style>
    </div>
  );
}
