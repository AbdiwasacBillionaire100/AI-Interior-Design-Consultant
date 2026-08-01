import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Sparkles, Check, Info, Layers, Compass } from 'lucide-react';
import { Room, RoomType } from '../types';
import { SAMPLE_ROOMS } from '../data/sampleRooms';

interface RoomUploaderProps {
  currentRoom: Room;
  onSelectRoom: (room: Room) => void;
  onCustomImageUpload: (dataUrl: string, roomType: RoomType, title: string) => void;
  isAnalyzing: boolean;
}

export const RoomUploader: React.FC<RoomUploaderProps> = ({
  currentRoom,
  onSelectRoom,
  onCustomImageUpload,
  isAnalyzing
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType>(currentRoom.type || 'living_room');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPG, PNG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      onCustomImageUpload(dataUrl, selectedRoomType, file.name.replace(/\.[^/.]+$/, ''));
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="bg-stone-900/60 rounded-2xl border border-stone-800 p-5 sm:p-6 backdrop-blur-sm shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-stone-800 gap-4">
        <div>
          <h2 className="text-lg font-serif font-medium text-stone-100 flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-400" />
            1. Select or Upload Your Room Photo
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Upload your actual space photo or choose a sample room below to start the makeover.
          </p>
        </div>

        {/* Room Type Selector */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0">
          {(['living_room', 'bedroom', 'office', 'dining'] as RoomType[]).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedRoomType(type)}
              className={`px-3 py-1.2 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition-all ${
                selectedRoomType === type
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold'
                  : 'bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              {type.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5">
        
        {/* Upload Dropzone */}
        <div className="lg:col-span-5 flex flex-col">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex-1 min-h-[160px] border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
                : 'border-stone-700 hover:border-amber-500/50 bg-stone-950/40 hover:bg-stone-800/40'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-stone-800/80 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-stone-200">
              Drag & drop your room photo here
            </p>
            <p className="text-xs text-stone-400 mt-1">
              or <span className="text-amber-400 underline font-medium">browse files</span> (JPG, PNG, WEBP)
            </p>
          </div>
        </div>

        {/* Sample Room Selector Cards */}
        <div className="lg:col-span-7">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-stone-400" />
            Or Try A Curated Sample Room:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SAMPLE_ROOMS.map((room) => {
              const isSelected = currentRoom.id === room.id;
              return (
                <button
                  key={room.id}
                  onClick={() => onSelectRoom(room)}
                  className={`group relative rounded-xl overflow-hidden border text-left transition-all ${
                    isSelected
                      ? 'border-amber-400 ring-2 ring-amber-400/20 scale-[1.02]'
                      : 'border-stone-800 hover:border-stone-700 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-stone-950">
                    <img
                      src={room.imageUrl}
                      alt={room.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-2 bg-stone-900/90">
                    <p className="text-xs font-medium text-stone-200 truncate">
                      {room.title}
                    </p>
                    <p className="text-[10px] text-stone-400 capitalize truncate">
                      {room.type.replace('_', ' ')}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-stone-950 shadow-md">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Active Room Metadata & AI Spatial Analysis Pill */}
      {currentRoom && (
        <div className="mt-5 pt-4 border-t border-stone-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-300">
          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-800 text-stone-200 font-medium border border-stone-700">
              <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
              Active: {currentRoom.title}
            </span>
            <span className="text-stone-400 hidden sm:inline">
              {currentRoom.description || 'Ready for makeover transformation.'}
            </span>
          </div>

          {currentRoom.analysis && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] text-amber-400/90 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Detected: {currentRoom.analysis.keyFurniture.slice(0, 2).join(', ')}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
