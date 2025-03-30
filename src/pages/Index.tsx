
import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CreatorInterface from "@/components/CreatorInterface";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-animai">
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4">
          <Hero />
          <CreatorInterface />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
