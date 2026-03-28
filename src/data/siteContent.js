// src/data/siteContent.js - Default editable content schema for the Ameno Cafe site preview.
export const DEFAULT_SITE_CONTENT = {
  schemaVersion: 1,
  brand: {
    name: 'Ameno Cafe',
    legalName: 'Ameno Cafe',
    locationsLabel: 'Minatitlan y Coatzacoalcos, Veracruz',
    logoAlt: 'Ameno Cafe',
    whatsappNumber: '5215578688247',
    socialLinks: {
      instagram: 'https://www.instagram.com/_amenocafe/',
      facebook: '',
      tiktok: '',
    },
  },
  visibility: {
    specialty: true,
    events: true,
    quote: true,
    gallery: true,
    contact: true,
    footer: true,
  },
  nav: {
    links: [
      { label: 'Especialidad', href: '#especialidad' },
      { label: 'Eventos', href: '#eventos' },
      { label: 'Galeria', href: '#galeria' },
      { label: 'Cotizar', href: '#cotizar' },
    ],
    ctaLabel: 'Cotizar Evento',
    ctaHref: '#cotizar',
  },
  hero: {
    eyebrow: 'Minatitlan y Coatzacoalcos - Tostaduria de Especialidad',
    titleLineOne: 'El Ritual del Grano,',
    titleAccent: 'la Calma',
    titleLineTwo: 'del Momento.',
    body:
      'Una experiencia sensorial donde cada taza cuenta una historia. Del campo veracruzano a tu paladar, con el cuidado que solo lo artesanal puede ofrecer.',
    primaryCta: 'Descubre la Barra',
    primaryCtaHref: '#especialidad',
    secondaryCta: 'Cotizar Evento',
    secondaryCtaHref: '#cotizar',
    heroArtAlt: 'Ilustracion ceremonial de cafe para Ameno Cafe',
  },
  specialty: {
    eyebrow: 'Barra de Especialidad',
    titleLead: 'Donde cada',
    titleLineTwo: 'taza es un',
    titleAccent: 'ritual',
    body:
      'Nuestra barra no es solo un mostrador: es un escenario. Aqui, el barista se convierte en narrador y cada metodo de extraccion, origen del grano y aroma cuenta la historia del cafe veracruzano en su maxima expresion.',
    badge: 'Minatitlan, Ver.',
    imageAlt: 'Equipo Ameno Cafe en la barra de especialidad',
    features: [
      {
        number: '01',
        title: 'Granos de Origen Unico',
        body: 'Seleccion directa de fincas veracruzanas con trazabilidad completa.',
      },
      {
        number: '02',
        title: 'Tueste Artesanal',
        body: 'Perfiles de tueste desarrollados para resaltar notas unicas de cada lote.',
      },
      {
        number: '03',
        title: 'Metodos de Extraccion',
        body: 'V60, Chemex, AeroPress y espresso: cada metodo revela un caracter distinto.',
      },
    ],
  },
  events: {
    eyebrow: 'Catering Premium',
    titleLead: 'Elevamos tus',
    titleAccent: 'Eventos',
    body:
      'Del campo veracruzano a tu evento. Llevamos la experiencia completa de nuestra barra de especialidad a los momentos que mas importan.',
    cards: [
      {
        title: 'Bodas',
        body:
          'Tu dia merece un cafe a la altura. Montamos una barra elegante que se integra con la estetica de tu celebracion, desde la ceremonia hasta el ultimo brindis.',
        bullets: ['Barra personalizada', 'Baristas profesionales', 'Menu de bebidas a medida'],
        badge: '',
      },
      {
        title: 'Eventos Corporativos',
        body:
          'Impresiona a clientes y colaboradores. Nuestra barra movil transforma cualquier reunion de negocios en una experiencia memorable que habla de tu marca.',
        bullets: ['Branding personalizable', 'Setup en 30 minutos', 'Desde 20 hasta 500+ personas'],
        badge: 'Popular',
      },
      {
        title: 'Reuniones Privadas',
        body:
          'Para esos momentos intimos que merecen algo especial. Catas privadas, cumpleanos selectos o simplemente una tarde entre amigos con cafe excepcional.',
        bullets: ['Catas guiadas', 'Experiencia personalizada', 'Grupos de 5 a 30 personas'],
        badge: '',
      },
    ],
  },
  quote: {
    text: 'No vendemos cafe. Creamos momentos que se quedan contigo.',
    accent: 'momentos',
  },
  gallery: {
    eyebrow: 'Galeria',
    titleLead: 'Nuestra',
    titleAccent: 'Esencia',
    items: [
      { src: '/assets/gallery-1.webp', alt: 'Preparacion de iced latte Ameno Cafe' },
      { src: '/assets/gallery-3.webp', alt: 'Bebida fria Ameno Cafe sostenida en mano' },
      { src: '/assets/gallery-2.webp', alt: 'Detalle de jarra sirviendo cafe sobre bebida fria' },
      { src: '/assets/gallery-5.webp', alt: 'Barra Ameno Cafe en montaje nocturno' },
      { src: '/assets/gallery-equipo.webp', alt: 'Equipo de Ameno Cafe posando con mandiles de la marca' },
      { src: '/assets/gallery-6.webp', alt: 'Barra iluminada de Ameno Cafe durante evento' },
      { src: '/assets/gallery-4.webp', alt: 'Barista de Ameno Cafe preparando bebida' },
    ],
  },
  contact: {
    eyebrow: 'Cotiza tu Evento',
    titleLead: 'Platicanos',
    titleLineTwo: 'tu',
    titleAccent: 'idea',
    body:
      'Cada evento es unico y merece una propuesta a la medida. Cuentanos que tienes en mente y te preparamos una cotizacion sin compromiso. Respondemos en menos de 24 horas.',
    benefits: ['Sin compromiso', 'Respuesta en <24h'],
    eventTypes: ['Boda', 'Evento Corporativo', 'Reunion Privada'],
    guestCountLabel: 'Numero de Personas',
    responseNote: 'Hola Ameno Cafe, me gustaria cotizar un evento tipo Evento Corporativo para 50 personas.',
    ctaLabel: 'Cotizar por WhatsApp',
  },
  footer: {
    body:
      'Tostaduria de especialidad y catering premium. Pop-ups en Minatitlan y Coatzacoalcos: cada taza, una historia veracruzana.',
    navLabel: 'Navegacion',
    locationsLabel: 'Encuentranos',
    locations: [
      {
        city: 'Minatitlan',
        venue: 'Restaurante Katz',
        address: 'Av. 18 de Octubre 93, Santa Clara',
        hours: 'Mar, Mie y Jue - 4:00 a 9:00 pm',
      },
      {
        city: 'Coatzacoalcos',
        venue: 'Pop-ups en sedes rotativas',
        address: '',
        hours: 'Vie, Sab y Dom - Siguenos en redes',
      },
    ],
    copyright: '© 2026 Ameno Cafe. Todos los derechos reservados.',
    creditPrefix: 'Disenado entre ritual, grano y detalle por',
    creditName: 'Nodo Alfa',
    creditUrl: 'https://nodoalfa.com',
  },
};

export const SITE_SECTION_KEYS = [
  'hero',
  'specialty',
  'events',
  'quote',
  'gallery',
  'contact',
  'footer',
];
