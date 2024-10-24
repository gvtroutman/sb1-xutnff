import React from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  message: string;
  suggestion?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message, suggestion }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center"
    >
      <div className="bg-gray-100 rounded-full p-4 mb-6">
        <Search className="h-8 w-8 text-gray-400" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        {message}
      </h2>
      
      {suggestion && (
        <p className="text-gray-600 max-w-md">
          {suggestion}
        </p>
      )}
    </motion.div>
  );
};

export default EmptyState;