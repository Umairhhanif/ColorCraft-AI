import React, { useState } from 'react';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import ChatBot from './components/ChatBot';
import { BookState, ColoringPage } from './types';
import { generateBookPlan, generateColoringPageImage } from './services/gemini';

const App: React.FC = () => {
  const [bookState, setBookState] = useState<BookState>({
    theme: '',
    childName: '',
    status: 'idle',
    pages: [],
    cover: { id: 0, description: '', status: 'pending' }
  });

  const handleGenerate = async () => {
    if (!bookState.theme || !bookState.childName) return;

    // Reset state for new generation
    setBookState(prev => ({
      ...prev,
      status: 'planning',
      pages: [],
      cover: { id: 0, description: '', status: 'pending' },
      error: undefined
    }));

    try {
      // 1. Plan the book
      const plan = await generateBookPlan(bookState.theme, bookState.childName);
      
      const newPages: ColoringPage[] = plan.pageDescriptions.map((desc, i) => ({
        id: i + 1,
        description: desc,
        status: 'pending'
      }));

      const newCover: ColoringPage = {
        id: 0,
        description: plan.coverDescription,
        status: 'pending'
      };

      setBookState(prev => ({
        ...prev,
        status: 'generating',
        pages: newPages,
        cover: newCover
      }));

      // 2. Generate Images (Parallel Execution for Speed)
      
      // Generate Cover
      generateColoringPageImage(newCover.description, true)
        .then(url => {
            setBookState(prev => ({
                ...prev,
                cover: { ...prev.cover, imageUrl: url, status: 'complete' }
            }));
        })
        .catch(err => {
            console.error("Cover generation failed", err);
            setBookState(prev => ({
                ...prev,
                cover: { ...prev.cover, status: 'error' }
            }));
        });

      // Generate Pages
      newPages.forEach(page => {
          generateColoringPageImage(page.description, false)
            .then(url => {
                setBookState(prev => {
                    const updatedPages = prev.pages.map(p => 
                        p.id === page.id ? { ...p, imageUrl: url, status: 'complete' as const } : p
                    );
                    
                    // Check if all complete
                    const allComplete = updatedPages.every(p => p.status === 'complete' || p.status === 'error') && 
                                      (prev.cover.status === 'complete' || prev.cover.status === 'error');
                    
                    return {
                        ...prev,
                        pages: updatedPages,
                        status: allComplete ? 'ready' : prev.status
                    };
                });
            })
            .catch(err => {
                console.error(`Page ${page.id} failed`, err);
                setBookState(prev => ({
                    ...prev,
                    pages: prev.pages.map(p => p.id === page.id ? { ...p, status: 'error' } : p)
                }));
            });
      });

    } catch (error) {
      console.error("Generation Plan Failed", error);
      setBookState(prev => ({
        ...prev,
        status: 'error',
        error: "We couldn't plan the book. Please try a different theme."
      }));
    }
  };

  return (
    <div className="min-h-screen w-full relative">
      {/* Header */}
      <header className="w-full p-6 flex justify-center">
        <div className="flex items-center gap-2 text-brand-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          <span className="font-display font-bold text-2xl tracking-tight">ColorCraft AI</span>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-20">
        
        {/* Initial Hero Input */}
        <div className={`transition-all duration-700 ease-in-out ${bookState.status !== 'idle' ? 'scale-90 opacity-100 translate-y-0' : 'translate-y-12'}`}>
           <Hero 
             childName={bookState.childName}
             theme={bookState.theme}
             onNameChange={(val) => setBookState(prev => ({...prev, childName: val}))}
             onThemeChange={(val) => setBookState(prev => ({...prev, theme: val}))}
             onSubmit={handleGenerate}
             isGenerating={bookState.status === 'planning' || bookState.status === 'generating'}
           />
        </div>

        {/* Results Area */}
        {bookState.status !== 'idle' && (
             <Gallery bookState={bookState} />
        )}

        {bookState.error && (
          <div className="max-w-md mx-auto mt-8 p-4 bg-red-50 text-red-600 rounded-xl text-center border border-red-100">
            {bookState.error}
          </div>
        )}
      </main>

      <ChatBot />
    </div>
  );
};

export default App;