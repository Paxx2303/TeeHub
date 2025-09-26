import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const heroSlides = [
    {
      title: "Thời Trang Năng Động",
      subtitle: "Khám phá bộ sưu tập áo thun premium",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=600&fit=crop"
    },
    {
      title: "Phong Cách Độc Đáo",
      subtitle: "Thiết kế hiện đại, chất lượng vượt trội",
      image: "https://images.unsplash.com/photo-1556821840-3a9fbc8d3c4a?w=800&h=600&fit=crop"
    },
    {
      title: "Thoải Mái Mọi Lúc",
      subtitle: "Vải cotton cao cấp, thoáng mát cả ngày",
      image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=600&fit=crop"
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-sky-500/20 to-blue-600/20"></div>
      {heroSlides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url(${slide.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      ))}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h2 className={`text-5xl md:text-7xl font-bold mb-6 transform transition-all duration-1000 text-shadow ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          {heroSlides[currentSlide].title}
        </h2>
        <p className={`text-xl md:text-2xl mb-8 transform transition-all duration-1000 delay-300 text-shadow ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          {heroSlides[currentSlide].subtitle}
        </p>
        <div className={`transform transition-all duration-1000 delay-600 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <button className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transform transition-all hover:scale-105 shadow-lg">
            Khám Phá Ngay
          </button>
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-white" />
      </div>
    </section>
  );
};

export default HeroSection;