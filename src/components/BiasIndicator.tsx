import React from 'react';
import { motion } from 'framer-motion';

interface BiasIndicatorProps {
  bias: 'left' | 'center' | 'right';
  sourceLogo?: string;
  sourceName: string;
  size?: 'sm' | 'md' | 'lg';
}

const BiasIndicator: React.FC<BiasIndicatorProps> = ({ 
  bias, 
  sourceLogo, 
  sourceName,
  size = 'md' 
}) => {
  const getBiasColor = (bias: string) => {
    switch (bias) {
      case 'left': return 'bg-blue-500';
      case 'right': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      className="relative group"
    >
      <div 
        className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 ${getBiasColor(bias)} 
                    shadow-lg flex items-center justify-center`}
      >
        {sourceLogo ? (
          <img 
            src={sourceLogo} 
            alt={sourceName}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-white font-bold">
            {sourceName.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 
                    group-hover:opacity-100 transition-opacity bg-black text-white text-xs 
                    rounded px-2 py-1 whitespace-nowrap">
        {sourceName}
      </div>
    </motion.div>
  );
};

export default BiasIndicator;