// src/data/clientIntake.js - Default client onboarding intake schema for the Ameno Cafe authoring workflow.
export const DEFAULT_CLIENT_INTAKE = {
  schemaVersion: 1,
  business: {
    businessName: 'Ameno Cafe',
    ownerName: '',
    businessSummary: '',
    cityAndRegion: 'Minatitlán y Coatzacoalcos, Veracruz',
    targetAudience: '',
    differentiators: '',
  },
  contact: {
    email: '',
    phone: '',
    whatsapp: '',
    preferredContactMethod: '',
  },
  socialLinks: {
    instagram: 'https://www.instagram.com/_amenocafe/',
    facebook: '',
    tiktok: '',
    website: '',
  },
  hours: {
    regularHours: '',
    eventAvailability: '',
    bookingLeadTime: '',
  },
  offerings: {
    productsAndServices: '',
    signatureItems: '',
    pricingNotes: '',
  },
  voice: {
    brandTone: '',
    wordsToUse: '',
    wordsToAvoid: '',
  },
  requests: {
    requiredChanges: '',
    prioritySections: '',
    mustKeep: '',
  },
  notesAndAssets: {
    notes: '',
    linksToAssets: '',
    photoRequests: '',
    approvalStatus: '',
  },
};
