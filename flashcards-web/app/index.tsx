import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Flashcards App</title>
      </Head>
      <section
        style={{
          textAlign: "center",
          padding: "2rem 1rem",
          maxWidth: "500px",
          margin: "0 auto",
        }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          🧠 Welcome to Flashcards App
        </h1>
        <p style={{ fontSize: "1.1rem", color: "#555" }}>
          Practice smarter. Create, review, and master anything — one card at a
          time.
        </p>
      </section>
    </>
  );
}
