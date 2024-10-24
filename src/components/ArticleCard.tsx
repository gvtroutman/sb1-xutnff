import React from 'react';
import { ExternalLink, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import BiasIndicator from './BiasIndicator';
import { GdeltArticle, BiasSource } from '../services/gdeltApi';

interface ArticleCardProps {
  article: GdeltArticle;
  biasInfo: BiasSource;
  onClick?: () => void;
  showComparison?: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ 
  article, 
  biasInfo, 
  onClick,
  showComparison = false
}) => {
  const formattedDate = new Date(article.seendate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-3xl shadow-xl overflow-hidden h-full cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-48 sm:h-64">
        <img
          src={article.socialimage || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop'}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        <div className="absolute top-4 left-4">
          <BiasIndicator
            bias={biasInfo.bias}
            sourceLogo={biasInfo.logo}
            sourceName={biasInfo.name}
            size="md"
          />
        </div>

        {showComparison && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 
                       text-sm font-medium shadow-lg">
            Similar Coverage Available
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold mb-3 line-clamp-2">
          {article.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2">
          {article.description || article.title}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-sm text-gray-500">
            {formattedDate}
          </span>
          
          <motion.a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-gray-900 font-medium hover:text-gray-600 transition-colors"
            whileHover={{ x: 4 }}
            onClick={(e) => e.stopPropagation()}
          >
            Read full article
            <ExternalLink className="h-4 w-4 ml-1" />
          </motion.a>
        </div>

        {showComparison && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClick?.();
              }}
              className="w-full flex items-center justify-center text-gray-900 font-medium 
                       hover:text-gray-600 transition-colors"
            >
              View Similar Coverage
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ArticleCard;