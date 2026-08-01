export type RoomType = 'living_room' | 'bedroom' | 'dining' | 'office' | 'kitchen' | 'outdoor';

export interface Room {
  id: string;
  title: string;
  type: RoomType;
  imageUrl: string;
  aspectRatio: '16:9' | '4:3' | '1:1';
  description?: string;
  analysis?: {
    lighting: string;
    keyFurniture: string[];
    dominantColors: string[];
    layoutNotes: string;
  };
}

export interface ColorSwatch {
  hex: string;
  name: string;
}

export interface StylePreset {
  id: string;
  name: string;
  tagline: string;
  description: string;
  thumbnailUrl: string;
  keyElements: string[];
  colorPalette: ColorSwatch[];
  promptPrefix: string;
}

export interface DesignAnnotation {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  title: string;
  detail: string;
  category: string;
}

export interface ShoppableItem {
  id: string;
  name: string;
  category: 'seating' | 'lighting' | 'tables' | 'rugs' | 'decor' | 'plants' | 'storage' | 'wall';
  price: number;
  merchant: string;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  searchQuery: string;
  storeUrl: string;
  specifications: string;
  matchScore: number;
  isSaved?: boolean;
}

export interface ReimaginedDesign {
  id: string;
  styleId: string;
  styleName: string;
  imageUrl: string;
  createdAt: string;
  description: string;
  colorPalette: ColorSwatch[];
  annotations: DesignAnnotation[];
  shoppableItems: ShoppableItem[];
  designTips: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  designUpdate?: {
    imageUrl: string;
    styleName: string;
    colorPalette: ColorSwatch[];
    shoppableItems: ShoppableItem[];
  };
  shoppableItems?: ShoppableItem[];
  suggestedPrompts?: string[];
  isGenerating?: boolean;
}

export interface MoodboardState {
  savedItems: ShoppableItem[];
  savedDesigns: ReimaginedDesign[];
}
