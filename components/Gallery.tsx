import React from 'react';
import { BookState } from '../types';
import { generatePDF } from '../services/pdfGenerator';

interface GalleryProps {
  bookState: BookState;
}

const Gallery: React.FC<GalleryProps> = ({ bookState }) => {
  if (bookState.status === 'idle' && bookState.pages.length === 0) return null;

  const isComplete = bookState.status === 'ready';
  const hasContent = bookState.cover.imageUrl || bookState.pages.some(p => p.imageUrl);

  const handleDownload = () => {
    generatePDF(bookState);
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-16 px-4 pb-24">
      {/* Header for Results */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="font-display text-3xl font-bold text-brand-900">
          {bookState.childName}'s Book Preview
        </h2>
        {isComplete && (
          <button
            onClick={handleDownload}
            className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-500/30 transition-all transform hover:scale-105 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Download PDF
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* COVER CARD */}
        <div className="relative aspect-[3/4] rounded-2xl bg-white shadow-md overflow-hidden border-4 border-yellow-400 group">
          <div className="absolute inset-0 bg-gray-100 animate-pulse z-0"></div>
          {bookState.cover.imageUrl ? (
            <>
               <img 
                 src={bookState.cover.imageUrl} 
                 alt="Cover" 
                 className="absolute inset-0 w-full h-full object-cover z-10"
               />
               <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-3 z-20">
                 <span className="text-xs font-bold uppercase tracking-wider text-yellow-400">Cover</span>
                 <p className="text-sm truncate">{bookState.cover.description}</p>
               </div>
            </>
          ) : (
             <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-6 text-center">
                {bookState.status === 'error' ? (
                    <span className="text-red-500">Failed to load</span>
                ) : (
                    <>
                        <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin mb-4"></div>
                        <p className="text-brand-800 font-medium">Designing Cover...</p>
                    </>
                )}
             </div>
          )}
        </div>

        {/* PAGES */}
        {bookState.pages.map((page, idx) => (
          <div key={page.id} className="relative aspect-[3/4] rounded-2xl bg-white shadow-md overflow-hidden border border-brand-100 group hover:shadow-xl transition-shadow">
             <div className="absolute inset-0 bg-gray-50 animate-pulse z-0"></div>
             {page.imageUrl ? (
               <>
                <img 
                  src={page.imageUrl} 
                  alt={`Page ${idx + 1}`} 
                  className="absolute inset-0 w-full h-full object-cover z-10"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-sm z-20 text-xs font-bold text-brand-900">
                  #{idx + 1}
                </div>
               </>
             ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-6 text-center">
                {page.status === 'error' ? (
                    <span className="text-red-500">Failed to load</span>
                ) : (
                    <>
                        <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-400 rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-500 text-sm">Drawing page {idx + 1}...</p>
                        <p className="text-xs text-gray-400 mt-2 line-clamp-2 px-4">{page.description || "Waiting for inspiration..."}</p>
                    </>
                )}
              </div>
             )}
          </div>
        ))}
      </div>
      
      {!isComplete && hasContent && bookState.status !== 'error' && (
          <div className="text-center mt-12 text-brand-600 animate-pulse font-medium">
            Working on the rest of your book...
          </div>
      )}
    </div>
  );
};

export default Gallery;