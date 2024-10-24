import React from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ErrorFallbackProps {
  error: string;
  resetError: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center"
    >
      <div className="bg-red-50 rounded-full p-4 mb-6">
        <AlertCircle className="h-8 w-8 text-red-500" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-3">Unable to Load Articles</h2>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {error}
      </p>

      <button
        onClick={resetError}
        className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-full
                 hover:bg-gray-800 transition-colors"
      >
        <RefreshCw className="h-5 w-5 mr-2" />
        Try Again
      </button>
    </motion.div>
  );
};

export default ErrorFallback;