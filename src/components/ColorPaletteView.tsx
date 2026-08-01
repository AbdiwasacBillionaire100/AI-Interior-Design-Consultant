import React, { useState } from 'react';
import { Palette, Copy, Check, Info } from 'lucide-react';
import { ColorSwatch } from '../types';

interface ColorPaletteViewProps {
  palette: ColorSwatch[];
  styleName: string;
}

export const ColorPaletteView: React.FC<ColorPaletteViewProps> = ({ palette, styleName }) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <div className="bg-stone-900/60 rounded-2xl border border-stone-800 p-5 sm:p-6 backdrop-blur-sm shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-stone-800">
        <h3 className="text-md font-serif font-medium text-stone-100 flex items-center gap-2">
          <Palette className="w-4 h-4 text-amber-400" />
          Extracted Color Palette ({styleName})
        </h3>
        <span className="text-[11px] text-stone-400">Click swatch to copy HEX</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
        {palette.map((color, idx) => (
          <div
            key={idx}
            onClick={() => handleCopy(color.hex)}
            className="group p-2.5 rounded-xl bg-stone-950 border border-stone-800 hover:border-amber-500/50 cursor-pointer transition-all flex flex-col items-center text-center"
          >
            <div
              className="w-full h-12 rounded-lg border border-stone-800 shadow-md mb-2 relative group-hover:scale-105 transition-transform"
              style={{ backgroundColor: color.hex }}
            >
              {copiedHex === color.hex && (
                <div className="absolute inset-0 bg-stone-950/80 rounded-lg flex items-center justify-center text-amber-300 text-[10px] font-bold">
                  <Check className="w-4 h-4 mr-1" /> Copied!
                </div>
              )}
            </div>

            <p className="text-xs font-semibold text-stone-200 truncate w-full">
              {color.name}
            </p>
            <p className="text-[10px] text-stone-400 font-mono mt-0.5 uppercase flex items-center gap-1 group-hover:text-amber-400">
              {color.hex} <Copy className="w-2.5 h-2.5" />
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-[11px] text-stone-300 flex items-start gap-2">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p>
          <strong className="text-amber-300">Designer 60-30-10 Rule:</strong> Use the primary dominant shade for 60% of walls/rugs, secondary tone for 30% of furniture, and vibrant accent hex for 10% of pillows & artwork.
        </p>
      </div>
    </div>
  );
};
