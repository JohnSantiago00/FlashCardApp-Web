import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import { FlashcardProvider } from "../context/FlashcardContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flashcards App",
  description: "Create and study your own flashcards",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <FlashcardProvider>
          <Navbar />
          <main style={{ padding: "1rem" }}>{children}</main>
        </FlashcardProvider>
      </body>
    </html>
  );
}
