// tests/copy-editor-assets.test.mjs - Verifies that screenshot reference assets required by the copy editor exist.
import test from 'node:test';
import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';

const REQUIRED_ASSETS = [
  'assets/editor-sections/hero.png',
  'assets/editor-sections/specialty.png',
  'assets/editor-sections/events.png',
  'assets/editor-sections/quote.png',
  'assets/editor-sections/gallery.png',
  'assets/editor-sections/contact.png',
  'assets/editor-sections/footer.png',
  'assets/editor-sections/hero-mobile.png',
  'assets/editor-sections/specialty-mobile.png',
  'assets/editor-sections/events-mobile.png',
  'assets/editor-sections/gallery-mobile.png',
  'assets/editor-sections/contact-mobile.png',
];

test('copy editor screenshot assets exist', async () => {
  await Promise.all(
    REQUIRED_ASSETS.map(async (assetPath) => {
      await access(assetPath);
      assert.ok(true, assetPath);
    }),
  );
});
