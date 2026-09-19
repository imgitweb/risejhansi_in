import React from 'react';
import Hero from '../components/Home/Hero';
import About from '../components/Home/About';
import Services from '../components/Home/Services'; // Isko import karein

const Home = () => {
  return (
    <main className="flex-grow">
      <Hero />
      <About />
      <Services /> {/* Yahan add karein */}
    </main>
  );
};

export default Home;