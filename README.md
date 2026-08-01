# Aura Interior — AI Interior Design Consultant & Room Makeover

Aura Interior is an interactive, full-stack room makeover application powered by Google Gemini AI. Users can upload a photo of their current living space, select or describe an interior design style, compare before-and-after transformations using an interactive slider, and refine the design with a context-aware AI interior consultant chat while receiving shoppable product recommendations.

---

## Key Features

- **Room Photo Upload & Spatial Analysis**: Upload custom room photos (or choose from curated sample spaces) with AI spatial evaluation of lighting, furniture, and color palette.
- **Interactive Style Carousel**: Reimagine rooms across multiple aesthetic presets including *Mid-Century Modern*, *Scandinavian*, *Japandi*, *Industrial Loft*, *Boho Organic*, *Modern Coastal*, *Moody Dark Velvet*, and *Art Deco*, or enter custom style prompts.
- **Interactive Before/After Compare Slider**: Drag between the original space photo and the AI-generated makeover in real-time, featuring interactive product hotspots.
- **Context-Aware Refinement Chat**: Engage with a multi-turn AI Interior Designer to refine colors, swap furniture, adjust layouts (e.g. *"Keep this layout but make the rug navy blue"*), and generate updated visual previews.
- **Shoppable Links & Saved Moodboard**: Context-aware recommendations for real furniture and decor items complete with prices, merchant links, specifications, and estimated budget tracking.
- **Color Palette Extraction**: Automatically extract complementary hex swatches and designer 60-30-10 color allocation rules for each transformation.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React icons, Motion animations.
- **Backend**: Express.js server bundled with `esbuild`.
- **AI Integration**: Google Gen AI SDK (`@google/genai`) using Gemini models for vision analysis, style generation, and conversational interior design.
- **Build System**: Vite, `tsx`, `esbuild`.

---

## Getting Started

### Prerequisites

- Node.js 18+
- `GEMINI_API_KEY` set in your environment or `.env` file.

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```env
GEMINI_API_KEY="your_gemini_api_key_here"
```

3. Run the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
npm start
```
