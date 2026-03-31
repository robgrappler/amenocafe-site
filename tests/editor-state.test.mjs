// tests/editor-state.test.mjs - Node tests for the shared content merge and export helpers.
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildExportPayload,
  buildNetlifyDraftSubmission,
  createClientIntakeState,
  createCopyEditorState,
  mapIntakeToContent,
  NETLIFY_DRAFT_FORM_NAME,
  resolveDraftSaveEndpoint,
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

test('mapIntakeToContent maps business and contact context into content overrides', () => {
  const mapped = mapIntakeToContent({
    business: {
      businessName: 'Cafe Nuevo',
    },
    contact: {
      whatsapp: '5215511111111',
    },
    socialLinks: {
      instagram: 'https://instagram.com/cafenuevo',
    },
  });

  assert.equal(mapped.brand.name, 'Cafe Nuevo');
  assert.equal(mapped.brand.whatsappNumber, '5215511111111');
  assert.equal(mapped.brand.socialLinks.instagram, 'https://instagram.com/cafenuevo');
  assert.equal(mapped.hero, undefined);
  assert.equal(mapped.quote, undefined);
});

test('createClientIntakeState keeps defaults for unspecified sections and drops legacy preferred copy data', () => {
  const state = createClientIntakeState({
    contact: {
      email: 'hola@ameno.test',
    },
    preferredCopy: {
      heroTitleLead: 'Texto viejo',
    },
  });

  assert.equal(state.contact.email, 'hola@ameno.test');
  assert.equal(state.business.businessName, 'Ameno Cafe');
  assert.equal(state.socialLinks.instagram, 'https://www.instagram.com/_amenocafe/');
  assert.equal('preferredCopy' in state, false);
});

test('createCopyEditorState ignores legacy preferred copy values from intake drafts', () => {
  const state = createCopyEditorState(null, {
    business: {
      businessName: 'Cafe Nuevo',
    },
    preferredCopy: {
      heroTitleLead: 'Cafe con calma',
      quoteText: 'Cada taza empieza una conversacion.',
    },
  });

  assert.equal(state.brand.name, 'Cafe Nuevo');
  assert.equal(state.hero.titleLineOne, 'El Ritual del Grano,');
  assert.equal(state.quote.text, 'No vendemos cafe. Creamos momentos que se quedan contigo.');
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

test('buildNetlifyDraftSubmission packages draft metadata and JSON payload for form posts', () => {
  const submission = buildNetlifyDraftSubmission({
    draftType: 'client-intake',
    payload: {
      business: {
        businessName: '  Cafe Nuevo  ',
      },
      contact: {
        email: '  hola@cafenuevo.mx ',
        whatsapp: ' 5215511111111 ',
      },
    },
    sourceRoute: '/client-intake/',
    draftLabel: '  Brief inicial ',
    contactName: '  Ana ',
  });

  assert.equal(submission['form-name'], NETLIFY_DRAFT_FORM_NAME);
  assert.equal(submission.draftType, 'client-intake');
  assert.equal(submission.sourceRoute, '/client-intake/');
  assert.equal(submission.draftLabel, 'Brief inicial');
  assert.equal(submission.businessName, 'Cafe Nuevo');
  assert.equal(submission.contactName, 'Ana');
  assert.equal(submission.contactEmail, 'hola@cafenuevo.mx');
  assert.equal(submission.whatsapp, '5215511111111');

  const parsedPayload = JSON.parse(submission.payloadJson);
  assert.equal(parsedPayload.exportType, 'client-intake');
  assert.equal(parsedPayload.payload.business.businessName, '  Cafe Nuevo  ');
});

test('resolveDraftSaveEndpoint normalizes route paths for Netlify form posts', () => {
  assert.equal(resolveDraftSaveEndpoint('/client-intake/'), '/client-intake/');
  assert.equal(resolveDraftSaveEndpoint('copy-editor/'), '/copy-editor/');
  assert.equal(resolveDraftSaveEndpoint(''), '/');
  assert.equal(resolveDraftSaveEndpoint(), '/');
});
