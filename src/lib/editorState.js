// src/lib/editorState.js - Shared merge, reset, autosave, intake mapping, and export helpers for authoring routes.
import { DEFAULT_CLIENT_INTAKE } from '../data/clientIntake.js';
import { DEFAULT_SITE_CONTENT } from '../data/siteContent.js';

export const STORAGE_KEYS = {
  intake: 'ameno-client-intake-v1',
  copyEditor: 'ameno-copy-editor-v1',
};

function isPlainObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

export function deepClone(value) {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value));
}

export function mergeWithDefaults(defaults, overrides) {
  if (Array.isArray(defaults)) {
    return Array.isArray(overrides) ? deepClone(overrides) : deepClone(defaults);
  }

  if (!isPlainObject(defaults)) {
    return overrides === undefined ? defaults : overrides;
  }

  const result = {};
  const source = isPlainObject(overrides) ? overrides : {};

  for (const key of Object.keys(defaults)) {
    result[key] = mergeWithDefaults(defaults[key], source[key]);
  }

  for (const [key, value] of Object.entries(source)) {
    if (!(key in result)) {
      result[key] = deepClone(value);
    }
  }

  return result;
}

function setIfPresent(target, key, value) {
  const nextValue = typeof value === 'string' ? value.trim() : value;
  if (!nextValue) {
    return;
  }

  target[key] = nextValue;
}

export function mapIntakeToContent(intakeDraft) {
  const intake = mergeWithDefaults(DEFAULT_CLIENT_INTAKE, intakeDraft ?? {});
  const mapped = {};
  const preferredCopy = intake.preferredCopy;

  if (intake.business.businessName || intake.socialLinks.instagram || intake.contact.whatsapp) {
    mapped.brand = {};
    setIfPresent(mapped.brand, 'legalName', intake.business.businessName);
    setIfPresent(mapped.brand, 'name', intake.business.businessName);
    setIfPresent(mapped.brand, 'whatsappNumber', intake.contact.whatsapp);

    mapped.brand.socialLinks = {};
    setIfPresent(mapped.brand.socialLinks, 'instagram', intake.socialLinks.instagram);
    setIfPresent(mapped.brand.socialLinks, 'facebook', intake.socialLinks.facebook);
    setIfPresent(mapped.brand.socialLinks, 'tiktok', intake.socialLinks.tiktok);
  }

  mapped.hero = {};
  setIfPresent(mapped.hero, 'eyebrow', preferredCopy.heroEyebrow);
  setIfPresent(mapped.hero, 'titleLineOne', preferredCopy.heroTitleLead);
  setIfPresent(mapped.hero, 'titleAccent', preferredCopy.heroTitleAccent);
  setIfPresent(mapped.hero, 'titleLineTwo', preferredCopy.heroTitleTail);
  setIfPresent(mapped.hero, 'body', preferredCopy.heroBody);

  mapped.specialty = {};
  setIfPresent(mapped.specialty, 'titleLead', preferredCopy.specialtyTitleLead);
  setIfPresent(mapped.specialty, 'titleAccent', preferredCopy.specialtyTitleAccent);
  setIfPresent(mapped.specialty, 'body', preferredCopy.specialtyBody);

  mapped.events = {};
  setIfPresent(mapped.events, 'titleLead', preferredCopy.eventsTitleLead);
  setIfPresent(mapped.events, 'titleAccent', preferredCopy.eventsTitleAccent);
  setIfPresent(mapped.events, 'body', preferredCopy.eventsBody);

  mapped.quote = {};
  setIfPresent(mapped.quote, 'text', preferredCopy.quoteText);

  mapped.gallery = {};
  setIfPresent(mapped.gallery, 'titleLead', preferredCopy.galleryTitleLead);
  setIfPresent(mapped.gallery, 'titleAccent', preferredCopy.galleryTitleAccent);

  mapped.contact = {};
  setIfPresent(mapped.contact, 'titleLead', preferredCopy.contactTitleLead);
  setIfPresent(mapped.contact, 'titleAccent', preferredCopy.contactTitleAccent);
  setIfPresent(mapped.contact, 'body', preferredCopy.contactBody);

  mapped.footer = {};
  setIfPresent(mapped.footer, 'body', preferredCopy.footerBody);

  return mapped;
}

export function createCopyEditorState(savedDraft = null, intakeDraft = null) {
  const fromDefaults = deepClone(DEFAULT_SITE_CONTENT);
  const fromIntake = intakeDraft ? mapIntakeToContent(intakeDraft) : {};
  const withIntake = mergeWithDefaults(fromDefaults, fromIntake);
  return mergeWithDefaults(withIntake, savedDraft ?? {});
}

export function createClientIntakeState(savedDraft = null) {
  return mergeWithDefaults(DEFAULT_CLIENT_INTAKE, savedDraft ?? {});
}

export function resetCopyEditorState() {
  return deepClone(DEFAULT_SITE_CONTENT);
}

export function resetClientIntakeState() {
  return deepClone(DEFAULT_CLIENT_INTAKE);
}

export function buildExportPayload(type, payload) {
  return {
    exportType: type,
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    payload: deepClone(payload),
  };
}
