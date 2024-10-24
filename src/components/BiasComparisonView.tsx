import React from 'react';
import { motion } from 'framer-motion';
import BiasIndicator from './BiasIndicator';
import { GdeltArticle, BiasSource } from '../services/gdeltApi';

interface BiasComparisonViewProps {
  articles: Array<{
    article: GdeltArticle;
    biasInfo: BiasSource;
  }>;
}

const BiasComparisonView: React.FC<BiasComparisonViewProps> = ({ articles }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
      {['left', 'center', 'right'].map((bias) => {
        const biasArticles = articles.filter(({ biasInfo }) => biasInfo.bias === bias);
        
        return (
          <motion.div
            key={bias}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-center capitalize mb-4">
              {bias} Perspective
            </h3>
            
            {biasArticles.map(({ article, biasInfo }, index) => (
              <motion.div
                key={article.url}
                initial={{ opacity: 0, x: bias === 'left' ? -20 : bias === 'right' ? 20 : 0 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <BiasIndicator
                      bias={biasInfo.bias}
                      sourceLogo={biasInfo.logo}
                      sourceName={article.domain}
                      size="sm"
                    />
                    <span className="text-sm text-gray-600">{article.domain}</span>
                  </div>
                  
                  <h4 className="font-medium mb-2 line-clamp-2">{article.title}</h4>
                  
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Read Article →
                  </a>
                </div>
              </motion.div>
            ))}
            
            {biasArticles.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No articles found
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default BiasComparisonView;