/**
 * Pure wallpaper logic and data helpers for AuraWall (React Native Expo)
 */

export type AspectRatio = '1:1' | '2:3' | '3:2' | '3:4' | '4:3' | '9:16' | '16:9' | '21:9';
export type ImageSize = '1K' | '2K' | '4K';
export type ModelType = 'gemini-3-pro-image-preview' | 'gemini-nano-banana-2.1';

export interface AspectRatioOption {
  id: AspectRatio;
  label: string;
  sublabel: string;
  widthRatio: number;
  heightRatio: number;
  iconType: 'phone' | 'square' | 'portrait' | 'landscape' | 'ultrawide';
}

export const ASPECT_RATIOS: AspectRatioOption[] = [
  { id: '9:16', label: '9:16', sublabel: 'Phone Wallpaper', widthRatio: 9, heightRatio: 16, iconType: 'phone' },
  { id: '1:1', label: '1:1', sublabel: 'Square Avatar', widthRatio: 1, heightRatio: 1, iconType: 'square' },
  { id: '2:3', label: '2:3', sublabel: 'Classic Portrait', widthRatio: 2, heightRatio: 3, iconType: 'portrait' },
  { id: '3:2', label: '3:2', sublabel: 'Classic Photo', widthRatio: 3, heightRatio: 2, iconType: 'landscape' },
  { id: '3:4', label: '3:4', sublabel: 'Tablet Portrait', widthRatio: 3, heightRatio: 4, iconType: 'portrait' },
  { id: '4:3', label: '4:3', sublabel: 'Standard Display', widthRatio: 4, heightRatio: 3, iconType: 'landscape' },
  { id: '16:9', label: '16:9', sublabel: 'Widescreen Desktop', widthRatio: 16, heightRatio: 9, iconType: 'landscape' },
  { id: '21:9', label: '21:9', sublabel: 'Cinematic Ultrawide', widthRatio: 21, heightRatio: 9, iconType: 'ultrawide' },
];

export interface ImageSizeOption {
  id: ImageSize;
  label: string;
  badge: string;
  description: string;
  pixelHint: string;
}

export const IMAGE_SIZES: ImageSizeOption[] = [
  { id: '1K', label: '1K', badge: 'Standard', description: 'Fast render & lightweight', pixelHint: '~1080p' },
  { id: '2K', label: '2K', badge: 'Crisp HD', description: 'High definition crisp details', pixelHint: '~1440p' },
  { id: '4K', label: '4K', badge: 'Studio Retina', description: 'Maximum studio fidelity', pixelHint: '~2160p+' },
];

export interface VibePreset {
  id: string;
  title: string;
  vibe: string;
  tag: string;
  gradientColors: [string, string, string];
}

export const VIBE_PRESETS: VibePreset[] = [
  {
    id: 'cyberpunk-lofi',
    title: 'Rainy Cyberpunk',
    vibe: 'rainy cyberpunk lo-fi city street, neon reflections on wet asphalt, soft moody fog, glowing storefront signs, cinematic purple and cyan lighting, phone wallpaper composition',
    tag: 'Cyberpunk',
    gradientColors: ['#701a75', '#1e1b4b', '#020617'],
  },
  {
    id: 'ghibli-sunset',
    title: 'Ghibli Meadow',
    vibe: 'peaceful anime meadow hill at golden hour, fluffy pastel clouds, gentle wind breeze, lone ancient oak tree, warm nostalgic sunset anime art style, wallpaper masterpiece',
    tag: 'Anime Vibe',
    gradientColors: ['#b45309', '#431407', '#022c22'],
  },
  {
    id: 'oled-noir',
    title: 'Dark OLED Noir',
    vibe: 'deep dark OLED true black minimalism, sleek metallic geometry, subtle luminous crimson edge lighting, matte dark obsidian textures, ultra clean wallpaper',
    tag: 'OLED Black',
    gradientColors: ['#18181b', '#0a0a0a', '#000000'],
  },
  {
    id: 'pastel-minimal',
    title: 'Pastel Dream',
    vibe: 'minimalist architectural archway in soft desert mist, pastel peach and lavender gradient sky, serene calm dunes, clean negative space for phone lock screen',
    tag: 'Minimal',
    gradientColors: ['#9d174d', '#3b0764', '#0f172a'],
  },
  {
    id: 'cosmic-nebula',
    title: 'Cosmic Drift',
    vibe: 'deep space ethereal nebula, stardust spiral, iridescent celestial auroras, dark starry void, cinematic 8k wallpaper',
    tag: 'Sci-Fi',
    gradientColors: ['#2e1065', '#3b0764', '#172554'],
  },
  {
    id: 'tokyo-midnight',
    title: 'Tokyo Midnight',
    vibe: 'midnight Tokyo back-alley under soft drizzle, illuminated vending machines glowing warm amber, cozy ramen bar doorway, film grain aesthetic',
    tag: 'Urban',
    gradientColors: ['#4c0519', '#082f49', '#171717'],
  },
];

export const SURPRISE_VIBES = [
  'rainy cyberpunk lo-fi alley with neon holographic signs and wet pavement reflection',
  'ethereal studio ghibli summer hill with wildflowers and distant cumulonimbus clouds',
  'dark OLED minimalist obsidian monolith with glowing gold geometric seam lines',
  'tokyo midnight rainy convenience store front with warm ambient interior light',
  'peaceful vaporwave purple beach sunset with grid horizon and low polygon palm trees',
  'cozy loft window overlooking rainy seattle skyline with steaming coffee mug silhouette',
  'minimalist scandinavian pine forest shrouded in ethereal morning mist',
  'cosmic surrealist planetary eclipse with violet nebula dust and iridescent stars',
  'warm retro 1970s desert dunes with gradient sunset and film grain texture',
  'futuristic organic bioluminescent deep sea cavern with glowing jellyfish',
];

export const MOOD_TAGS = [
  '🌧️ Wet Raindrops',
  '⚡ Neon Bloom',
  '🌌 True OLED Black',
  '🌅 Golden Hour',
  '☕ Moody Lo-Fi',
  '🎨 Film Grain',
  '✨ Dreamy Bokeh',
];

export interface VariationDirective {
  index: number;
  title: string;
  subheading: string;
  perspectiveMod: string;
}

export const VARIATION_DIRECTIVES: VariationDirective[] = [
  {
    index: 0,
    title: 'Atmospheric Wide',
    subheading: 'Expansive environmental depth',
    perspectiveMod: 'wide environmental perspective, atmospheric scale, ambient depth with upper third balanced for clock widgets',
  },
  {
    index: 1,
    title: 'Detail & Contrast',
    subheading: 'Vivid textures & focal reflections',
    perspectiveMod: 'intimate medium focal view, rich tactile textures, crisp specular reflections and bold focal points',
  },
  {
    index: 2,
    title: 'Dreamy & Stylized',
    subheading: 'Soft chromatic haze & lyrical lighting',
    perspectiveMod: 'dreamy painterly lighting, soft chromatic diffusion, poetic mood, aesthetic pastel nuances',
  },
  {
    index: 3,
    title: 'Dramatic Noir & Shadow',
    subheading: 'Bold silhouettes & dynamic rim light',
    perspectiveMod: 'high dynamic range contrast, striking silhouette accents, deep shadows, cinematic rim lighting',
  },
];

export interface WallpaperItem {
  id: string;
  prompt: string;
  aspectRatio: AspectRatio;
  imageSize: ImageSize;
  model: ModelType;
  imageUrl: string; // base64 PNG data URL, remote URL, or SVG string/data URI
  variationIndex: number;
  variationTitle: string;
  createdAt: number;
  isRemix?: boolean;
  parentReferenceId?: string;
  favorite?: boolean;
  rawSvgXml?: string; // Optional raw SVG XML string for fast native rendering via SvgXml
}

/**
 * Build diversified prompt for each variation slot
 */
export function buildDiversifiedPrompt(
  basePrompt: string,
  variationIndex: number,
  aspectRatio: AspectRatio,
  isRemix: boolean = false
): string {
  const cleanPrompt = basePrompt.trim();
  const directive = VARIATION_DIRECTIVES[variationIndex % VARIATION_DIRECTIVES.length];

  const remixPrefix = isRemix
    ? 'Remix and evolve this wallpaper while maintaining its artistic color harmony, atmosphere, and visual identity: '
    : '';

  return `${remixPrefix}${cleanPrompt}. Variation styling: ${directive.perspectiveMod}. Format optimized for ${aspectRatio} aspect ratio mobile wallpaper, clean aesthetic, high aesthetic quality, no text artifacts, no phone mockups inside image.`;
}

/**
 * Calculate numeric aspect ratio for React Native styles: { aspectRatio: width / height }
 */
export function getAspectRatioNumeric(aspectRatio: AspectRatio): number {
  const opt = ASPECT_RATIOS.find((r) => r.id === aspectRatio) || ASPECT_RATIOS[0];
  return opt.widthRatio / opt.heightRatio;
}

/**
 * Format timestamp into readable time string
 */
export function formatWallpaperTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Sanitize prompt for filename download
 */
export function sanitizeFilename(prompt: string, id: string): string {
  const clean = prompt
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .slice(0, 30)
    .replace(/^-|-$/g, '');
  return `aurawall-${clean || 'wallpaper'}-${id.slice(0, 6)}.png`;
}

/**
 * Procedural SVG generator for graceful offline/demo fallbacks.
 * Returns clean, valid SVG XML string.
 */
export function generateThemedWallpaperSvgXml(
  prompt: string,
  variationIndex: number,
  aspectRatio: AspectRatio
): string {
  const p = prompt.toLowerCase();
  const opt = ASPECT_RATIOS.find((r) => r.id === aspectRatio) || ASPECT_RATIOS[0];
  const w = opt.widthRatio * 100;
  const h = opt.heightRatio * 100;

  // Choose palette based on keywords
  let c1 = '#090a16';
  let c2 = '#1b1238';
  let c3 = '#00f0ff';
  let c4 = '#ff007f';
  let motif = 'cyberpunk';

  if (p.includes('ghibli') || p.includes('meadow') || p.includes('sunset') || p.includes('nature')) {
    c1 = '#132a13';
    c2 = '#31572c';
    c3 = '#f77f00';
    c4 = '#fcbf49';
    motif = 'sunset';
  } else if (p.includes('noir') || p.includes('oled') || p.includes('black') || p.includes('dark')) {
    c1 = '#050505';
    c2 = '#121215';
    c3 = '#e63946';
    c4 = '#f1faee';
    motif = 'noir';
  } else if (p.includes('pastel') || p.includes('minimal') || p.includes('peach') || p.includes('desert')) {
    c1 = '#2b2d42';
    c2 = '#4a4e69';
    c3 = '#f4a261';
    c4 = '#e76f51';
    motif = 'minimal';
  } else if (p.includes('cosmic') || p.includes('space') || p.includes('nebula') || p.includes('drift')) {
    c1 = '#03071e';
    c2 = '#370617';
    c3 = '#7209b7';
    c4 = '#4cc9f0';
    motif = 'cosmic';
  }

  const vOffset = (variationIndex * 25) % 100;
  const vScale = 1 + variationIndex * 0.15;

  let innerGraphics = '';

  if (motif === 'cyberpunk') {
    innerGraphics = `
      <g opacity="0.85">
        <defs>
          <linearGradient id="neonGlow${variationIndex}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${c3}" stop-opacity="0.8" />
            <stop offset="100%" stop-color="${c4}" stop-opacity="0.8" />
          </linearGradient>
        </defs>
        <!-- Rainy City Silhouette -->
        <rect x="${w * 0.1}" y="${h * 0.45}" width="${w * 0.2}" height="${h * 0.5}" fill="#0d0d18" />
        <rect x="${w * 0.35}" y="${h * 0.35}" width="${w * 0.3}" height="${h * 0.6}" fill="#0a0a14" />
        <rect x="${w * 0.7}" y="${h * 0.5}" width="${w * 0.25}" height="${h * 0.45}" fill="#0f0f20" />

        <!-- Glowing signs and towers -->
        <circle cx="${w * 0.5 + vOffset - 50}" cy="${h * 0.38}" r="${18 * vScale}" fill="url(#neonGlow${variationIndex})" />
        <circle cx="${w * 0.5 + vOffset - 50}" cy="${h * 0.38}" r="${10 * vScale}" fill="#ffffff" />

        <!-- Rain lines -->
        <path d="M${w * 0.2} ${h * 0.1} L${w * 0.15} ${h * 0.3} M${w * 0.5} ${h * 0.15} L${w * 0.45} ${h * 0.35} M${w * 0.8} ${h * 0.2} L${w * 0.75} ${h * 0.4}" stroke="${c3}" stroke-width="1.5" stroke-opacity="0.4" stroke-dasharray="8 12" />

        <!-- Wet reflection ground -->
        <ellipse cx="${w * 0.5}" cy="${h * 0.88}" rx="${w * 0.45}" ry="${h * 0.08}" fill="url(#neonGlow${variationIndex})" opacity="0.4" />
      </g>
    `;
  } else if (motif === 'sunset') {
    innerGraphics = `
      <defs>
        <radialGradient id="sun${variationIndex}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${c4}" />
          <stop offset="100%" stop-color="${c3}" stop-opacity="0.1" />
        </radialGradient>
      </defs>
      <circle cx="${w * 0.5}" cy="${h * 0.42 + vOffset * 0.3}" r="${28 * vScale}" fill="url(#sun${variationIndex})" />
      <!-- Soft anime rolling hills -->
      <path d="M-10 ${h * 0.65} Q${w * 0.4} ${h * 0.55} ${w + 10} ${h * 0.7} L${w + 10} ${h + 10} L-10 ${h + 10} Z" fill="${c2}" />
      <path d="M-10 ${h * 0.75} Q${w * 0.6} ${h * 0.68} ${w + 10} ${h * 0.82} L${w + 10} ${h + 10} L-10 ${h + 10} Z" fill="${c1}" />
    `;
  } else if (motif === 'noir') {
    innerGraphics = `
      <!-- Deep OLED Geometric Angles -->
      <polygon points="${w * 0.1},${h * 0.2} ${w * 0.9},${h * 0.4} ${w * 0.7},${h * 0.85} ${w * 0.2},${h * 0.75}" fill="#0d0d10" stroke="${c3}" stroke-width="1.5" opacity="0.9" />
      <circle cx="${w * 0.6}" cy="${h * 0.45}" r="${14 * vScale}" fill="${c3}" opacity="0.8" />
    `;
  } else {
    innerGraphics = `
      <!-- Abstract Celestial Spheres -->
      <defs>
        <linearGradient id="orbGrad${variationIndex}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${c3}" />
          <stop offset="100%" stop-color="${c4}" />
        </linearGradient>
      </defs>
      <circle cx="${w * 0.5}" cy="${h * 0.45}" r="${26 * vScale}" fill="url(#orbGrad${variationIndex})" opacity="0.85" />
      <ellipse cx="${w * 0.5}" cy="${h * 0.75}" rx="${w * 0.4}" ry="${h * 0.12}" fill="${c2}" opacity="0.6" />
    `;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="100%" height="100%">
    <defs>
      <linearGradient id="bg${variationIndex}" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${c1}" />
        <stop offset="60%" stop-color="${c2}" />
        <stop offset="100%" stop-color="${c1}" />
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#bg${variationIndex})" />
    ${innerGraphics}
    <!-- Subtle Grid Overlay -->
    <rect width="${w}" height="${h}" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1" />
  </svg>`;
}

/**
 * Returns data URI for SVG (compatible with web and image renderers)
 */
export function generateThemedWallpaperSvg(
  prompt: string,
  variationIndex: number,
  aspectRatio: AspectRatio
): string {
  const xml = generateThemedWallpaperSvgXml(prompt, variationIndex, aspectRatio);
  return `data:image/svg+xml;utf8,${encodeURIComponent(xml)}`;
}
