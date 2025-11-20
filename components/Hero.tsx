import React from 'react';

interface HeroProps {
  childName: string;
  theme: string;
  onNameChange: (val: string) => void;
  onThemeChange: (val: string) => void;
  onSubmit: () => void;
  isGenerating: boolean;
}

const Hero: React.FC<HeroProps> = ({ childName, theme, onNameChange, onThemeChange, onSubmit, isGenerating }) => {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden p-8 md:p-12 border border-blue-100">
      <div className="text-center mb-8">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-900 mb-4">
          Make Magic Happen ✨
        </h1>
        <p className="text-lg text-brand-600/80">
          Create a custom coloring book for your little artist in seconds.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
            Child's Name
          </label>
          <input
            type="text"
            value={childName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="e.g. Leo"
            className="w-full px-5 py-4 rounded-2xl bg-brand-50 border-2 border-transparent focus:border-brand-500 focus:bg-white outline-none transition-all text-lg font-bold text-brand-900 placeholder-brand-200"
            disabled={isGenerating}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
            Coloring Theme
          </label>
          <input
            type="text"
            value={theme}
            onChange={(e) => onThemeChange(e.target.value)}
            placeholder="e.g. Space Dinosaurs eating Pizza"
            className="w-full px-5 py-4 rounded-2xl bg-brand-50 border-2 border-transparent focus:border-brand-500 focus:bg-white outline-none transition-all text-lg font-bold text-brand-900 placeholder-brand-200"
            disabled={isGenerating}
          />
        </div>

        <button
          onClick={onSubmit}
          disabled={!childName || !theme || isGenerating}
          className={`w-full py-5 rounded-2xl font-display font-bold text-xl tracking-wide transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg
            ${!childName || !theme || isGenerating
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-brand-500 to-indigo-500 text-white hover:shadow-brand-500/30'
            }
          `}
        >
          {isGenerating ? (
            <span className="flex items-center justify-center gap-3">
              <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Dreaming up designs...
            </span>
          ) : (
            "Generate Coloring Book"
          )}
        </button>
      </div>
    </div>
  );
};

export default Hero;