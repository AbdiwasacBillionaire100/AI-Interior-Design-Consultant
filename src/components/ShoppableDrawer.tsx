import React, { useState } from 'react';
import { ShoppingBag, X, Trash2, ExternalLink, Download, Copy, Check, DollarSign, Tag } from 'lucide-react';
import { ShoppableItem } from '../types';

interface ShoppableDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedItems: ShoppableItem[];
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
}

export const ShoppableDrawer: React.FC<ShoppableDrawerProps> = ({
  isOpen,
  onClose,
  savedItems,
  onRemoveItem,
  onClearAll
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedText, setCopiedText] = useState<boolean>(false);

  if (!isOpen) return null;

  const totalBudget = savedItems.reduce((sum, item) => sum + item.price, 0);

  const categories = ['all', 'seating', 'lighting', 'tables', 'rugs', 'decor', 'plants'];

  const filteredItems = selectedCategory === 'all'
    ? savedItems
    : savedItems.filter(item => item.category === selectedCategory);

  const handleCopyList = () => {
    const listText = savedItems.map(item => `- ${item.name} ($${item.price}) [${item.merchant}]: ${item.storeUrl}`).join('\n');
    const summary = `AURA INTERIOR MAKEOVER SHOPPING LIST\nTotal Estimated Budget: $${totalBudget.toLocaleString()}\n\n${listText}`;
    navigator.clipboard.writeText(summary);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex justify-end animate-fadeIn">
      <div className="w-full max-w-md bg-stone-900 border-l border-stone-800 h-full flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-semibold text-stone-100 text-base">
                Saved Furniture & Decor
              </h3>
              <p className="text-xs text-stone-400">
                {savedItems.length} items in your room moodboard
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Budget Summary Banner */}
        <div className="p-4 bg-gradient-to-r from-amber-950/60 via-stone-900 to-amber-950/60 border-b border-stone-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-amber-400 uppercase tracking-wider font-semibold">
              Total Estimated Investment
            </span>
            <p className="text-2xl font-serif font-bold text-amber-300">
              ${totalBudget.toLocaleString()}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCopyList}
              disabled={savedItems.length === 0}
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium border border-stone-700 flex items-center gap-1 transition-colors"
              title="Copy list to clipboard"
            >
              {copiedText ? <Check className="w-3.5 h-3.5 text-amber-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedText ? 'Copied' : 'Copy List'}</span>
            </button>
          </div>
        </div>

        {/* Category Filters */}
        {savedItems.length > 0 && (
          <div className="p-3 border-b border-stone-800/80 flex gap-1.5 overflow-x-auto text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md capitalize whitespace-nowrap transition-all text-[11px] ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-stone-950 font-bold'
                    : 'bg-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Saved Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-stone-800">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-stone-500 text-xs">
              <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-stone-600" />
              <p className="font-medium text-stone-400">No saved items yet.</p>
              <p className="mt-1">Click "Save Item" on any shoppable recommendation in chat to add here.</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-center space-x-3 hover:border-stone-700 transition-all"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-lg object-cover bg-stone-900 border border-stone-800 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-stone-100 truncate">
                    {item.name}
                  </p>
                  <p className="text-[11px] text-amber-300 font-bold mt-0.5">
                    ${item.price} <span className="text-stone-400 font-normal">({item.merchant})</span>
                  </p>
                  <p className="text-[10px] text-stone-500 truncate mt-0.5">
                    {item.specifications}
                  </p>

                  <div className="mt-2 flex items-center justify-between">
                    <a
                      href={item.storeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      Shop Merchant <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-stone-500 hover:text-rose-400 p-1"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {savedItems.length > 0 && (
          <div className="p-4 border-t border-stone-800 flex items-center justify-between">
            <button
              onClick={onClearAll}
              className="text-xs text-rose-400 hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-lg"
            >
              Close Drawer
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
