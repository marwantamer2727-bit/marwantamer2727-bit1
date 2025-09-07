// Fix: Implemented the main App component, providing the UI and logic for the application.
import React, { useState, useRef } from 'react';
import { ImageCard } from './components/ImageCard';
import { StyleCard } from './components/StyleCard';
import { UploadIcon } from './components/icons/UploadIcon';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { IMAGE_STYLES } from './constants';
import { generateImage, editImage } from './services/geminiService';
import { ImageStyle, ResultImage } from './types';

function App() {
  const [prompt, setPrompt] = useState('');
  const [selectedStyles, setSelectedStyles] = useState<ImageStyle[]>([]);
  const [uploadedImage, setUploadedImage] = useState<{ data: string; mimeType: string; preview: string } | null>(null);
  const [results, setResults] = useState<ResultImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleStyle = (style: ImageStyle) => {
    setSelectedStyles(prev =>
      prev.find(s => s.id === style.id)
        ? prev.filter(s => s.id !== style.id)
        : [...prev, style]
    );
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setUploadedImage({
          data: base64String,
          mimeType: file.type,
          preview: URL.createObjectURL(file),
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateClick = async () => {
    if (!prompt && !uploadedImage) {
      alert('Please enter a prompt or upload an image.');
      return;
    }
    if (isGenerating) return;

    setIsGenerating(true);
    const resultIndex = results.length;
    setResults(prev => [...prev, { src: null, isLoading: true, error: null, usedStyles: [...selectedStyles] }]);

    try {
      let imageUrl: string;
      if (uploadedImage) {
        imageUrl = await editImage(prompt, selectedStyles, uploadedImage.data, uploadedImage.mimeType);
      } else {
        imageUrl = await generateImage(prompt, selectedStyles);
      }
      setResults(prev => {
        const newResults = [...prev];
        newResults[resultIndex] = { ...newResults[resultIndex], src: imageUrl, isLoading: false };
        return newResults;
      });
    } catch (e: any) {
      setResults(prev => {
        const newResults = [...prev];
        newResults[resultIndex] = { ...newResults[resultIndex], error: e.message || 'An unknown error occurred', isLoading: false };
        return newResults;
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      <main className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-sky-400">Gemini Image Studio</h1>
          <p className="text-slate-400 mt-2">Create and edit images with the power of AI</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Column */}
          <div className="lg:col-span-1 space-y-6 bg-slate-800 p-6 rounded-lg shadow-xl">
            <div>
              <label htmlFor="prompt" className="block text-lg font-medium text-slate-300 mb-2">1. Your Prompt</label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={uploadedImage ? "Describe the edits you want to make..." : "e.g., A cute cat wearing a wizard hat..."}
                className="w-full h-24 p-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none transition"
              />
            </div>

            <div>
              <h3 className="text-lg font-medium text-slate-300 mb-2">2. Upload an Image (Optional)</h3>
              <div
                className="w-full aspect-square border-2 border-dashed border-slate-600 rounded-lg flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-700 hover:border-sky-500 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {uploadedImage ? (
                  <img src={uploadedImage.preview} alt="Upload preview" className="object-cover w-full h-full rounded-lg" />
                ) : (
                  <>
                    <UploadIcon className="w-10 h-10 mb-2" />
                    <span>Click to upload</span>
                  </>
                )}
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              {uploadedImage && (
                <button onClick={() => setUploadedImage(null)} className="w-full mt-2 text-sm text-red-400 hover:text-red-300">
                  Remove Image
                </button>
              )}
            </div>

            <div>
              <h3 className="text-lg font-medium text-slate-300 mb-2">3. Choose Styles</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {IMAGE_STYLES.map(style => (
                  <StyleCard
                    key={style.id}
                    name={style.name}
                    imageUrl={style.imageUrl}
                    isSelected={selectedStyles.some(s => s.id === style.id)}
                    onClick={() => toggleStyle(style)}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerateClick}
              disabled={isGenerating || (!prompt && !uploadedImage)}
              className="w-full flex items-center justify-center bg-sky-600 hover:bg-sky-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors text-lg"
            >
              <SparklesIcon className="w-6 h-6 mr-2" />
              {isGenerating ? 'Generating...' : (uploadedImage ? 'Edit Image' : 'Generate Image')}
            </button>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-slate-300 mb-4">Results</h2>
            {results.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center bg-slate-800 rounded-lg p-12 h-full">
                <SparklesIcon className="w-16 h-16 text-slate-500 mb-4" />
                <h3 className="text-xl font-semibold text-slate-400">Your generated images will appear here</h3>
                <p className="text-slate-500">Enter a prompt and click "Generate" to start.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.map((image, index) => (
                  <ImageCard key={index} image={image} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
