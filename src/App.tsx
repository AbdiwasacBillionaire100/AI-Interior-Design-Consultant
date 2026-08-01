import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { RoomUploader } from './components/RoomUploader';
import { StyleCarousel } from './components/StyleCarousel';
import { CompareSlider } from './components/CompareSlider';
import { RefinementChat } from './components/RefinementChat';
import { ColorPaletteView } from './components/ColorPaletteView';
import { ShoppableDrawer } from './components/ShoppableDrawer';

import { Room, RoomType, StylePreset, ReimaginedDesign, ChatMessage, ShoppableItem } from './types';
import { SAMPLE_ROOMS, SAMPLE_PRESET_DESIGNS } from './data/sampleRooms';
import { STYLE_PRESETS } from './data/stylePresets';
import { Sparkles, Compass, Lightbulb, BookmarkCheck, ArrowRight, Palette, Layers } from 'lucide-react';

export default function App() {
  // 1. Initial State
  const [currentRoom, setCurrentRoom] = useState<Room>(SAMPLE_ROOMS[0]);
  const [selectedStyle, setSelectedStyle] = useState<StylePreset>(STYLE_PRESETS[0]);
  const [customPrompt, setCustomPrompt] = useState<string>('');

  // Active Reimagined Design (Defaults to pre-rendered sample design)
  const [activeDesign, setActiveDesign] = useState<ReimaginedDesign>(
    SAMPLE_PRESET_DESIGNS['living-room-basic']['mid-century-modern']
  );

  // Chat conversation thread
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: `Welcome to Aura Interior AI Consultant! I've reimagined your space in ${STYLE_PRESETS[0].name} style featuring a walnut-framed sofa, brass lighting, and curated warm textures.\n\nUse the Compare Slider above to inspect the before/after transition, or ask me to refine colors, swap furniture, or find shoppable items below!`,
      timestamp: 'Just now',
      shoppableItems: SAMPLE_PRESET_DESIGNS['living-room-basic']['mid-century-modern'].shoppableItems,
      suggestedPrompts: [
        'Keep layout but make the rug navy blue',
        'Add a tall fiddle leaf fig plant near window',
        'Change wall to soft sage green',
        'Swap coffee table for round marble top'
      ]
    }
  ]);

  // Saved shoppable items moodboard
  const [savedItems, setSavedItems] = useState<ShoppableItem[]>(
    SAMPLE_PRESET_DESIGNS['living-room-basic']['mid-century-modern'].shoppableItems.slice(0, 2)
  );

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // 2. Handle Custom Room Upload
  const handleCustomImageUpload = async (dataUrl: string, roomType: RoomType, title: string) => {
    const customRoom: Room = {
      id: `custom-room-${Date.now()}`,
      title: title || 'My Custom Space',
      type: roomType,
      aspectRatio: '16:9',
      imageUrl: dataUrl,
      description: 'Custom uploaded room photo ready for AI makeover.'
    };
    setCurrentRoom(customRoom);

    // Call room analysis backend
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/analyze-room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: dataUrl, roomType, title })
      });
      const data = await res.json();
      if (data.success && data.analysis) {
        customRoom.analysis = data.analysis;
        setCurrentRoom({ ...customRoom });
      }
    } catch (e) {
      console.warn('Room analysis error:', e);
    } finally {
      setIsAnalyzing(false);
    }

    // Automatically trigger AI makeover generation for the newly uploaded room
    handleGenerateDesign(customRoom, selectedStyle, customPrompt);
  };

  // 3. Select Sample Room
  const handleSelectSampleRoom = (room: Room) => {
    setCurrentRoom(room);
    // If precomputed design exists for this sample room & style, load instantly!
    const precomputed = SAMPLE_PRESET_DESIGNS[room.id]?.[selectedStyle.id];
    if (precomputed) {
      setActiveDesign(precomputed);
      setMessages([
        {
          id: `msg-${Date.now()}`,
          sender: 'ai',
          text: `Loaded ${room.title} in ${selectedStyle.name} aesthetic! You can adjust the comparison slider above or tell me what changes you'd like to refine.`,
          timestamp: 'Just now',
          shoppableItems: precomputed.shoppableItems
        }
      ]);
    } else {
      handleGenerateDesign(room, selectedStyle, customPrompt);
    }
  };

  // 4. Handle Style Selection
  const handleSelectStyle = (style: StylePreset) => {
    setSelectedStyle(style);
    // Check if pre-computed version exists
    const precomputed = SAMPLE_PRESET_DESIGNS[currentRoom.id]?.[style.id];
    if (precomputed && !customPrompt) {
      setActiveDesign(precomputed);
    }
  };

  // 5. Trigger AI Makeover Generation
  const handleGenerateDesign = async (
    roomToUse: Room = currentRoom,
    styleToUse: StylePreset = selectedStyle,
    customText: string = customPrompt
  ) => {
    setIsGenerating(true);

    try {
      const res = await fetch('/api/generate-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: roomToUse.imageUrl,
          styleId: styleToUse.id,
          styleName: customText ? 'Custom Vision' : styleToUse.name,
          promptPrefix: styleToUse.promptPrefix,
          customPrompt: customText
        })
      });

      const data = await res.json();

      if (data.success && data.design) {
        setActiveDesign(data.design);

        // Add AI message to chat thread
        const newAiMsg: ChatMessage = {
          id: `msg-gen-${Date.now()}`,
          sender: 'ai',
          text: `Here is your reimagined ${data.design.styleName} makeover!\n\n${data.design.description}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          shoppableItems: data.design.shoppableItems,
          suggestedPrompts: [
            'Keep layout but change sofa color to emerald green',
            'Add floating wooden wall shelves',
            'Incorporate warm LED cove lighting',
            'Make wall accent dark charcoal'
          ]
        };

        setMessages((prev) => [...prev, newAiMsg]);
      }
    } catch (error) {
      console.error('Failed to generate design:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // 6. Handle Chat Refinement Messages
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `user-msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsGenerating(true);

    try {
      const res = await fetch('/api/chat-refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageHistory: messages.map((m) => ({ sender: m.sender, text: m.text })),
          currentDesign: activeDesign,
          originalImage: currentRoom.imageUrl,
          userPrompt: text
        })
      });

      const data = await res.json();

      if (data.success) {
        // If an updated image URL was returned, update the active design state
        if (data.updatedImageUrl) {
          const updatedDesign: ReimaginedDesign = {
            ...activeDesign,
            id: `design-refine-${Date.now()}`,
            imageUrl: data.updatedImageUrl,
            description: `Refined design based on user feedback: "${text}"`,
            shoppableItems: data.shoppableItems?.length ? data.shoppableItems : activeDesign.shoppableItems
          };
          setActiveDesign(updatedDesign);
        }

        const aiReplyMsg: ChatMessage = {
          id: `ai-msg-${Date.now()}`,
          sender: 'ai',
          text: data.text || "I've applied your design refinement!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          designUpdate: data.updatedImageUrl
            ? {
                imageUrl: data.updatedImageUrl,
                styleName: activeDesign.styleName,
                colorPalette: activeDesign.colorPalette,
                shoppableItems: data.shoppableItems || []
              }
            : undefined,
          shoppableItems: data.shoppableItems || [],
          suggestedPrompts: data.suggestedPrompts || [
            'Change sofa fabric to boucle white',
            'Add an arch floor lamp in corner',
            'Show me warm oak coffee table alternatives'
          ]
        };

        setMessages((prev) => [...prev, aiReplyMsg]);
      }
    } catch (err) {
      console.error('Error sending refinement message:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // 7. Moodboard Save / Remove Handlers
  const handleSaveItem = (item: ShoppableItem) => {
    if (savedItems.some((i) => i.id === item.id)) {
      setSavedItems(savedItems.filter((i) => i.id !== item.id));
    } else {
      setSavedItems([...savedItems, item]);
    }
  };

  const handleRemoveSavedItem = (id: string) => {
    setSavedItems(savedItems.filter((i) => i.id !== id));
  };

  const totalBudget = savedItems.reduce((sum, i) => sum + i.price, 0);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-amber-500/30">
      
      {/* Header Bar */}
      <Navbar
        savedCount={savedItems.length}
        totalBudget={totalBudget}
        onOpenMoodboard={() => setIsDrawerOpen(true)}
        onReset={() => {
          setCurrentRoom(SAMPLE_ROOMS[0]);
          setSelectedStyle(STYLE_PRESETS[0]);
          setActiveDesign(SAMPLE_PRESET_DESIGNS['living-room-basic']['mid-century-modern']);
        }}
      />

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Step 1: Room Photo Selection / Upload */}
        <RoomUploader
          currentRoom={currentRoom}
          onSelectRoom={handleSelectSampleRoom}
          onCustomImageUpload={handleCustomImageUpload}
          isAnalyzing={isAnalyzing}
        />

        {/* Step 2: AI Style Carousel */}
        <StyleCarousel
          selectedStyle={selectedStyle}
          onSelectStyle={handleSelectStyle}
          customPrompt={customPrompt}
          onChangeCustomPrompt={setCustomPrompt}
          onGenerate={() => handleGenerateDesign()}
          isGenerating={isGenerating}
        />

        {/* Step 3: Compare Slider (Original vs Reimagined AI Design) */}
        {activeDesign && (
          <CompareSlider
            originalRoom={currentRoom}
            reimaginedDesign={activeDesign}
            onSelectItem={handleSaveItem}
            savedItemIds={savedItems.map((i) => i.id)}
          />
        )}

        {/* Step 4 & Color Palette Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Refinement Chat Column (7 cols) */}
          <div className="lg:col-span-7">
            <RefinementChat
              messages={messages}
              onSendMessage={handleSendMessage}
              isGenerating={isGenerating}
              onSaveItem={handleSaveItem}
              savedItemIds={savedItems.map((i) => i.id)}
              currentStyleName={activeDesign?.styleName || selectedStyle.name}
            />
          </div>

          {/* Color Palette & Designer Tips Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Color Palette Component */}
            {activeDesign && (
              <ColorPaletteView
                palette={activeDesign.colorPalette}
                styleName={activeDesign.styleName}
              />
            )}

            {/* Design Tips Card */}
            {activeDesign?.designTips && activeDesign.designTips.length > 0 && (
              <div className="bg-stone-900/60 rounded-2xl border border-stone-800 p-5 sm:p-6 backdrop-blur-sm shadow-xl space-y-3">
                <h3 className="text-md font-serif font-medium text-amber-300 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  Interior Designer Styling Recommendations
                </h3>
                <ul className="space-y-2 text-xs text-stone-300">
                  {activeDesign.designTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Shoppable Products Quick Summary Card */}
            <div className="bg-stone-900/60 rounded-2xl border border-stone-800 p-5 sm:p-6 backdrop-blur-sm shadow-xl space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-md font-serif font-medium text-stone-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Shoppable Room Furniture ({activeDesign.shoppableItems.length} items)
                </h3>
                <button
                  onClick={() => setIsDrawerOpen(true)}
                  className="text-xs text-amber-400 hover:underline font-semibold"
                >
                  View Saved ({savedItems.length})
                </button>
              </div>

              <div className="space-y-2">
                {activeDesign.shoppableItems.map((item) => {
                  const isSaved = savedItems.some((i) => i.id === item.id);
                  return (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between hover:border-stone-700 transition-all text-xs"
                    >
                      <div className="flex items-center space-x-3 min-w-0 pr-2">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-lg object-cover bg-stone-900 border border-stone-800 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-stone-100 truncate">{item.name}</p>
                          <p className="text-[11px] text-amber-300 font-bold">
                            ${item.price} <span className="text-stone-400 font-normal">({item.merchant})</span>
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSaveItem(item)}
                        className={`shrink-0 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                          isSaved
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                        }`}
                      >
                        {isSaved ? 'Saved ✓' : '+ Save'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Shoppable Drawer Modal */}
      <ShoppableDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        savedItems={savedItems}
        onRemoveItem={handleRemoveSavedItem}
        onClearAll={() => setSavedItems([])}
      />

      {/* Footer */}
      <footer className="mt-16 border-t border-stone-800/80 py-8 text-center text-xs text-stone-500">
        <p>Aura Interior AI Design Consultant • Powered by Google Gemini AI</p>
      </footer>

    </div>
  );
}
