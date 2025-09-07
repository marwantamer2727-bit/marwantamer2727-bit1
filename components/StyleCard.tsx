import React from 'react';

interface StyleCardProps {
  name: string;
  imageUrl: string;
  isSelected: boolean;
  onClick: () => void;
}

export const StyleCard: React.FC<StyleCardProps> = ({ name, imageUrl, isSelected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-105 group ${
        isSelected ? 'ring-4 ring-sky-500' : 'ring-2 ring-slate-700 hover:ring-sky-600'
      }`}
    >
      <img src={imageUrl} alt={name} className="w-full h-24 object-cover" />
      <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-40 transition-colors duration-300 flex items-center justify-center p-1">
        <h3 className="text-white text-sm font-bold text-center">{name}</h3>
      </div>
      {isSelected && (
        <div className="absolute top-2 right-2 bg-sky-500 text-white rounded-full p-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </div>
  );
};
