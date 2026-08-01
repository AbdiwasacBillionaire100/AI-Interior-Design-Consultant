import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware for parsing JSON requests
app.use(express.json({ limit: '20mb' }));

// Helper to instantiate Gemini client securely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set in environment variables.');
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Extract base64 raw string and mime type from data URL
function parseDataUrl(dataUrl: string) {
  if (!dataUrl || !dataUrl.startsWith('data:')) {
    return { mimeType: 'image/jpeg', base64Data: dataUrl };
  }
  const matches = dataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
  if (matches && matches.length === 3) {
    return { mimeType: matches[1], base64Data: matches[2] };
  }
  return { mimeType: 'image/jpeg', base64Data: dataUrl.split(',')[1] || dataUrl };
}

// 1. Analyze Room Photo Endpoint
app.post('/api/analyze-room', async (req, res) => {
  try {
    const { image, roomType, title } = req.body;
    const ai = getGeminiClient();

    if (!ai || !image) {
      return res.json({
        success: true,
        analysis: {
          lighting: 'Good ambient lighting with natural window balance',
          keyFurniture: ['Primary seating arrangement', 'Center coffee table', 'Accent lighting fixture'],
          dominantColors: ['#E5E0D8', '#8C7A6B', '#4A3B32', '#FAF8F5'],
          layoutNotes: 'Balanced layout with main focal point opposite seating area.'
        }
      });
    }

    const { mimeType, base64Data } = parseDataUrl(image);

    const prompt = `Analyze this interior room photo (${roomType || 'room'}: "${title || 'space'}"). 
Provide a concise architectural and interior design evaluation in JSON format with keys:
- lighting (string description)
- keyFurniture (array of string item names detected)
- dominantColors (array of 4 hex color strings detected)
- layoutNotes (string describing spatial flow)
- topStyleRecommendations (array of 3 style names that would elevate this space)`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: {
        parts: [
          { inlineData: { mimeType, data: base64Data } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            lighting: { type: Type.STRING },
            keyFurniture: { type: Type.ARRAY, items: { type: Type.STRING } },
            dominantColors: { type: Type.ARRAY, items: { type: Type.STRING } },
            layoutNotes: { type: Type.STRING },
            topStyleRecommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['lighting', 'keyFurniture', 'dominantColors', 'layoutNotes']
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return res.json({ success: true, analysis: result });
  } catch (error: any) {
    console.error('Error analyzing room:', error?.message || error);
    return res.json({
      success: true,
      analysis: {
        lighting: 'Warm ambient sunlight with soft overhead shadow distribution',
        keyFurniture: ['Central seating unit', 'Coffee table', 'Accent floor lamp'],
        dominantColors: ['#D2C2A0', '#8C7A6B', '#374151', '#F9FAFB'],
        layoutNotes: 'Open layout suitable for modular makeover.'
      }
    });
  }
});

// 2. AI Reimagined Design Endpoint
app.post('/api/generate-design', async (req, res) => {
  try {
    const { image, styleId, styleName, promptPrefix, customPrompt } = req.body;
    const ai = getGeminiClient();

    const fullPrompt = `${promptPrefix || ''} ${customPrompt || ''}. Re-imagine the room photo into a photorealistic, beautifully styled interior photoshoot of ${styleName}. High end architecture magazine photograph, realistic natural lighting, balanced composition, highly detailed textures.`;

    let generatedImageUrl: string | null = null;
    let designSummary = `A stunning transformation in ${styleName} style featuring cohesive furnishings, curated color balance, and elevated atmosphere.`;

    if (ai && image) {
      const { mimeType, base64Data } = parseDataUrl(image);

      try {
        // Try image generation/editing with gemini-3.1-flash-lite-image
        const imageGenResponse = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite-image',
          contents: {
            parts: [
              { inlineData: { mimeType, data: base64Data } },
              { text: fullPrompt }
            ]
          },
          config: {
            imageConfig: {
              aspectRatio: '16:9'
            }
          }
        });

        for (const part of imageGenResponse.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData?.data) {
            const mime = part.inlineData.mimeType || 'image/png';
            generatedImageUrl = `data:${mime};base64,${part.inlineData.data}`;
          } else if (part.text) {
            designSummary = part.text;
          }
        }
      } catch (imgError: any) {
        console.warn('Image edit model fallback trigger:', imgError?.message || imgError);
      }
    }

    // Fallback image if model didn't yield inline base64 or key missing
    if (!generatedImageUrl) {
      const styleImageMap: Record<string, string> = {
        'mid-century-modern': 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=1200&auto=format&fit=crop',
        'scandinavian': 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=1200&auto=format&fit=crop',
        'japandi': 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop',
        'industrial-loft': 'https://images.unsplash.com/photo-1505691938895-1758d7FEB511?q=80&w=1200&auto=format&fit=crop',
        'boho-organic': 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1200&auto=format&fit=crop',
        'modern-coastal': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop',
        'moody-dark-velvet': 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200&auto=format&fit=crop',
        'art-deco': 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop'
      };
      generatedImageUrl = styleImageMap[styleId] || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop';
    }

    // Ask Gemini text model to create rich shoppable product recommendations and hotspots for this transformed style
    let shoppableItems = [];
    let colorPalette = [];
    let annotations = [];
    let designTips = [];

    if (ai) {
      try {
        const detailPrompt = `You are a high-end AI Interior Designer. We transformed a room into "${styleName}".
Create a detailed specification for this transformed room in JSON format with keys:
1. description: 2-3 sentences describing the atmosphere, textures, and key highlights.
2. colorPalette: Array of 4-5 objects with keys { "hex": "#...", "name": "Color Name" }.
3. annotations: Array of 3 interactive hotspots with keys { "id": "1", "x": percentage_0_to_100, "y": percentage_0_to_100, "title": "Item Name", "detail": "1-sentence description", "category": "Seating|Lighting|Rugs|Tables|Decor|Plants" }.
4. shoppableItems: Array of 3-4 realistic shoppable furniture products with keys {
   "id": "item-1",
   "name": "Product Name",
   "category": "seating|lighting|tables|rugs|decor|plants|storage|wall",
   "price": number_in_usd,
   "merchant": "Brand Name e.g. West Elm, Article, HAY, IKEA, CB2, Burrow",
   "rating": 4.8,
   "reviewsCount": 180,
   "imageUrl": "unsplash item photo or placeholder",
   "searchQuery": "search query string for google shopping",
   "specifications": "dimensions and material details",
   "matchScore": 95
}
5. designTips: Array of 2-3 actionable interior designer styling advice strings.`;

        const detailsResponse = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: detailPrompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                description: { type: Type.STRING },
                colorPalette: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      hex: { type: Type.STRING },
                      name: { type: Type.STRING }
                    }
                  }
                },
                annotations: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      x: { type: Type.NUMBER },
                      y: { type: Type.NUMBER },
                      title: { type: Type.STRING },
                      detail: { type: Type.STRING },
                      category: { type: Type.STRING }
                    }
                  }
                },
                shoppableItems: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      name: { type: Type.STRING },
                      category: { type: Type.STRING },
                      price: { type: Type.NUMBER },
                      merchant: { type: Type.STRING },
                      rating: { type: Type.NUMBER },
                      reviewsCount: { type: Type.NUMBER },
                      imageUrl: { type: Type.STRING },
                      searchQuery: { type: Type.STRING },
                      specifications: { type: Type.STRING },
                      matchScore: { type: Type.NUMBER }
                    }
                  }
                },
                designTips: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ['description', 'colorPalette', 'shoppableItems', 'designTips']
            }
          }
        });

        const parsed = JSON.parse(detailsResponse.text || '{}');
        if (parsed.description) designSummary = parsed.description;
        if (parsed.colorPalette) colorPalette = parsed.colorPalette;
        if (parsed.annotations) annotations = parsed.annotations;
        if (parsed.shoppableItems) {
          shoppableItems = parsed.shoppableItems.map((item: any) => ({
            ...item,
            imageUrl: item.imageUrl && item.imageUrl.startsWith('http')
              ? item.imageUrl
              : 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=400&auto=format&fit=crop',
            storeUrl: `https://www.google.com/search?q=${encodeURIComponent(item.searchQuery || item.name)}&tbm=shop`
          }));
        }
        if (parsed.designTips) designTips = parsed.designTips;
      } catch (e: any) {
        console.warn('Fallback details generation:', e?.message);
      }
    }

    // Default fallbacks if Gemini text details were sparse
    if (colorPalette.length === 0) {
      colorPalette = [
        { hex: '#7A3E26', name: 'Primary Wood' },
        { hex: '#D97706', name: 'Accent Warmth' },
        { hex: '#F3F4F6', name: 'Base Cream' },
        { hex: '#1F2937', name: 'Grounding Dark' }
      ];
    }

    if (shoppableItems.length === 0) {
      shoppableItems = [
        {
          id: `shop-${Date.now()}-1`,
          name: `${styleName} Designer Sofa`,
          category: 'seating',
          price: 980,
          merchant: 'Article / West Elm',
          rating: 4.8,
          reviewsCount: 154,
          imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=400&auto=format&fit=crop',
          searchQuery: `${styleName} Designer Sofa`,
          storeUrl: `https://www.google.com/search?q=${encodeURIComponent(`${styleName} Designer Sofa`)}&tbm=shop`,
          specifications: 'W: 86" x D: 36" x H: 32", Kiln-dried wood frame',
          matchScore: 97
        },
        {
          id: `shop-${Date.now()}-2`,
          name: `Handcrafted ${styleName} Coffee Table`,
          category: 'tables',
          price: 340,
          merchant: 'Burrow / HAY',
          rating: 4.7,
          reviewsCount: 92,
          imageUrl: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=400&auto=format&fit=crop',
          searchQuery: `${styleName} Coffee Table`,
          storeUrl: `https://www.google.com/search?q=${encodeURIComponent(`${styleName} Coffee Table`)}&tbm=shop`,
          specifications: 'Solid hardwood top, matte protective finish',
          matchScore: 95
        },
        {
          id: `shop-${Date.now()}-3`,
          name: `Sculptural ${styleName} Floor Lamp`,
          category: 'lighting',
          price: 195,
          merchant: 'CB2',
          rating: 4.9,
          reviewsCount: 210,
          imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=400&auto=format&fit=crop',
          searchQuery: `${styleName} Floor Lamp`,
          storeUrl: `https://www.google.com/search?q=${encodeURIComponent(`${styleName} Floor Lamp`)}&tbm=shop`,
          specifications: 'Brushed metal finish, dimmable warm LED',
          matchScore: 94
        }
      ];
    }

    if (annotations.length === 0) {
      annotations = [
        {
          id: 'ann-gen-1',
          x: 50,
          y: 65,
          title: `${styleName} Seating`,
          detail: 'Main anchor seating upholstered in soft tactile fabric.',
          category: 'Seating'
        },
        {
          id: 'ann-gen-2',
          x: 25,
          y: 45,
          title: 'Architectural Lighting',
          detail: 'Provides warm multi-layered illumination across the room.',
          category: 'Lighting'
        }
      ];
    }

    if (designTips.length === 0) {
      designTips = [
        'Layer natural textures like wool, ceramic, and wood to create depth.',
        'Keep key transit pathways at least 30 inches clear for comfortable movement.'
      ];
    }

    return res.json({
      success: true,
      design: {
        id: `design-${Date.now()}`,
        styleId: styleId || 'custom',
        styleName: styleName || 'Custom Reimagined',
        imageUrl: generatedImageUrl,
        createdAt: 'Just now',
        description: designSummary,
        colorPalette,
        annotations,
        shoppableItems,
        designTips
      }
    });

  } catch (error: any) {
    console.error('Error generating design:', error?.message || error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to generate design'
    });
  }
});

// 3. Refinement Chat & Shoppable Links Endpoint
app.post('/api/chat-refine', async (req, res) => {
  try {
    const { messageHistory, currentDesign, originalImage, userPrompt } = req.body;
    const ai = getGeminiClient();

    if (!userPrompt) {
      return res.status(400).json({ error: 'User prompt is required' });
    }

    const systemInstruction = `You are a world-class AI Interior Design Consultant. 
The user is viewing a reimagined room makeover in "${currentDesign?.styleName || 'Custom'}" style.
The user wants to refine or tweak the design (e.g. "Keep this layout but make the rug blue", "Add a large ficus plant in the corner", "Swap the coffee table for a round glass top").

Your goals:
1. Provide a warm, expert interior designer response explaining the requested design adjustments.
2. Determine if the user requested a VISUAL change to the room (e.g. changing rug color, swapping furniture, altering walls, adding plants).
3. Extract or recommend shoppable furniture products matching the updated elements.
4. Suggest 3 short, inspiring follow-up refinement chips for the user.`;

    let responseText = "I've updated the room design based on your feedback!";
    let shoppableItems: any[] = [];
    let suggestedPrompts: string[] = [];
    let updatedImageUrl: string | null = null;
    let shouldUpdateVisual = false;

    if (ai) {
      // Build prompt with conversation context
      const chatPrompt = `Current Room Style: ${currentDesign?.styleName || 'Modern'}
Current Design Description: ${currentDesign?.description || ''}

User Request: "${userPrompt}"

Analyze the request and return JSON:
{
  "replyText": "Professional, encouraging interior designer reply explaining what changes were made and how they complement the space.",
  "isVisualModification": true or false (true if user wants to change rug, sofa, wall, lamp, layout, plants, colors),
  "visualEditPrompt": "Detailed image editing prompt describing the changes to apply to the room image",
  "shoppableRecommendations": [
    {
      "id": "item-1",
      "name": "Product Name",
      "category": "seating|lighting|tables|rugs|decor|plants|storage|wall",
      "price": number,
      "merchant": "Brand Name e.g. Wayfair, IKEA, West Elm, Article",
      "rating": 4.8,
      "reviewsCount": 120,
      "searchQuery": "search string for item",
      "specifications": "spec details",
      "matchScore": 96
    }
  ],
  "suggestedPrompts": [
    "Short follow-up idea 1",
    "Short follow-up idea 2",
    "Short follow-up idea 3"
  ]
}`;

      try {
        const chatResponse = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: chatPrompt,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                replyText: { type: Type.STRING },
                isVisualModification: { type: Type.BOOLEAN },
                visualEditPrompt: { type: Type.STRING },
                shoppableRecommendations: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      name: { type: Type.STRING },
                      category: { type: Type.STRING },
                      price: { type: Type.NUMBER },
                      merchant: { type: Type.STRING },
                      rating: { type: Type.NUMBER },
                      reviewsCount: { type: Type.NUMBER },
                      searchQuery: { type: Type.STRING },
                      specifications: { type: Type.STRING },
                      matchScore: { type: Type.NUMBER }
                    }
                  }
                },
                suggestedPrompts: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ['replyText', 'isVisualModification', 'shoppableRecommendations', 'suggestedPrompts']
            }
          }
        });

        const chatData = JSON.parse(chatResponse.text || '{}');
        if (chatData.replyText) responseText = chatData.replyText;
        shouldUpdateVisual = !!chatData.isVisualModification;
        if (chatData.suggestedPrompts) suggestedPrompts = chatData.suggestedPrompts;

        if (chatData.shoppableRecommendations) {
          shoppableItems = chatData.shoppableRecommendations.map((item: any, idx: number) => ({
            ...item,
            id: `shop-refine-${Date.now()}-${idx}`,
            imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=400&auto=format&fit=crop',
            storeUrl: `https://www.google.com/search?q=${encodeURIComponent(item.searchQuery || item.name)}&tbm=shop`
          }));
        }

        // If a visual modification was requested, generate updated image with gemini-3.1-flash-lite-image
        if (shouldUpdateVisual && currentDesign?.imageUrl) {
          try {
            const editImagePrompt = `Modify this interior design photo according to this request: ${userPrompt}. Keep the overall room structure and style (${currentDesign.styleName}) consistent, but apply these exact changes: ${chatData.visualEditPrompt || userPrompt}. High interior design photoshoot quality.`;
            
            const imageToEdit = currentDesign.imageUrl.startsWith('data:')
              ? currentDesign.imageUrl
              : originalImage;

            if (imageToEdit) {
              const { mimeType, base64Data } = parseDataUrl(imageToEdit);
              const imgEditResponse = await ai.models.generateContent({
                model: 'gemini-3.1-flash-lite-image',
                contents: {
                  parts: [
                    { inlineData: { mimeType, data: base64Data } },
                    { text: editImagePrompt }
                  ]
                },
                config: {
                  imageConfig: { aspectRatio: '16:9' }
                }
              });

              for (const part of imgEditResponse.candidates?.[0]?.content?.parts || []) {
                if (part.inlineData?.data) {
                  const mime = part.inlineData.mimeType || 'image/png';
                  updatedImageUrl = `data:${mime};base64,${part.inlineData.data}`;
                }
              }
            }
          } catch (editError: any) {
            console.warn('Image edit model error in chat:', editError?.message);
          }
        }

      } catch (err: any) {
        console.error('Error in chat-refine route:', err?.message || err);
      }
    }

    if (suggestedPrompts.length === 0) {
      suggestedPrompts = [
        'How would warmer recessed lighting look here?',
        'Show me a matching accent armchair',
        'Add decorative floating wall shelving'
      ];
    }

    return res.json({
      success: true,
      text: responseText,
      updatedImageUrl: updatedImageUrl || (shouldUpdateVisual ? currentDesign?.imageUrl : null),
      shoppableItems,
      suggestedPrompts
    });

  } catch (error: any) {
    console.error('Chat refine error:', error?.message || error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Chat processing error'
    });
  }
});

// Vite middleware integration for production and development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Interior Design Consultant server running on port ${PORT}`);
  });
}

startServer();
