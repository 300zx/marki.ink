import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const StampCarousel = () => {
  const [stamps, setStamps] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % stamps.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + stamps.length) % stamps.length);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (stamps.length === 0) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl mx-auto">
        {/* Main Image Container */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-4">
          <div className="relative aspect-[4/3] flex items-center justify-center">
            <img
              src={stamps[currentIndex]?.src}
              alt={stamps[currentIndex]?.title}
              className="max-w-full max-h-full object-contain"
              style={{ opacity: 1, transition: 'opacity 0.3s ease-in-out' }}
            />
            
            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-4 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-x-1"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} className="text-gray-800" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:translate-x-1"
              aria-label="Next image"
            >
              <ChevronRight size={24} className="text-gray-800" />
            </button>
          </div>
        </div>

        {/* Caption and Counter */}
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-2">
            {currentIndex + 1} of {stamps.length}
          </p>
          <h2 className="text-gray-800 text-lg font-medium">
            {stamps[currentIndex]?.title}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default StampCarousel;