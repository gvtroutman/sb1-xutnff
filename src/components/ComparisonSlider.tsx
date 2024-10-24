import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GdeltArticle, BiasSource } from '../services/gdeltApi';
import BiasIndicator from './BiasIndicator';

interface ComparisonSliderProps {
  articles: Array<{
    article: GdeltArticle;
    biasInfo: BiasSource;
  }>;
  onClose: () => void;
}

const ComparisonSlider: React.FC<ComparisonSliderProps> = ({ articles, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipe = (direction: number) => {
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < articles.length) {
      setCurrentIndex(newIndex);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold">Similar Coverage</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="relative h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute inset-0 p-6"
            >
              {articles[currentIndex] && (
                <div className="h-full flex flex-col">
                  <div className="flex items-center space-x-4 mb-6">
                    <BiasIndicator
                      bias={articles[currentIndex].biasInfo.bias}
                      sourceLogo={articles[currentIndex].biasInfo.logo}
                      sourceName={articles[currentIndex].biasInfo.name}
                      size="lg"
                    />
                    <div>
                      <h3 className="font-bold text-lg">
                        {articles[currentIndex].biasInfo.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(articles[currentIndex].article.seendate).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    <img
                      src={articles[currentIndex].article.socialimage || 
                          'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop'}
                      alt={articles[currentIndex].article.title}
                      className="w-full h-64 object-cover rounded-xl mb-6"
                    />
                    
                    <h4 className="text-2xl font-bold mb-4">
                      {articles[currentIndex].article.title}
                    </h4>
                    
                    <p className="text-gray-600 mb-6">
                      {articles[currentIndex].article.description}
                    </p>

                    <a
                      href={articles[currentIndex].article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-full
                               hover:bg-gray-800 transition-colors"
                    >
                      Read full article
                    </a>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none px-4">
            {currentIndex > 0 && (
              <button
                onClick={() => handleSwipe(-1)}
                className="pointer-events-auto p-3 rounded-full bg-white shadow-lg 
                         hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}
            {currentIndex < articles.length - 1 && (
              <button
                onClick={() => handleSwipe(1)}
                className="pointer-events-auto p-3 rounded-full bg-white shadow-lg 
                         hover:bg-gray-100 transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-100">
          <div className="flex justify-center space-x-2">
            {articles.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentIndex ? 'w-8 bg-gray-900' : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ComparisonSlider;