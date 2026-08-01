import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Sparkles, ShoppingBag, ExternalLink, Bookmark, Check, RefreshCw, Wand2, Lightbulb } from 'lucide-react';
import { ChatMessage, ShoppableItem, ReimaginedDesign } from '../types';

interface RefinementChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isGenerating: boolean;
  onSaveItem: (item: ShoppableItem) => void;
  savedItemIds: string[];
  currentStyleName: string;
}

export const RefinementChat: React.FC<RefinementChatProps> = ({
  messages,
  onSendMessage,
  isGenerating,
  onSaveItem,
  savedItemIds,
  currentStyleName
}) => {
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const defaultSuggestedChips = [
    'Keep layout but make rug navy blue',
    'Add a tall fiddle leaf fig plant near window',
    'Change wall to soft sage green plaster',
    'Swap coffee table for round brass & marble',
    'Incorporate warm cove LED accent lighting'
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isGenerating) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleChipClick = (chipText: string) => {
    if (isGenerating) return;
    onSendMessage(chipText);
  };

  return (
    <div className="bg-stone-900/60 rounded-2xl border border-stone-800 p-5 sm:p-6 backdrop-blur-sm shadow-xl flex flex-col h-[650px]">
      
      {/* Header */}
      <div className="pb-4 border-b border-stone-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-serif font-medium text-stone-100 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-400" />
            4. Design Refinement Chat & Shoppable Links
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Ask AI to refine colors, swap furniture, or request shoppable recommendations for this space.
          </p>
        </div>
        <span className="px-2.5 py-1 bg-amber-500/10 text-amber-300 rounded-lg text-xs border border-amber-500/20 font-medium">
          Context: {currentStyleName}
        </span>
      </div>

      {/* Suggested Quick Refinement Chips */}
      <div className="py-3 border-b border-stone-800/60 flex items-center space-x-2 overflow-x-auto text-xs">
        <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1 shrink-0">
          <Lightbulb className="w-3.5 h-3.5" />
          Ideas:
        </span>
        {defaultSuggestedChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleChipClick(chip)}
            disabled={isGenerating}
            className="shrink-0 px-2.5 py-1 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700/80 transition-all active:scale-95 text-[11px]"
          >
            "{chip}"
          </button>
        ))}
      </div>

      {/* Scrollable Messages Thread */}
      <div className="flex-1 overflow-y-auto my-4 space-y-4 pr-2 scrollbar-thin scrollbar-thumb-stone-800 scrollbar-track-stone-950">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-fadeIn`}
            >
              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed shadow-lg ${
                  isUser
                    ? 'bg-amber-500 text-stone-950 font-medium rounded-tr-none'
                    : 'bg-stone-950/90 text-stone-200 border border-stone-800 rounded-tl-none'
                }`}
              >
                {!isUser && (
                  <div className="flex items-center space-x-1.5 mb-1.5 text-amber-400 font-semibold text-[11px]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Interior Consultant</span>
                  </div>
                )}

                <p className="whitespace-pre-wrap">{msg.text}</p>

                {/* Updated Design Image Thumbnail if message includes design change */}
                {msg.designUpdate && (
                  <div className="mt-3 pt-3 border-t border-stone-800">
                    <p className="text-[11px] font-semibold text-amber-300 mb-1.5 flex items-center gap-1">
                      <Wand2 className="w-3.5 h-3.5" />
                      Updated Room Makeover Preview:
                    </p>
                    <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-amber-500/30">
                      <img
                        src={msg.designUpdate.imageUrl}
                        alt="Updated Makeover"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Shoppable Items Grid attached to response */}
                {msg.shoppableItems && msg.shoppableItems.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-stone-800/80">
                    <p className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                      Shoppable Products For This Design:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {msg.shoppableItems.map((item) => {
                        const isSaved = savedItemIds.includes(item.id);
                        return (
                          <div
                            key={item.id}
                            className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 flex items-center space-x-3 hover:border-amber-500/40 transition-all"
                          >
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              referrerPolicy="no-referrer"
                              className="w-14 h-14 rounded-lg object-cover bg-stone-950 shrink-0 border border-stone-800"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-stone-100 text-[11px] truncate">
                                {item.name}
                              </p>
                              <div className="flex items-center space-x-2 text-[10px] text-stone-400 mt-0.5">
                                <span className="font-bold text-amber-300">${item.price}</span>
                                <span>•</span>
                                <span>{item.merchant}</span>
                              </div>
                              <div className="mt-1.5 flex items-center space-x-2">
                                <a
                                  href={item.storeUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[10px] text-amber-400 font-semibold hover:underline flex items-center gap-0.5"
                                >
                                  Shop Link <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                                <button
                                  onClick={() => onSaveItem(item)}
                                  className={`text-[10px] px-2 py-0.5 rounded font-medium transition-colors ${
                                    isSaved
                                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                      : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                                  }`}
                                >
                                  {isSaved ? 'Saved ✓' : 'Save Item'}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <span className="text-[10px] text-stone-500 mt-1 px-1">
                {msg.timestamp}
              </span>
            </div>
          );
        })}

        {/* Loading Indicator when AI is typing/generating */}
        {isGenerating && (
          <div className="flex items-center space-x-2 p-3 rounded-xl bg-stone-950/80 border border-amber-500/30 text-amber-300 text-xs w-fit animate-pulse">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>AI Consultant is refining design & finding shoppable items...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="pt-3 border-t border-stone-800 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder='Ask for refinements e.g. "Keep this layout but make the rug blue" or "Add shoppable lamps"...'
          className="flex-1 bg-stone-950 border border-stone-700 rounded-xl px-4 py-3 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 shadow-inner"
          disabled={isGenerating}
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isGenerating}
          className={`px-5 py-3 rounded-xl font-semibold text-xs transition-all flex items-center space-x-1.5 shadow-md ${
            !inputText.trim() || isGenerating
              ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
              : 'bg-amber-500 hover:bg-amber-400 text-stone-950 active:scale-95'
          }`}
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
