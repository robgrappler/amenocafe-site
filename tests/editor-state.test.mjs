// tests/editor-state.test.mjs - Node tests for the shared content merge and export helpers.
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildExportPayload,
  createClientIntakeState,
  createCopyEditorState,
  mapIntakeToContent,
  resetCopyEditorState,
} from '../src/lib/editorState.js';

test('createCopyEditorState preserves defaults while merging saved nested fields', () => {
  const state = createCopyEditorState({
    hero: {
      titleLineOne: 'Nuevo titular',
    },
    footer: {
      locations: [{ city: 'Acayucan', venue: 'Evento privado', address: '', hours: 'Sabados' }],
    },
  });

  assert.equal(state.hero.titleLineOne, 'Nuevo titular');
  assert.equal(state.hero.titleAccent, 'la Calma');
  assert.equal(state.footer.locations[0].city, 'Acayucan');
  assert.equal(state.events.cards[1].title, 'Eventos Corporativos');
});

test('mapIntakeToContent maps preferred copy fields into content overrides', () => {
  const mapped = mapIntakeToContent({
    business: {
      businessName: 'Cafe Nuevo',
    },
    contact: {
      whatsapp: '5215511111111',
    },
    preferredCopy: {
      heroTitleLead: 'Cafe con calma',
      heroTitleAccent: 'hecho',
      heroTitleTail: 'a tu manera',
      quoteText: 'Cada taza empieza una conversacion.',
      footerBody: 'Barra movil de especialidad para eventos y pop-ups.',
    },
  });

  assert.equal(mapped.brand.name, 'Cafe Nuevo');
  assert.equal(mapped.brand.whatsappNumber, '5215511111111');
  assert.equal(mapped.hero.titleLineOne, 'Cafe con calma');
  assert.equal(mapped.quote.text, 'Cada taza empieza una conversacion.');
  assert.equal(mapped.footer.body, 'Barra movil de especialidad para eventos y pop-ups.');
});

test('createClientIntakeState keeps defaults for unspecified sections', () => {
  const state = createClientIntakeState({
    contact: {
      email: 'hola@ameno.test',
    },
  });

  assert.equal(state.contact.email, 'hola@ameno.test');
  assert.equal(state.business.businessName, 'Ameno Cafe');
  assert.equal(state.socialLinks.instagram, 'https://www.instagram.com/_amenocafe/');
});

test('resetCopyEditorState returns a fresh default object', () => {
  const one = resetCopyEditorState();
  const two = resetCopyEditorState();

  one.hero.titleLineOne = 'Cambio local';

  assert.equal(two.hero.titleLineOne, 'El Ritual del Grano,');
});

test('buildExportPayload wraps content with schema metadata', () => {
  const payload = buildExportPayload('copy-editor', { hero: { titleLineOne: 'Titulo' } });

  assert.equal(payload.exportType, 'copy-editor');
  assert.equal(payload.schemaVersion, 1);
  assert.equal(payload.payload.hero.titleLineOne, 'Titulo');
  assert.match(payload.exportedAt, /^\d{4}-\d{2}-\d{2}T/);
});
