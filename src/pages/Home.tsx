import React from "react";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <>
      <Navbar />

      {/* Conteúdo da Home depois */}
      <main className="container mx-auto py-8">
        <h1 className="text-2xl font-bold">Página Inicial</h1>
      </main>
    </>
  );
};

export default Home;
