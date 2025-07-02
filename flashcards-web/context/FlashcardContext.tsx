"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDocs,
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

// Define what a flashcard looks like
export interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

// What values will be provided to components
interface FlashcardContextType {
  cards: Flashcard[];
  addCard: (card: Omit<Flashcard, "id">) => Promise<void>;
  deleteCard: (id: string) => Promise<void>;
  updateCard: (id: string, updated: Omit<Flashcard, "id">) => Promise<void>; // ✅ NEW
}

// Create default context
const FlashcardContext = createContext<FlashcardContextType>({
  cards: [],
  addCard: async () => {},
  deleteCard: async () => {},
  updateCard: async () => {}, // ✅ NEW
});

export const useFlashcardContext = () => useContext(FlashcardContext);

export const FlashcardProvider = ({ children }: { children: ReactNode }) => {
  const [cards, setCards] = useState<Flashcard[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "flashcards"), (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as DocumentData),
      })) as Flashcard[];
      setCards(docs);
    });

    return () => unsubscribe();
  }, []);

  const addCard = async (card: Omit<Flashcard, "id">) => {
    await addDoc(collection(db, "flashcards"), card);
  };

  const deleteCard = async (id: string) => {
    await deleteDoc(doc(db, "flashcards", id));
  };

  const updateCard = async (id: string, updated: Omit<Flashcard, "id">) => {
    await updateDoc(doc(db, "flashcards", id), updated);
  };

  return (
    <FlashcardContext.Provider
      value={{ cards, addCard, deleteCard, updateCard }}
    >
      {children}
    </FlashcardContext.Provider>
  );
};
