import { Room, ReimaginedDesign } from '../types';

export const SAMPLE_ROOMS: Room[] = [
  {
    id: 'living-room-basic',
    title: 'Outdated Living Room',
    type: 'living_room',
    aspectRatio: '16:9',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop',
    description: 'A traditional beige living room with plain walls, dated couch, standard ceiling fixture, and cluttered coffee table.',
    analysis: {
      lighting: 'Bright direct ceiling light with single side window natural wash',
      keyFurniture: ['3-seater beige fabric sofa', 'Rectangular dark wood coffee table', 'Floor lamp', 'Neutral area rug'],
      dominantColors: ['#E5E0D8', '#8C7A6B', '#4A3B32', '#FAF8F5'],
      layoutNotes: 'Balanced rectangular layout with sofa against main wall facing TV/fireplace area.'
    }
  },
  {
    id: 'bedroom-plain',
    title: 'Plain Master Bedroom',
    type: 'bedroom',
    aspectRatio: '16:9',
    imageUrl: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1200&auto=format&fit=crop',
    description: 'A modest bedroom with basic wooden bed frame, plain white walls, minimal decor, and standard nightstands.',
    analysis: {
      lighting: 'Soft morning window sunlight from right side',
      keyFurniture: ['Queen wooden bed frame', 'Twin simple nightstands', 'White bedding duvet', 'Standard table lamps'],
      dominantColors: ['#FFFFFF', '#C5A880', '#534B42', '#E8E3DD'],
      layoutNotes: 'Centered bed placement with symmetrical nightstands along headboard wall.'
    }
  },
  {
    id: 'office-cluttered',
    title: 'Compact Home Office',
    type: 'office',
    aspectRatio: '16:9',
    imageUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop',
    description: 'A small workspace with standard desk, ergonomic black chair, plain drywall, and basic book storage.',
    analysis: {
      lighting: 'Desk lamp spotlighting and ambient overhead lighting',
      keyFurniture: ['Light wood writing desk', 'Black mesh office chair', 'Floating wall shelves', 'Monitor stand'],
      dominantColors: ['#333333', '#D4A373', '#F4F1DE', '#6C757D'],
      layoutNotes: 'Corner desk setup optimizing tight floor space.'
    }
  },
  {
    id: 'dining-bare',
    title: 'Simple Dining Area',
    type: 'dining',
    aspectRatio: '16:9',
    imageUrl: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=1200&auto=format&fit=crop',
    description: 'A dining nook with plain wooden table, mismatched chairs, and bare wall background.',
    analysis: {
      lighting: 'Diffuse natural window light',
      keyFurniture: ['4-person oak dining table', 'Simple wooden dining chairs', 'Small sideboard cabinet'],
      dominantColors: ['#A08C74', '#F7F5F0', '#3E362E', '#D1C7BD'],
      layoutNotes: 'Open dining corner adjacent to living area.'
    }
  }
];

// Pre-computed AI transformations for sample rooms so app responds instantly when selecting styles
export const SAMPLE_PRESET_DESIGNS: Record<string, Record<string, ReimaginedDesign>> = {
  'living-room-basic': {
    'mid-century-modern': {
      id: 'design-lrb-mcm',
      styleId: 'mid-century-modern',
      styleName: 'Mid-Century Modern',
      imageUrl: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=1200&auto=format&fit=crop',
      createdAt: 'Just now',
      description: 'Reimagined with an iconic walnut-framed sofa, mustard throw pillows, a retro brass arc lamp, and a bold geometric rug that warms up the entire living space.',
      colorPalette: [
        { hex: '#7A3E26', name: 'Walnut Wood' },
        { hex: '#D97706', name: 'Mustard Gold' },
        { hex: '#0F766E', name: 'Deep Teal' },
        { hex: '#F3F4F6', name: 'Warm Cream' },
        { hex: '#1F2937', name: 'Charcoal' }
      ],
      annotations: [
        {
          id: 'ann-1',
          x: 48,
          y: 62,
          title: 'Walnut Tapered Sofa',
          detail: 'Low-profile tailored seating with button-tufted backrest and solid walnut legs.',
          category: 'Seating'
        },
        {
          id: 'ann-2',
          x: 22,
          y: 40,
          title: 'Brass Arc Floor Lamp',
          detail: 'Overhanging brushed brass lamp that casts warm warm lighting across seating area.',
          category: 'Lighting'
        },
        {
          id: 'ann-3',
          x: 52,
          y: 82,
          title: 'Geometric Wool Area Rug',
          detail: 'Hand-tufted 100% wool rug featuring bold mid-century yellow & teal triangles.',
          category: 'Rugs'
        }
      ],
      shoppableItems: [
        {
          id: 'shop-mcm-sofa',
          name: 'Mid-Century Tufted Velvet Sofa in Ochre',
          category: 'seating',
          price: 899,
          merchant: 'Article Design',
          rating: 4.8,
          reviewsCount: 342,
          imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=400&auto=format&fit=crop',
          searchQuery: 'Mid-Century Tufted Velvet Sofa Ochre',
          storeUrl: 'https://www.google.com/search?q=Mid-Century+Tufted+Velvet+Sofa+Ochre&tbm=shop',
          specifications: 'W: 84" x D: 35" x H: 32", Solid Walnut Frame',
          matchScore: 98
        },
        {
          id: 'shop-mcm-lamp',
          name: 'Brushed Brass Overarching Floor Lamp',
          category: 'lighting',
          price: 185,
          merchant: 'West Elm',
          rating: 4.7,
          reviewsCount: 189,
          imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=400&auto=format&fit=crop',
          searchQuery: 'Brushed Brass Arc Floor Lamp',
          storeUrl: 'https://www.google.com/search?q=Brushed+Brass+Arc+Floor+Lamp&tbm=shop',
          specifications: 'Height: 82", Dimmable Warm LED',
          matchScore: 95
        },
        {
          id: 'shop-mcm-table',
          name: 'Walnut Oval Nesting Coffee Table',
          category: 'tables',
          price: 320,
          merchant: 'Burrow',
          rating: 4.9,
          reviewsCount: 215,
          imageUrl: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=400&auto=format&fit=crop',
          searchQuery: 'Walnut Oval Nesting Coffee Table',
          storeUrl: 'https://www.google.com/search?q=Walnut+Oval+Nesting+Coffee+Table&tbm=shop',
          specifications: '48" L x 24" W x 16" H, Solid American Walnut',
          matchScore: 94
        },
        {
          id: 'shop-mcm-rug',
          name: 'Mid-Century Retro Geometric Wool Rug 8x10',
          category: 'rugs',
          price: 440,
          merchant: 'Rugs USA',
          rating: 4.6,
          reviewsCount: 512,
          imageUrl: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?q=80&w=400&auto=format&fit=crop',
          searchQuery: 'Mid-Century Retro Geometric Wool Rug 8x10',
          storeUrl: 'https://www.google.com/search?q=Mid-Century+Retro+Geometric+Wool+Rug+8x10&tbm=shop',
          specifications: '8ft x 10ft, 100% New Zealand Wool',
          matchScore: 97
        }
      ],
      designTips: [
        'Keep coffee table surface clear except for 2-3 art books and a small ceramic bowl.',
        'Pair mustard throw pillows with deep teal accents for maximum mid-century color harmony.',
        'Ensure the arc lamp sweeps over the coffee table to create an intimate conversational zone.'
      ]
    },
    'scandinavian': {
      id: 'design-lrb-scandi',
      styleId: 'scandinavian',
      styleName: 'Scandinavian Minimalist',
      imageUrl: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=1200&auto=format&fit=crop',
      createdAt: 'Just now',
      description: 'Transformed into a serene Nordic haven with light oak furniture, crisp white linen seating, soft pebble grey wool rug, and thriving Monstera foliage.',
      colorPalette: [
        { hex: '#F9FAFB', name: 'Alpine White' },
        { hex: '#E5E7EB', name: 'Soft Pebble' },
        { hex: '#D97706', name: 'Blonde Oak' },
        { hex: '#111827', name: 'Matte Black' }
      ],
      annotations: [
        {
          id: 'ann-sc-1',
          x: 50,
          y: 60,
          title: 'Light Linen Slipcovered Sofa',
          detail: 'Breathable cream linen fabric with plush feather-down cushions.',
          category: 'Seating'
        },
        {
          id: 'ann-sc-2',
          x: 78,
          y: 50,
          title: 'Potted Monstera Deliciosa',
          detail: 'Brings organic leaf patterns and vibrant air-purifying greens into the room.',
          category: 'Plants'
        }
      ],
      shoppableItems: [
        {
          id: 'shop-scandi-sofa',
          name: 'Nordic Light Grey Linen Sectional',
          category: 'seating',
          price: 1150,
          merchant: 'Nordic Nest',
          rating: 4.9,
          reviewsCount: 142,
          imageUrl: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=400&auto=format&fit=crop',
          searchQuery: 'Nordic Light Grey Linen Sectional Sofa',
          storeUrl: 'https://www.google.com/search?q=Nordic+Light+Grey+Linen+Sectional+Sofa&tbm=shop',
          specifications: 'Width: 92", Removable Machine Washable Covers',
          matchScore: 99
        },
        {
          id: 'shop-scandi-table',
          name: 'Blonde Oak Round Coffee Table',
          category: 'tables',
          price: 260,
          merchant: 'HAY Design',
          rating: 4.8,
          reviewsCount: 98,
          imageUrl: 'https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?q=80&w=400&auto=format&fit=crop',
          searchQuery: 'Blonde Oak Round Coffee Table HAY',
          storeUrl: 'https://www.google.com/search?q=Blonde+Oak+Round+Coffee+Table+HAY&tbm=shop',
          specifications: '34" Diameter, Matte Lacquered Oak',
          matchScore: 96
        }
      ],
      designTips: [
        'Maximize natural light by replacing heavy drapes with sheer white linen curtains.',
        'Add a faux sheepskin rug draped over an armchair for tactile Scandinavian hygge.'
      ]
    },
    'japandi': {
      id: 'design-lrb-japandi',
      styleId: 'japandi',
      styleName: 'Japandi Serenity',
      imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop',
      createdAt: 'Just now',
      description: 'Earthy textured plaster walls, ebonized dark wood accents, low platform seating, and minimalist handcrafted clay vases.',
      colorPalette: [
        { hex: '#D2C2A0', name: 'Oatmeal Linen' },
        { hex: '#8C7A6B', name: 'Muted Clay' },
        { hex: '#374151', name: 'Ebonized Oak' },
        { hex: '#52525B', name: 'Charcoal Ink' }
      ],
      annotations: [
        {
          id: 'ann-jp-1',
          x: 45,
          y: 65,
          title: 'Low Platform Oatmeal Lounge',
          detail: 'Grounding low profile seating in raw unbleached woven cotton.',
          category: 'Seating'
        }
      ],
      shoppableItems: [
        {
          id: 'shop-jp-sofa',
          name: 'Japandi Low-Profile Modular Sofa Oatmeal',
          category: 'seating',
          price: 1390,
          merchant: 'Castlery',
          rating: 4.9,
          reviewsCount: 88,
          imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=400&auto=format&fit=crop',
          searchQuery: 'Japandi Low Profile Modular Sofa Oatmeal',
          storeUrl: 'https://www.google.com/search?q=Japandi+Low+Profile+Modular+Sofa+Oatmeal&tbm=shop',
          specifications: 'Low seat height 15", High-density resilient foam',
          matchScore: 97
        }
      ],
      designTips: [
        'Incorporate wabi-sabi principles: celebrate subtle imperfections in hand-turned ceramic decor.',
        'Keep wall decor minimal — one large abstract textured canvas creates a serene focal anchor.'
      ]
    },
    'industrial-loft': {
      id: 'design-lrb-ind',
      styleId: 'industrial-loft',
      styleName: 'Industrial Chic',
      imageUrl: 'https://images.unsplash.com/photo-1505691938895-1758d7FEB511?q=80&w=1200&auto=format&fit=crop',
      createdAt: 'Just now',
      description: 'Dramatically updated with exposed red brick backdrop, rich cognac leather Chesterfield seating, and matte black steel accents.',
      colorPalette: [
        { hex: '#9A3412', name: 'Aged Red Brick' },
        { hex: '#B45309', name: 'Cognac Leather' },
        { hex: '#18181B', name: 'Matte Steel' }
      ],
      annotations: [
        {
          id: 'ann-ind-1',
          x: 52,
          y: 58,
          title: 'Cognac Leather Chesterfield Sofa',
          detail: 'Full-grain top leather with button tufting and antique brass studs.',
          category: 'Seating'
        }
      ],
      shoppableItems: [
        {
          id: 'shop-ind-sofa',
          name: 'Aged Cognac Leather Chesterfield Sofa',
          category: 'seating',
          price: 1650,
          merchant: 'Restoration Hardware Style',
          rating: 4.8,
          reviewsCount: 230,
          imageUrl: 'https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?q=80&w=400&auto=format&fit=crop',
          searchQuery: 'Aged Cognac Leather Chesterfield Sofa',
          storeUrl: 'https://www.google.com/search?q=Aged+Cognac+Leather+Chesterfield+Sofa&tbm=shop',
          specifications: 'Hand-rubbed top grain leather, kiln-dried hardwood',
          matchScore: 96
        }
      ],
      designTips: [
        'Balance heavy leather and brick with warm ambient light from Edison bulb floor lamps.',
        'Use black metal framing on coffee tables to anchor the industrial outline.'
      ]
    }
  }
};
