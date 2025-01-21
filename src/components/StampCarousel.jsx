import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const StampCarousel = () => {
  const [stamps, setStamps] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const response = await fetch('/api/images');
        const files = await response.json();
        const stampImages = files
          .filter(file => file.toLowerCase().endsWith('.png'))
          .map((file, index) => ({
            id: index + 1,
            title: file.replace('.png', '').replace(/-/g, ' '),
            src: `/images/${file}`
          }));
        setStamps(stampImages);
      } catch (error) {
        console.error('Error loading images:', error);
      }
    };
    loadImages();
  }, []);

  const handleSlideChange = useCallback((newIndex) => {
    setIsTransitioning(true);
    setCurrentIndex(newIndex);
    setTimeout(() => setIsTransitioning(false), 300);
  }, []);

  const nextSlide = useCallback(() => {
    if (stamps.length > 0 && !isTransitioning) {
      handleSlideChange((currentIndex + 1) % stamps.length);
    }
  }, [stamps.length, currentIndex, isTransitioning, handleSlideChange]);

  const prevSlide = useCallback(() => {
    if (stamps.length > 0 && !isTransitioning) {
      handleSlideChange((currentIndex - 1 + stamps.length) % stamps.length);
    }
  }, [stamps.length, currentIndex, isTransitioning, handleSlideChange]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (stamps.length > 0 && !isTransitioning) {
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [stamps.length, nextSlide, prevSlide, isTransitioning]);

  if (stamps.length === 0) return null;

  return (
    <div className="min-h-screen relative">
      {/* Museum Background */}
      <div 
        className="absolute inset-0 bg-[url('/pexels-photo-3004909.jpeg')] bg-cover bg-center"
        style={{
          filter: 'brightness(0.9)'
        }}
      />
      
      {/* Content Overlay */}
      <div className="relative min-h-screen flex items-center justify-center p-4 bg-black/30">
        <div className="relative w-full max-w-4xl mx-auto">
          {/* Main Image Container */}
          <div className="bg-white/50 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-6">
            <div className="relative aspect-[4/3] flex items-center justify-center overflow-hidden rounded-2xl bg-black/5">
              <img
                src={stamps[currentIndex]?.src}
                alt={stamps[currentIndex]?.title}
                className={`max-w-full max-h-full object-contain transform transition-all duration-300 ${
                  isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                }`}
              />
              
              {/* Navigation Buttons */}
              <button
                onClick={prevSlide}
                className="absolute left-4 p-3 rounded-full bg-white/90 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-x-1 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="Previous image"
                disabled={isTransitioning}
              >
                <ChevronLeft size={24} className="text-gray-800" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 p-3 rounded-full bg-white/90 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:translate-x-1 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="Next image"
                disabled={isTransitioning}
              >
                <ChevronRight size={24} className="text-gray-800" />
              </button>
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mb-4">
            {stamps.map((_, index) => (
              <button
                key={index}
                onClick={() => handleSlideChange(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-white w-6' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="text-center">
            <p className="text-white/90 text-sm font-medium">
              {currentIndex + 1} of {stamps.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StampCarousel;