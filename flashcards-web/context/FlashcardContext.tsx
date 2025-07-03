"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { db } from "../lib/firebase";

// Types
export interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

export interface Deck {
  id: string;
  name: string;
}

interface FlashcardContextType {
  cards: Flashcard[];
  decks: Deck[];
  currentDeck: Deck | null;
  setCurrentDeck: (deck: Deck) => void;
  addDeck: (name: string) => Promise<void>;
  addCard: (card: Omit<Flashcard, "id">) => Promise<void>;
  deleteCard: (id: string) => Promise<void>;
  updateCard: (id: string, updated: Omit<Flashcard, "id">) => Promise<void>;
}

const FlashcardContext = createContext<FlashcardContextType>({
  cards: [],
  decks: [],
  currentDeck: null,
  setCurrentDeck: () => {},
  addDeck: async () => {},
  addCard: async () => {},
  deleteCard: async () => {},
  updateCard: async () => {},
});

export const useFlashcardContext = () => useContext(FlashcardContext);

export const FlashcardProvider = ({ children }: { children: ReactNode }) => {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [currentDeck, setCurrentDeck] = useState<Deck | null>(null);

  // Load decks
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "decks"), (snapshot) => {
      const loaded = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as { name: string }),
      }));
      setDecks(loaded);
    });

    return () => unsub();
  }, []);

  // Load flashcards when a deck is selected
  useEffect(() => {
    if (!currentDeck) {
      setCards([]);
      return;
    }

    const ref = collection(db, "decks", currentDeck.id, "flashcards");
    const unsub = onSnapshot(ref, (snapshot) => {
      const loaded = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Flashcard, "id">),
      }));
      setCards(loaded);
    });

    return () => unsub();
  }, [currentDeck]);

  const addDeck = async (name: string) => {
    await addDoc(collection(db, "decks"), { name });
  };

  const addCard = async (card: Omit<Flashcard, "id">) => {
    if (!currentDeck) return;
    await addDoc(collection(db, "decks", currentDeck.id, "flashcards"), card);
  };

  const deleteCard = async (id: string) => {
    if (!currentDeck) return;
    await deleteDoc(doc(db, "decks", currentDeck.id, "flashcards", id));
  };

  const updateCard = async (id: string, updated: Omit<Flashcard, "id">) => {
    if (!currentDeck) return;
    await updateDoc(
      doc(db, "decks", currentDeck.id, "flashcards", id),
      updated
    );
  };

  return (
    <FlashcardContext.Provider
      value={{
        cards,
        decks,
        currentDeck,
        setCurrentDeck,
        addDeck,
        addCard,
        deleteCard,
        updateCard,
      }}
    >
      {children}
    </FlashcardContext.Provider>
  );
};
