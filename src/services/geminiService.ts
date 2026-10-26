import {
  AspectRatio,
  ImageSize,
  ModelType,
  WallpaperItem,
  buildDiversifiedPrompt,
  generateThemedWallpaperSvg,
  generateThemedWallpaperSvgXml,
  VARIATION_DIRECTIVES,
} from '../utils/wallpaper-engine';

export interface GenerateVariationParams {
  prompt: string;
  variationIndex: number;
  aspectRatio: AspectRatio;
  imageSize: ImageSize;
  model: ModelType;
  referenceImage?: string; // base64 or data URL for remix
  isRemix?: boolean;
  apiKey?: string;
}

export interface GenerateVariationResult {
  success: boolean;
  imageUrl: string;
  rawSvgXml?: string;
  prompt: string;
  diversifiedPrompt: string;
  variationIndex: number;
  variationTitle: string;
  aspectRatio: AspectRatio;
  imageSize: ImageSize;
  model: ModelType;
  isRemix: boolean;
  source: 'gemini' | 'gemini-fallback' | 'offline-demo';
}

/**
 * Generate a single wallpaper variation directly in the mobile client
 */
export async function generateSingleVariation(
  params: GenerateVariationParams
): Promise<GenerateVariationResult> {
  const {
    prompt,
    variationIndex = 0,
    aspectRatio = '9:16',
    imageSize = '1K',
    model = 'gemini-3-pro-image-preview',
    referenceImage,
    isRemix = false,
    apiKey,
  } = params;

  const directive = VARIATION_DIRECTIVES[variationIndex % VARIATION_DIRECTIVES.length];
  const diversifiedPrompt = buildDiversifiedPrompt(prompt, variationIndex, aspectRatio, isRemix);

  // If Gemini API Key is available, attempt real generation
  const activeKey = apiKey || process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

  if (activeKey.trim()) {
    try {
      const parts: Array<{ text?: string; inlineData?: { data: string; mimeType: string } }> = [];

      // If remixing with reference image, parse base64
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

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(
        activeKey.trim()
      )}`;

      const requestBody = {
        contents: [
          {
            parts,
          },
        ],
        generationConfig: {
          imageConfig: {
            aspectRatio,
            imageSize,
          },
        },
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'aistudio-build',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        const candidateParts = data.candidates?.[0]?.content?.parts || [];
        for (const part of candidateParts) {
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
      } else {
        const errorText = await response.text();
        console.warn(`[AuraWall] Gemini API returned error (${response.status}):`, errorText);
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.warn(`[AuraWall] Network/Gemini error: ${errorMsg}. Using aesthetic fallback.`);
    }
  }

  // Fallback to high-aesthetic procedural wallpaper SVG
  const rawSvgXml = generateThemedWallpaperSvgXml(prompt, variationIndex, aspectRatio);
  const fallbackSvgUrl = generateThemedWallpaperSvg(prompt, variationIndex, aspectRatio);

  return {
    success: true,
    imageUrl: fallbackSvgUrl,
    rawSvgXml,
    prompt,
    diversifiedPrompt,
    variationIndex,
    variationTitle: directive.title,
    aspectRatio,
    imageSize,
    model,
    isRemix,
    source: activeKey.trim() ? 'gemini-fallback' : 'offline-demo',
  };
}
