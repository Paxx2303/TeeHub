import React from 'react';
import Header from './components/Header.jsx';
import HeroSection from './components/HeroSection.jsx';
import FeaturesSection from './components/FeaturesSection.jsx';
import ProductsSection from './components/ProductsSection.jsx';
import AboutSection from './components/AboutSection.jsx';
import TeamSection from './components/TeamSection.jsx';
import NewsletterSection from './components/NewsletterSection.jsx';
import Footer from './components/Footer.jsx';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <ProductsSection />
      <AboutSection />
      <TeamSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
}

export default App;