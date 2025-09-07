import React from 'react';
import { ResultImage } from '../types';
import { Spinner } from './Spinner';
import { DownloadIcon } from './icons/DownloadIcon';

interface ImageCardProps {
  image: ResultImage;
}

export const ImageCard: React.FC<ImageCardProps> = ({ image }) => {
  const downloadImage = () => {
    if (image.src) {
      const link = document.createElement('a');
      link.href = image.src;
      link.download = 'generated-image.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden shadow-lg flex flex-col">
      <div className="relative aspect-square w-full bg-slate-900 flex items-center justify-center">
        {image.isLoading && <Spinner />}
        {image.error && <p className="text-red-400 p-4 text-center">{image.error}</p>}
        {image.src && <img src={image.src} alt="Generated result" className="object-cover w-full h-full" />}
        {image.src && (
          <button
            onClick={downloadImage}
            className="absolute top-2 right-2 bg-sky-600 hover:bg-sky-500 text-white p-2 rounded-full transition-colors"
            title="Download Image"
          >
            <DownloadIcon className="w-5 h-5" />
          </button>
        )}
      </div>
      <div className="p-4">
        <h4 className="text-sm font-semibold text-slate-300 mb-2">Styles Used:</h4>
        {image.usedStyles.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {image.usedStyles.map(style => (
              <div key={style.id} className="bg-slate-700 text-slate-200 text-xs font-medium px-2 py-1 rounded-full">
                {style.name}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 text-xs">No specific styles applied.</p>
        )}
      </div>
    </div>
  );
};
