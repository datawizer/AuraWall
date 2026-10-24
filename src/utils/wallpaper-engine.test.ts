import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ASPECT_RATIOS,
  IMAGE_SIZES,
  buildDiversifiedPrompt,
  getAspectRatioStyle,
  sanitizeFilename,
  generateThemedWallpaperSvg,
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

test('getAspectRatioStyle maps ratios to tailwind classes', () => {
  assert.equal(getAspectRatioStyle('9:16'), 'aspect-[9/16]');
  assert.equal(getAspectRatioStyle('1:1'), 'aspect-square');
  assert.equal(getAspectRatioStyle('21:9'), 'aspect-[21/9]');
});

test('sanitizeFilename produces safe, clean filenames', () => {
  const name = sanitizeFilename('Rainy Cyberpunk Lo-Fi 4K!!', 'abc123xyz');
  assert.equal(name, 'aurawall-rainy-cyberpunk-lo-fi-4k-abc123.png');
});

test('generateThemedWallpaperSvg produces valid data URL with dimensions', () => {
  const svgUrl = generateThemedWallpaperSvg('rainy cyberpunk lo-fi', 0, '9:16');
  assert.ok(svgUrl.startsWith('data:image/svg+xml;utf8,'));
  const decoded = decodeURIComponent(svgUrl);
  assert.ok(decoded.includes('<svg'));
  assert.ok(decoded.includes('viewBox="0 0 900 1600"'));
});
