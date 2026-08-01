import React, { useState } from 'react';
import { Sparkles, Palette, Wand2, ArrowRight, Layers, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { StylePreset } from '../types';
import { STYLE_PRESETS } from '../data/stylePresets';

interface StyleCarouselProps {
  selectedStyle: StylePreset | null;
  onSelectStyle: (style: StylePreset) => void;
  customPrompt: string;
  onChangeCustomPrompt: (prompt: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const StyleCarousel: React.FC<StyleCarouselProps> = ({
  selectedStyle,
  onSelectStyle,
  customPrompt,
  onChangeCustomPrompt,
  onGenerate,
  isGenerating
}) => {
  const [showCustomInput, setShowCustomInput] = useState(false);

  return (
    <div className="bg-stone-900/60 rounded-2xl border border-stone-800 p-5 sm:p-6 backdrop-blur-sm shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-800 gap-3">
        <div>
          <h2 className="text-lg font-serif font-medium text-stone-100 flex items-center gap-2">
            <Palette className="w-5 h-5 text-amber-400" />
            2. Choose Your Reimagined Style
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Select an AI interior aesthetic or describe a custom room vision.
          </p>
        </div>

        <button
          onClick={() => setShowCustomInput(!showCustomInput)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
            showCustomInput
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'bg-stone-800 text-stone-300 hover:text-white border border-stone-700'
          }`}
        >
          <Wand2 className="w-3.5 h-3.5 text-amber-400" />
          <span>{showCustomInput ? 'Hide Custom Prompt' : 'Custom Style Prompt'}</span>
        </button>
      </div>

      {/* Custom Prompt Input Box */}
      {showCustomInput && (
        <div className="mt-4 p-4 rounded-xl bg-stone-950/80 border border-amber-500/30 transition-all animate-fadeIn">
          <label className="block text-xs font-semibold text-amber-300 mb-1.5">
            Describe your custom dream style:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => onChangeCustomPrompt(e.target.value)}
              placeholder="e.g. Warm Tuscan Villa with terracotta tiles and arches, or Parisian Haussmann apartment with gilded mirrors..."
              className="flex-1 bg-stone-900 border border-stone-700 rounded-lg px-3.5 py-2 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400"
            />
            {customPrompt && (
              <button
                onClick={() => onChangeCustomPrompt('')}
                className="px-2.5 py-1 text-xs text-stone-400 hover:text-stone-200"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {/* Horizontal Carousel Cards */}
      <div className="mt-5 relative">
        <div className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-stone-700 scrollbar-track-stone-900">
          {STYLE_PRESETS.map((style) => {
            const isSelected = selectedStyle?.id === style.id && !customPrompt;
            return (
              <div
                key={style.id}
                onClick={() => {
                  onSelectStyle(style);
                  onChangeCustomPrompt('');
                }}
                className={`snap-start flex-shrink-0 w-60 sm:w-64 rounded-xl overflow-hidden border text-left cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-amber-400 bg-stone-800/90 ring-2 ring-amber-400/30 shadow-lg scale-[1.02]'
                    : 'border-stone-800 bg-stone-950/60 hover:border-stone-700 hover:bg-stone-800/40 opacity-85 hover:opacity-100'
                }`}
              >
                <div className="aspect-[16/10] relative w-full overflow-hidden bg-stone-900">
                  <img
                    src={style.thumbnailUrl}
                    alt={style.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent" />
                  <span className="absolute bottom-2 left-2.5 right-2.5 font-serif font-semibold text-sm text-stone-100 drop-shadow">
                    {style.name}
                  </span>
                </div>

                <div className="p-3 space-y-2">
                  <p className="text-[11px] text-stone-300 line-clamp-2 leading-relaxed">
                    {style.tagline}
                  </p>

                  {/* Color Swatches preview */}
                  <div className="flex items-center space-x-1 pt-1">
                    {style.colorPalette.map((color, idx) => (
                      <span
                        key={idx}
                        className="w-3.5 h-3.5 rounded-full border border-stone-900 shadow-sm"
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Style Detail Summary & CTA */}
      <div className="mt-5 p-4 rounded-xl bg-stone-950/70 border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
              Selected:
            </span>
            <span className="text-sm font-serif font-bold text-stone-100">
              {customPrompt ? 'Custom Style Vision' : selectedStyle?.name || 'Mid-Century Modern'}
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-1 max-w-2xl leading-relaxed">
            {customPrompt
              ? `Generating custom transformation: "${customPrompt}"`
              : selectedStyle?.description}
          </p>
        </div>

        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className={`px-6 py-3 rounded-xl font-semibold text-xs tracking-wide uppercase transition-all flex items-center justify-center space-x-2 shadow-lg shadow-amber-950/40 ${
            isGenerating
              ? 'bg-amber-600/50 text-amber-200 cursor-not-allowed'
              : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 active:scale-95'
          }`}
        >
          {isGenerating ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Generating AI Makeover...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              <span>Reimagine Space Now</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
