// src/lib/editorState.js - Shared merge, reset, autosave, intake mapping, and export helpers for authoring routes.
import { DEFAULT_CLIENT_INTAKE } from '../data/clientIntake.js';
import { DEFAULT_SITE_CONTENT } from '../data/siteContent.js';

export const STORAGE_KEYS = {
  intake: 'ameno-client-intake-v1',
  copyEditor: 'ameno-copy-editor-v1',
};

export const NETLIFY_DRAFT_FORM_NAME = 'ameno-client-drafts';

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

function mergeKnownFields(defaults, overrides) {
  if (Array.isArray(defaults)) {
    return Array.isArray(overrides) ? deepClone(overrides) : deepClone(defaults);
  }

  if (!isPlainObject(defaults)) {
    return overrides === undefined ? defaults : overrides;
  }

  const result = {};
  const source = isPlainObject(overrides) ? overrides : {};

  for (const key of Object.keys(defaults)) {
    result[key] = mergeKnownFields(defaults[key], source[key]);
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
  const intake = mergeKnownFields(DEFAULT_CLIENT_INTAKE, intakeDraft ?? {});
  const mapped = {};

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

  return mapped;
}

export function createCopyEditorState(savedDraft = null, intakeDraft = null) {
  const fromDefaults = deepClone(DEFAULT_SITE_CONTENT);
  const fromIntake = intakeDraft ? mapIntakeToContent(intakeDraft) : {};
  const withIntake = mergeWithDefaults(fromDefaults, fromIntake);
  return mergeWithDefaults(withIntake, savedDraft ?? {});
}

export function createClientIntakeState(savedDraft = null) {
  return mergeKnownFields(DEFAULT_CLIENT_INTAKE, savedDraft ?? {});
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

function pickTrimmedValue(...values) {
  for (const value of values) {
    if (typeof value !== 'string') {
      continue;
    }

    const trimmed = value.trim();
    if (trimmed) {
      return trimmed;
    }
  }

  return '';
}

export function buildNetlifyDraftSubmission({
  draftType,
  payload,
  sourceRoute,
  draftLabel = '',
  businessName = '',
  contactName = '',
  contactEmail = '',
  whatsapp = '',
}) {
  const exportPayload = buildExportPayload(draftType, payload);
  const resolvedBusinessName = pickTrimmedValue(
    businessName,
    payload?.business?.businessName,
    payload?.brand?.legalName,
    payload?.brand?.name,
  );
  const resolvedContactName = pickTrimmedValue(contactName, payload?.business?.ownerName);
  const resolvedContactEmail = pickTrimmedValue(contactEmail, payload?.contact?.email);
  const resolvedWhatsapp = pickTrimmedValue(whatsapp, payload?.contact?.whatsapp, payload?.brand?.whatsappNumber);

  return {
    'form-name': NETLIFY_DRAFT_FORM_NAME,
    draftType,
    sourceRoute,
    draftLabel: draftLabel.trim(),
    businessName: resolvedBusinessName,
    contactName: resolvedContactName,
    contactEmail: resolvedContactEmail,
    whatsapp: resolvedWhatsapp,
    payloadJson: JSON.stringify(exportPayload, null, 2),
  };
}

export function resolveDraftSaveEndpoint(sourceRoute) {
  const trimmed = typeof sourceRoute === 'string' ? sourceRoute.trim() : '';

  if (!trimmed) {
    return '/';
  }

  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}
