import { PawPrint } from 'lucide-react'; 
import React from 'react';

type LoadingScreenProps = {
  message?: string;
};

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = "Carregando..." }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-orange-50 to-teal-50">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin text-teal-500">
          <PawPrint size={80} />
        </div>
        <p className="text-xl font-semibold text-gray-700 animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;