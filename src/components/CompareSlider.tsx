import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sliders, Maximize2, SplitSquareVertical, Eye, Download, Sparkles, MapPin, Tag, ShoppingBag, X } from 'lucide-react';
import { ReimaginedDesign, Room, DesignAnnotation, ShoppableItem } from '../types';

interface CompareSliderProps {
  originalRoom: Room;
  reimaginedDesign: ReimaginedDesign;
  onSelectItem: (item: ShoppableItem) => void;
  savedItemIds: string[];
}

export const CompareSlider: React.FC<CompareSliderProps> = ({
  originalRoom,
  reimaginedDesign,
  onSelectItem,
  savedItemIds
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side'>('slider');
  const [showAnnotations, setShowAnnotations] = useState<boolean>(true);
  const [activeAnnotation, setActiveAnnotation] = useState<DesignAnnotation | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      let percentage = (x / rect.width) * 100;
      if (percentage < 0) percentage = 0;
      if (percentage > 100) percentage = 100;
      setSliderPosition(percentage);
    },
    []
  );

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleMove(e.clientX);
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches[0]) {
        handleMove(e.touches[0].clientX);
      }
    };
    const handleUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('mouseup', handleUp);
      window.addEventListener('touchend', handleUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchend', handleUp);
    };
  }, [isDragging, handleMove]);

  // Download Before/After composite on canvas
  const handleDownloadComposite = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img1 = new Image();
    const img2 = new Image();
    img1.crossOrigin = 'anonymous';
    img2.crossOrigin = 'anonymous';

    img1.src = originalRoom.imageUrl;
    img2.src = reimaginedDesign.imageUrl;

    img1.onload = () => {
      canvas.width = img1.width * 2;
      canvas.height = img1.height;

      // Draw original
      ctx.drawImage(img1, 0, 0);

      // Draw reimagined
      img2.onload = () => {
        ctx.drawImage(img2, img1.width, 0);

        // Add text labels
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(20, 20, 180, 40);
        ctx.fillRect(img1.width + 20, 20, 260, 40);

        ctx.font = 'bold 20px sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('ORIGINAL ROOM', 35, 48);
        ctx.fillText(`AI: ${reimaginedDesign.styleName.toUpperCase()}`, img1.width + 35, 48);

        const a = document.createElement('a');
        a.download = `AuraMakeover-${reimaginedDesign.styleId}.png`;
        a.href = canvas.toDataURL('image/png');
        a.click();
      };
    };
  };

  return (
    <div className="bg-stone-900/60 rounded-2xl border border-stone-800 p-5 sm:p-6 backdrop-blur-sm shadow-xl">
      
      {/* Header controls bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-800 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-serif font-medium text-stone-100 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-amber-400" />
              3. Interactive Compare Slider
            </h2>
            <span className="px-2 py-0.5 text-[10px] bg-amber-500/10 text-amber-400 rounded border border-amber-500/20 font-medium">
              {reimaginedDesign.styleName}
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-0.5">
            Drag the handle to compare original space vs. AI reimagined makeover.
          </p>
        </div>

        {/* Action Toggle Buttons */}
        <div className="flex items-center space-x-2 flex-wrap">
          <button
            onClick={() => setViewMode(viewMode === 'slider' ? 'side-by-side' : 'slider')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              viewMode === 'side-by-side'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-stone-800 text-stone-300 hover:text-white border border-stone-700'
            }`}
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span>{viewMode === 'slider' ? 'Side-by-Side' : 'Slider Mode'}</span>
          </button>

          <button
            onClick={() => setShowAnnotations(!showAnnotations)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              showAnnotations
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-stone-800 text-stone-300 hover:text-white border border-stone-700'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Hotspots {showAnnotations ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={() => setIsFullscreen(true)}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 transition-colors"
            title="Expand Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleDownloadComposite}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 transition-colors"
            title="Download Before/After Composite"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Compare Visualization Stage */}
      <div className="mt-5">
        {viewMode === 'slider' ? (
          <div
            ref={containerRef}
            onClick={(e) => handleMove(e.clientX)}
            className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden select-none cursor-ew-resize bg-stone-950 shadow-2xl border border-stone-800"
          >
            {/* Base layer: AI Reimagined Image */}
            <img
              src={reimaginedDesign.imageUrl}
              alt="AI Reimagined Design"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Top clipped layer: Original Room Photo */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={originalRoom.imageUrl}
                alt="Original Room"
                referrerPolicy="no-referrer"
                className="absolute top-0 left-0 h-full max-w-none object-cover"
                style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}
              />
              {/* Badge label overlay */}
              <div className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-stone-700 text-[11px] font-semibold text-stone-200">
                Original Space
              </div>
            </div>

            {/* AI Reimagined Label on right */}
            <div className="absolute top-3 right-3 bg-amber-500/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-amber-400/40 text-[11px] font-bold text-stone-950 shadow-md">
              AI: {reimaginedDesign.styleName}
            </div>

            {/* Interactive Hotspot Pins on AI Design side */}
            {showAnnotations &&
              reimaginedDesign.annotations.map((ann) => {
                // Only show annotation pin if slider is past the hotspot position
                if (sliderPosition > ann.x) return null;
                const isSelected = activeAnnotation?.id === ann.id;
                return (
                  <div
                    key={ann.id}
                    style={{ left: `${ann.x}%`, top: `${ann.y}%` }}
                    className="absolute z-20 -translate-x-1/2 -translate-y-1/2 group"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveAnnotation(isSelected ? null : ann);
                    }}
                  >
                    <button className="relative w-7 h-7 rounded-full bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center shadow-lg ring-4 ring-amber-400/30 hover:scale-110 transition-transform">
                      <MapPin className="w-4 h-4 stroke-[2.5]" />
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-300 rounded-full animate-ping" />
                    </button>

                    {/* Popover tooltip */}
                    {(isSelected || activeAnnotation?.id === ann.id) && (
                      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-52 p-3 bg-stone-950/95 border border-amber-500/40 rounded-xl shadow-2xl z-30 text-left backdrop-blur-md animate-fadeIn">
                        <p className="text-xs font-bold text-amber-300">{ann.title}</p>
                        <p className="text-[11px] text-stone-300 mt-1 leading-snug">{ann.detail}</p>
                        <div className="mt-2 pt-2 border-t border-stone-800 flex justify-between items-center text-[10px] text-stone-400">
                          <span className="bg-stone-800 px-1.5 py-0.5 rounded">{ann.category}</span>
                          <span className="text-amber-400 cursor-pointer hover:underline font-semibold" onClick={() => {
                            const matched = reimaginedDesign.shoppableItems.find(i => i.name.toLowerCase().includes(ann.title.toLowerCase()) || ann.title.toLowerCase().includes(i.category.toLowerCase()));
                            if (matched) onSelectItem(matched);
                          }}>
                            View Furniture &rarr;
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

            {/* Slider Divider Line and Handle */}
            <div
              className="absolute top-0 bottom-0 z-20 w-1 bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)] cursor-ew-resize"
              style={{ left: `${sliderPosition}%` }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-amber-400 text-stone-950 font-bold flex items-center justify-center shadow-xl ring-4 ring-stone-900/80 active:scale-95 transition-transform">
                <Sliders className="w-4 h-4 rotate-90 stroke-[2.5]" />
              </div>
            </div>

            {/* Bottom Position percentage badge */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-stone-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-stone-700 text-[11px] text-stone-300 font-mono">
              {Math.round(sliderPosition)}% Original / {100 - Math.round(sliderPosition)}% AI
            </div>
          </div>
        ) : (
          /* Side by Side Mode */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-stone-800 shadow-xl">
              <img
                src={originalRoom.imageUrl}
                alt="Original Room"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-stone-700 text-[11px] font-semibold text-stone-200">
                Before: Original Space
              </div>
            </div>

            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-amber-500/30 shadow-xl">
              <img
                src={reimaginedDesign.imageUrl}
                alt="AI Reimagined"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-amber-500/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-amber-400/40 text-[11px] font-bold text-stone-950">
                After: {reimaginedDesign.styleName}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Description Summary */}
      <div className="mt-4 p-4 rounded-xl bg-stone-950/50 border border-stone-800/80">
        <p className="text-xs text-stone-300 leading-relaxed">
          <strong className="text-amber-400 font-serif font-semibold">Makeover Design Note: </strong>
          {reimaginedDesign.description}
        </p>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-stone-950/95 backdrop-blur-md p-4 flex flex-col justify-between">
          <div className="flex justify-between items-center text-stone-100">
            <h3 className="font-serif font-bold text-lg text-amber-400">
              {reimaginedDesign.styleName} - High Resolution Comparison
            </h3>
            <button
              onClick={() => setIsFullscreen(false)}
              className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 my-4 relative flex items-center justify-center">
            <img
              src={reimaginedDesign.imageUrl}
              alt="Fullscreen AI Design"
              referrerPolicy="no-referrer"
              className="max-h-full max-w-full object-contain rounded-xl border border-stone-800 shadow-2xl"
            />
          </div>

          <div className="text-center text-xs text-stone-400">
            Press ESC or click close to return to consultant controls.
          </div>
        </div>
      )}
    </div>
  );
};
