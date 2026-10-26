import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ASPECT_RATIOS,
  IMAGE_SIZES,
  buildDiversifiedPrompt,
  getAspectRatioNumeric,
  sanitizeFilename,
  generateThemedWallpaperSvgXml,
  generateThemedWallpaperSvg,
  prepareWallpaperFileData,
  VARIATION_DIRECTIVES,
} from './wallpaper-engine.ts';

test('ASPECT_RATIOS includes 9:16 and all mandated ratios', () => {
  const ids = ASPECT_RATIOS.map((r) => r.id);
  assert.ok(ids.includes('9:16'), 'Should support 9:16 for phones');
  assert.ok(ids.includes('1:1'), 'Should support 1:1');
  assert.ok(ids.includes('2:3'), 'Should support 2:3');
  assert.ok(ids.includes('3:2'), 'Should support 3:2');
  assert.ok(ids.includes('3:4'), 'Should support 3:4');
  assert.ok(ids.includes('4:3'), 'Should support 4:3');
  assert.ok(ids.includes('16:9'), 'Should support 16:9');
  assert.ok(ids.includes('21:9'), 'Should support 21:9');
});

test('IMAGE_SIZES includes 1K, 2K, and 4K studio resolutions', () => {
  const sizeIds = IMAGE_SIZES.map((s) => s.id);
  assert.deepEqual(sizeIds, ['1K', '2K', '4K']);
});

test('buildDiversifiedPrompt applies distinct perspective directives across 4 variations', () => {
  const prompt = 'rainy cyberpunk lo-fi';
  const v0 = buildDiversifiedPrompt(prompt, 0, '9:16', false);
  const v1 = buildDiversifiedPrompt(prompt, 1, '9:16', false);
  const v2 = buildDiversifiedPrompt(prompt, 2, '9:16', false);
  const v3 = buildDiversifiedPrompt(prompt, 3, '9:16', false);

  assert.ok(v0.includes(VARIATION_DIRECTIVES[0].perspectiveMod));
  assert.ok(v1.includes(VARIATION_DIRECTIVES[1].perspectiveMod));
  assert.ok(v2.includes(VARIATION_DIRECTIVES[2].perspectiveMod));
  assert.ok(v3.includes(VARIATION_DIRECTIVES[3].perspectiveMod));
  assert.notEqual(v0, v1);
  assert.notEqual(v1, v2);
});

test('buildDiversifiedPrompt adds remix prefix when isRemix is true', () => {
  const prompt = 'ethereal neon forest';
  const remixPrompt = buildDiversifiedPrompt(prompt, 0, '9:16', true);
  assert.ok(remixPrompt.startsWith('Remix and evolve this wallpaper'));
  assert.ok(remixPrompt.includes('ethereal neon forest'));
});

test('getAspectRatioNumeric returns correct aspect ratio float', () => {
  assert.equal(getAspectRatioNumeric('9:16'), 9 / 16);
  assert.equal(getAspectRatioNumeric('1:1'), 1);
  assert.equal(getAspectRatioNumeric('21:9'), 21 / 9);
});

test('sanitizeFilename produces safe, clean filenames', () => {
  const name = sanitizeFilename('Rainy Cyberpunk Lo-Fi 4K!!', 'abc123xyz');
  assert.equal(name, 'aurawall-rainy-cyberpunk-lo-fi-4k-abc123.png');
});

test('generateThemedWallpaperSvgXml produces valid SVG xml string with dimensions', () => {
  const svgXml = generateThemedWallpaperSvgXml('rainy cyberpunk lo-fi', 0, '9:16');
  assert.ok(svgXml.startsWith('<svg'));
  assert.ok(svgXml.includes('viewBox="0 0 900 1600"'));
  assert.ok(svgXml.endsWith('</svg>'));
});

test('generateThemedWallpaperSvg produces valid data URL with dimensions', () => {
  const svgUrl = generateThemedWallpaperSvg('rainy cyberpunk lo-fi', 0, '9:16');
  assert.ok(svgUrl.startsWith('data:image/svg+xml;utf8,'));
  const decoded = decodeURIComponent(svgUrl);
  assert.ok(decoded.includes('<svg'));
  assert.ok(decoded.includes('viewBox="0 0 900 1600"'));
});

test('prepareWallpaperFileData correctly identifies and decodes SVG data URIs as UTF-8 XML', () => {
  const svgUrl = generateThemedWallpaperSvg('cyberpunk city', 0, '9:16');
  const wallpaper = {
    id: 'test-1',
    prompt: 'cyberpunk city',
    aspectRatio: '9:16' as const,
    imageSize: '2K' as const,
    model: 'gemini-3.1-flash-image-preview' as const,
    imageUrl: svgUrl,
    variationIndex: 0,
    variationTitle: 'Cyberpunk',
    createdAt: Date.now(),
  };

  const fileData = prepareWallpaperFileData(wallpaper);
  assert.equal(fileData.extension, '.svg');
  assert.equal(fileData.mimeType, 'image/svg+xml');
  assert.equal(fileData.encoding, 'utf8');
  assert.ok(fileData.content.startsWith('<svg'));
  assert.ok(fileData.content.endsWith('</svg>'));
  assert.equal(fileData.isRemote, false);
});

test('prepareWallpaperFileData cleanly extracts base64 raster data without URI prefixes or whitespace', () => {
  const wallpaper = {
    id: 'test-2',
    prompt: 'minimalist landscape',
    aspectRatio: '16:9' as const,
    imageSize: '4K' as const,
    model: 'gemini-3.1-flash-image-preview' as const,
    imageUrl: 'data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg== \n',
    variationIndex: 1,
    variationTitle: 'Minimalist',
    createdAt: Date.now(),
  };

  const fileData = prepareWallpaperFileData(wallpaper);
  assert.equal(fileData.extension, '.png');
  assert.equal(fileData.mimeType, 'image/png');
  assert.equal(fileData.encoding, 'base64');
  assert.ok(!fileData.content.includes('data:image/png;base64,'));
  assert.ok(!fileData.content.includes(' '));
  assert.ok(!fileData.content.includes('\n'));
  assert.ok(fileData.content.startsWith('iVBORw0KGgo'));
});

test('prepareWallpaperFileData recognizes remote HTTP/HTTPS image URLs', () => {
  const wallpaper = {
    id: 'test-3',
    prompt: 'aurora borealis',
    aspectRatio: '9:16' as const,
    imageSize: '1K' as const,
    model: 'gemini-3.1-flash-image-preview' as const,
    imageUrl: 'https://images.unsplash.com/photo-example.jpg',
    variationIndex: 2,
    variationTitle: 'Aurora',
    createdAt: Date.now(),
  };

  const fileData = prepareWallpaperFileData(wallpaper);
  assert.equal(fileData.isRemote, true);
  assert.equal(fileData.remoteUrl, 'https://images.unsplash.com/photo-example.jpg');
});
