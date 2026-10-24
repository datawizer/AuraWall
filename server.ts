import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import {
  AspectRatio,
  ImageSize,
  ModelType,
  buildDiversifiedPrompt,
  generateThemedWallpaperSvg,
  VARIATION_DIRECTIVES,
} from './src/utils/wallpaper-engine.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Support large payloads for reference images (remix base64 data)
app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ extended: true, limit: '60mb' }));

// Initialize GoogleGenAI client with required header
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

console.log(`[AuraWall Server] Initialized. Gemini API Key configured: ${Boolean(apiKey)}`);

/**
 * Health check & configuration status
 */
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(apiKey),
    supportedModels: ['gemini-3-pro-image-preview', 'gemini-nano-banana-2.1'],
    supportedAspectRatios: ['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9'],
    supportedImageSizes: ['1K', '2K', '4K'],
  });
});

interface GenerateRequest {
  prompt: string;
  variationIndex: number;
  aspectRatio?: AspectRatio;
  imageSize?: ImageSize;
  model?: ModelType;
  referenceImage?: string; // base64 data URL or raw base64 for remixing
  isRemix?: boolean;
}

/**
 * Generate a single wallpaper variation
 */
async function generateSingleVariation(params: GenerateRequest) {
  const {
    prompt,
    variationIndex = 0,
    aspectRatio = '9:16',
    imageSize = '1K',
    model = 'gemini-3-pro-image-preview',
    referenceImage,
    isRemix = false,
  } = params;

  const directive = VARIATION_DIRECTIVES[variationIndex % VARIATION_DIRECTIVES.length];
  const diversifiedPrompt = buildDiversifiedPrompt(prompt, variationIndex, aspectRatio, isRemix);

  // If Gemini API is available, invoke model
  if (ai && apiKey) {
    try {
      const parts: Array<{ text?: string; inlineData?: { data: string; mimeType: string } }> = [];

      // If remixing with a reference image, parse base64
      if (referenceImage) {
        let mimeType = 'image/png';
        let rawBase64 = referenceImage;
        const match = referenceImage.match(/^data:([^;]+);base64,(.+)$/);
        if (match) {
          mimeType = match[1];
          rawBase64 = match[2];
        }
        parts.push({
          inlineData: {
            data: rawBase64,
            mimeType,
          },
        });
      }

      parts.push({
        text: diversifiedPrompt,
      });

      console.log(`[AuraWall] Requesting image from model ${model} (variation ${variationIndex}, ratio ${aspectRatio}, size ${imageSize})`);

      const response = await ai.models.generateContent({
        model,
        contents: {
          parts,
        },
        config: {
          imageConfig: {
            aspectRatio,
            imageSize,
          },
        },
      });

      // Find the image part
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData?.data) {
          const mime = part.inlineData.mimeType || 'image/png';
          const imageUrl = `data:${mime};base64,${part.inlineData.data}`;
          return {
            success: true,
            imageUrl,
            prompt,
            diversifiedPrompt,
            variationIndex,
            variationTitle: directive.title,
            aspectRatio,
            imageSize,
            model,
            isRemix,
            source: 'gemini',
          };
        }
      }

      console.warn(`[AuraWall] Model response did not contain inlineData image, using high-aesthetic fallback`);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error(`[AuraWall] Error calling Gemini API:`, errorMsg);
      // Fall through to deterministic high-aesthetic themed SVG fallback
    }
  }

  // Fallback generation
  const fallbackSvgUrl = generateThemedWallpaperSvg(prompt, variationIndex, aspectRatio);
  return {
    success: true,
    imageUrl: fallbackSvgUrl,
    prompt,
    diversifiedPrompt,
    variationIndex,
    variationTitle: directive.title,
    aspectRatio,
    imageSize,
    model,
    isRemix,
    source: ai ? 'gemini-fallback' : 'offline-demo',
  };
}

/**
 * Endpoint to generate a single variation (enables progressive 1-by-1 loading in UI)
 */
app.post('/api/generate-variation', async (req, res) => {
  try {
    const { prompt, variationIndex, aspectRatio, imageSize, model, referenceImage, isRemix } = req.body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const result = await generateSingleVariation({
      prompt: prompt.trim(),
      variationIndex: typeof variationIndex === 'number' ? variationIndex : 0,
      aspectRatio,
      imageSize,
      model,
      referenceImage,
      isRemix: Boolean(isRemix),
    });

    res.json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: msg });
  }
});

/**
 * Endpoint to generate all 4 variations in a batch
 */
app.post('/api/generate-batch', async (req, res) => {
  try {
    const { prompt, aspectRatio, imageSize, model, referenceImage, isRemix } = req.body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const cleanPrompt = prompt.trim();
    // Generate 4 variations
    const promises = [0, 1, 2, 3].map((idx) =>
      generateSingleVariation({
        prompt: cleanPrompt,
        variationIndex: idx,
        aspectRatio,
        imageSize,
        model,
        referenceImage,
        isRemix: Boolean(isRemix),
      })
    );

    const variations = await Promise.all(promises);
    res.json({
      success: true,
      variations,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: msg });
  }
});

// Configure Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AuraWall] Server running at http://0.0.0.0:${PORT} (${isProd ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('[AuraWall] Failed to start server:', err);
  process.exit(1);
});
