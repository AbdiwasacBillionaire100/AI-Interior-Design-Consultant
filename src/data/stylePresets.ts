import { StylePreset } from '../types';

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: 'mid-century-modern',
    name: 'Mid-Century Modern',
    tagline: 'Organic curves, warm walnut, and iconic 50s retro elegance',
    description: 'Clean lines, gentle organic curves, rich wood tones like walnut, and functional mid-century furniture paired with mustard yellow and teal accents.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=800&auto=format&fit=crop',
    keyElements: ['Tapered walnut legs', 'Low-profile seating', 'Geometric accent rugs', 'Brass arc lamps'],
    colorPalette: [
      { hex: '#7A3E26', name: 'Walnut Wood' },
      { hex: '#D97706', name: 'Mustard Gold' },
      { hex: '#0F766E', name: 'Deep Teal' },
      { hex: '#F3F4F6', name: 'Warm Cream' },
      { hex: '#1F2937', name: 'Charcoal Accent' }
    ],
    promptPrefix: 'Reimagine this room in Mid-Century Modern style with sleek walnut furniture, tapered legs, mustard yellow and deep teal cushions, brass floor lamp, geometric woven rug, and warm ambient light.'
  },
  {
    id: 'scandinavian',
    name: 'Scandinavian',
    tagline: 'Luminous light wood, cozy hygge textures, and airy minimalism',
    description: 'Airy, functional, and deeply inviting. Features light blonde birch wood, crisp whites, soft grey textiles, sheepskin throws, and lush indoor greenery.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=800&auto=format&fit=crop',
    keyElements: ['Light birch & oak wood', 'Neutral linen upholstery', 'Minimalist pendant lights', 'Monstera plants'],
    colorPalette: [
      { hex: '#F9FAFB', name: 'Alpine White' },
      { hex: '#E5E7EB', name: 'Soft Pebble' },
      { hex: '#D1D5DB', name: 'Muted Slate' },
      { hex: '#D97706', name: 'Blonde Oak' },
      { hex: '#111827', name: 'Matte Black Line' }
    ],
    promptPrefix: 'Reimagine this space in Scandinavian interior style with light oak wood finishes, cozy light grey linen sofa, neutral wool rug, minimalist paper pendant light, indoor potted monstera plant, and sunlit natural atmosphere.'
  },
  {
    id: 'japandi',
    name: 'Japandi Serenity',
    tagline: 'Wabi-sabi simplicity meets Nordic functional warmth',
    description: 'The harmonious union of Japanese wabi-sabi aesthetic and Scandinavian hygge. Earthy matte ceramics, low slung furniture, bamboo, and tactile linen.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop',
    keyElements: ['Low platform furniture', 'Textured clay plaster walls', 'Woven rattan accents', 'Shoji minimalist lines'],
    colorPalette: [
      { hex: '#D2C2A0', name: 'Oatmeal Linen' },
      { hex: '#8C7A6B', name: 'Muted Clay' },
      { hex: '#374151', name: 'Ebonized Oak' },
      { hex: '#A1A1AA', name: 'Stone Grey' },
      { hex: '#52525B', name: 'Charcoal Ink' }
    ],
    promptPrefix: 'Reimagine this room in Japandi style combining Japanese minimalism with Scandinavian hygge. Low platform furniture, oatmeal textured linen, dark ebonized oak wood accents, hand-crafted ceramic vases, textured plaster wall, and tranquil zen lighting.'
  },
  {
    id: 'industrial-loft',
    name: 'Industrial Chic',
    tagline: 'Exposed brick, aged leather, black steel, and urban factory vibe',
    description: 'Raw materials meets modern urban comfort. Exposed brickwork, distressed cognac leather sofas, matte black iron shelving, and Edison bulb chandeliers.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1505691938895-1758d7FEB511?q=80&w=800&auto=format&fit=crop',
    keyElements: ['Exposed red brick wall', 'Cognac leather sofa', 'Black steel frame shelving', 'Reclaimed timber table'],
    colorPalette: [
      { hex: '#9A3412', name: 'Aged Red Brick' },
      { hex: '#B45309', name: 'Cognac Leather' },
      { hex: '#18181B', name: 'Matte Steel' },
      { hex: '#52525B', name: 'Raw Concrete' },
      { hex: '#F59E0B', name: 'Amber Glow' }
    ],
    promptPrefix: 'Reimagine this room in Industrial Loft style with exposed warm red brick walls, rich cognac leather Chesterfield sofa, matte black steel frame coffee table, vintage Edison bulb floor lamp, and reclaimed timber accents.'
  },
  {
    id: 'boho-organic',
    name: 'Boho Organic',
    tagline: 'Lush greenery, rattan textures, and warm terracotta tones',
    description: 'Relaxed, bohemian charm filled with natural textures. Macrame wall hangings, jute area rugs, terracottas, rattan armchairs, and cascading indoor ivy.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop',
    keyElements: ['Woven rattan armchair', 'Layered jute & vintage rugs', 'Terracotta pottery', 'Hanging macrame planter'],
    colorPalette: [
      { hex: '#C2410C', name: 'Terracotta Clay' },
      { hex: '#CA8A04', name: 'Warm Mustard' },
      { hex: '#15803D', name: 'Lush Sage' },
      { hex: '#FEF3C7', name: 'Cream Cotton' },
      { hex: '#78350F', name: 'Cinnamon Wood' }
    ],
    promptPrefix: 'Reimagine this space in Organic Bohemian style with natural rattan chairs, layered jute and Moroccan fringe rugs, terracotta plant pots, macrame wall hangings, sage green cushions, and overflowing tropical plants.'
  },
  {
    id: 'modern-coastal',
    name: 'Modern Coastal',
    tagline: 'Breeze-blown linens, whitewashed woods, and soft ocean blues',
    description: 'Refined seaside living without novelty cliches. Crisp slipcovered white sofas, light bleached oak, woven wicker baskets, and subtle ocean blue accents.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop',
    keyElements: ['Slipcovered white sofa', 'Bleached driftwood table', 'Blue indigo linen pillows', 'Beaded seagrass light'],
    colorPalette: [
      { hex: '#0284C7', name: 'Coastal Indigo' },
      { hex: '#38BDF8', name: 'Sky Blue' },
      { hex: '#F8FAFC', name: 'Whitewash Shiplap' },
      { hex: '#E2E8F0', name: 'Sandstone' },
      { hex: '#1E293B', name: 'Navy Detail' }
    ],
    promptPrefix: 'Reimagine this room in Modern Coastal style with comfortable white linen slipcovered sofa, bleached driftwood coffee table, ocean blue accent cushions, sea salt white walls, seagrass basket planters, and bright airy natural sunlight.'
  },
  {
    id: 'moody-dark-velvet',
    name: 'Moody Dark Velvet',
    tagline: 'Deep charcoal walls, plush jewel-toned velvet, and brass glamour',
    description: 'Dramatic, sophisticated, and cocooning. Deep charcoal or navy walls, emerald green or sapphire blue velvet seating, polished brass hardware, and dim moody glow.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800&auto=format&fit=crop',
    keyElements: ['Emerald velvet sofa', 'Charcoal matte walls', 'Brushed gold chandeliers', 'Smoked glass table'],
    colorPalette: [
      { hex: '#064E3B', name: 'Emerald Velvet' },
      { hex: '#1E1B4B', name: 'Midnight Navy' },
      { hex: '#B45309', name: 'Brushed Brass' },
      { hex: '#111827', name: 'Charcoal Black' },
      { hex: '#881337', name: 'Burgundy Accent' }
    ],
    promptPrefix: 'Reimagine this space in Moody Dark Velvet aesthetic with dark matte charcoal walls, rich emerald green velvet sectional sofa, warm brushed brass sconces, ambient dim atmospheric light, marble coffee table, and dark hardwood floor.'
  },
  {
    id: 'art-deco',
    name: 'Art Deco Glam',
    tagline: 'Geometric symmetry, polished marble, velvet, and bold golden accents',
    description: 'Roaring twenties opulence reimagined. Fluted wood panels, sunburst mirrors, velvet channel-tufted armchairs, and gleaming gold geometry.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800&auto=format&fit=crop',
    keyElements: ['Fluted wall panels', 'Channel-tufted armchair', 'Polished brass inlays', 'Calacatta marble coffee table'],
    colorPalette: [
      { hex: '#D97706', name: 'Polished Brass' },
      { hex: '#0284C7', name: 'Royal Sapphire' },
      { hex: '#18181B', name: 'Onyx Black' },
      { hex: '#F8FAFC', name: 'Carrara Marble' },
      { hex: '#701A75', name: 'Plum Velvet' }
    ],
    promptPrefix: 'Reimagine this room in luxurious Art Deco style with fluted wooden accent wall, channel-tufted royal sapphire blue velvet chairs, polished brass geometric decor, marble coffee table, and high-contrast elegant lighting.'
  }
];
