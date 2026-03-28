// src/components/editor/CopyEditorApp.js - Copy editor with section-by-section screenshot references, autosave, export, and reset.
import { html, useEffect, useMemo, useState } from '../../lib/browserReact.js';
import {
  STORAGE_KEYS,
  buildExportPayload,
  createCopyEditorState,
  deepClone,
  resetCopyEditorState,
} from '../../lib/editorState.js';
import { ActionButton, TextArea, TextInput, TogglePill } from './formControls.js';
import { SectionCard } from './SectionCard.js';

const SECTION_SCREENSHOTS = {
  desktop: {
    hero: '/assets/editor-sections/hero.png',
    specialty: '/assets/editor-sections/specialty.png',
    events: '/assets/editor-sections/events.png',
    quote: '/assets/editor-sections/quote.png',
    gallery: '/assets/editor-sections/gallery.png',
    contact: '/assets/editor-sections/contact.png',
    footer: '/assets/editor-sections/footer.png',
  },
  mobile: {
    hero: '/assets/editor-sections/hero-mobile.png',
    specialty: '/assets/editor-sections/specialty-mobile.png',
    events: '/assets/editor-sections/events-mobile.png',
    quote: '/assets/editor-sections/quote.png',
    gallery: '/assets/editor-sections/gallery-mobile.png',
    contact: '/assets/editor-sections/contact-mobile.png',
    footer: '/assets/editor-sections/footer.png',
  },
};

function readStoredJson(key) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (_error) {
    return null;
  }
}

function saveStoredJson(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function downloadJson(filename, payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(objectUrl);
}

function setPath(target, path, value) {
  const keys = Array.isArray(path) ? path : path.split('.');
  const lastKey = keys.at(-1);
  let cursor = target;

  for (const key of keys.slice(0, -1)) {
    cursor = cursor[key];
  }

  cursor[lastKey] = value;
}

function linesToArray(value) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

function CopyEditorSection({ children, ...props }) {
  return SectionCard({ ...props, children });
}

function ScreenshotReference({ imageSrc, imageAlt, device }) {
  return html`
    <div className="space-y-3">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--color-dorado)]">Referencia visual</p>
        <p className="mt-1 text-xs leading-5 text-[color:rgba(44,27,24,0.58)]">
          Screenshot actual del sitio en ${device === 'mobile' ? 'movil' : 'desktop'}.
        </p>
      </div>
      <div className=${`reference-shot ${device === 'mobile' ? 'reference-shot--mobile' : ''}`}>
        <img src=${imageSrc} alt=${imageAlt} className="block h-auto w-full" loading="lazy" />
      </div>
    </div>
  `;
}

function EditorSectionLayout({ sectionKey, device, imageAlt, children, ...props }) {
  const imageSrc = SECTION_SCREENSHOTS[device][sectionKey];

  return html`
    <${CopyEditorSection} ...${props}>
      <div className="editor-split">
        <div className="space-y-4">${children}</div>
        <${ScreenshotReference} imageSrc=${imageSrc} imageAlt=${imageAlt} device=${device} />
      </div>
    </${CopyEditorSection}>
  `;
}

function FeatureFields({ content, updateValue }) {
  return content.specialty.features.map(
    (feature, index) => html`
      <div className="rounded-[1.25rem] border border-[rgba(44,27,24,0.08)] p-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <${TextInput} label=${`Feature ${index + 1} titulo`} value=${feature.title} onChange=${(value) => updateValue(['specialty', 'features', index, 'title'], value)} />
          <${TextInput} label=${`Feature ${index + 1} numero`} value=${feature.number} onChange=${(value) => updateValue(['specialty', 'features', index, 'number'], value)} />
        </div>
        <div className="mt-4">
          <${TextArea} label=${`Feature ${index + 1} descripcion`} rows=${3} value=${feature.body} onChange=${(value) => updateValue(['specialty', 'features', index, 'body'], value)} />
        </div>
      </div>
    `,
  );
}

function EventCardFields({ content, updateLines, updateValue }) {
  return content.events.cards.map(
    (card, index) => html`
      <div className="rounded-[1.25rem] border border-[rgba(44,27,24,0.08)] p-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <${TextInput} label=${`Tarjeta ${index + 1} titulo`} value=${card.title} onChange=${(value) => updateValue(['events', 'cards', index, 'title'], value)} />
          <${TextInput} label=${`Tarjeta ${index + 1} badge`} value=${card.badge} onChange=${(value) => updateValue(['events', 'cards', index, 'badge'], value)} />
        </div>
        <div className="mt-4 space-y-4">
          <${TextArea} label="Descripcion" rows=${4} value=${card.body} onChange=${(value) => updateValue(['events', 'cards', index, 'body'], value)} />
          <${TextArea}
            label="Bullets (uno por linea)"
            rows=${4}
            value=${card.bullets.join('\n')}
            onChange=${(value) => updateLines(['events', 'cards', index, 'bullets'], value)}
          />
        </div>
      </div>
    `,
  );
}

function FooterLocationFields({ content, updateValue }) {
  return content.footer.locations.map(
    (location, index) => html`
      <div className="rounded-[1.25rem] border border-[rgba(44,27,24,0.08)] p-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <${TextInput} label="Ciudad" value=${location.city} onChange=${(value) => updateValue(['footer', 'locations', index, 'city'], value)} />
          <${TextInput} label="Sede" value=${location.venue} onChange=${(value) => updateValue(['footer', 'locations', index, 'venue'], value)} />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <${TextInput} label="Direccion" value=${location.address} onChange=${(value) => updateValue(['footer', 'locations', index, 'address'], value)} />
          <${TextInput} label="Horario" value=${location.hours} onChange=${(value) => updateValue(['footer', 'locations', index, 'hours'], value)} />
        </div>
      </div>
    `,
  );
}

export function CopyEditorApp() {
  const storedEditorDraft = useMemo(() => readStoredJson(STORAGE_KEYS.copyEditor), []);
  const storedIntakeDraft = useMemo(() => readStoredJson(STORAGE_KEYS.intake), []);
  const [content, setContent] = useState(() => createCopyEditorState(storedEditorDraft, storedIntakeDraft));
  const [device, setDevice] = useState('desktop');

  useEffect(() => {
    saveStoredJson(STORAGE_KEYS.copyEditor, content);
  }, [content]);

  function updateValue(path, value) {
    setContent((current) => {
      const next = deepClone(current);
      setPath(next, path, value);
      return next;
    });
  }

  function updateLines(path, value) {
    updateValue(path, linesToArray(value));
  }

  function exportJson() {
    const payload = buildExportPayload('copy-editor', content);
    downloadJson('ameno-copy-editor-export.json', payload);
  }

  function resetDefaults() {
    const confirmed = window.confirm('Esto reemplazara el borrador actual con el copy original del sitio. ¿Continuar?');
    if (!confirmed) {
      return;
    }

    setContent(resetCopyEditorState());
    window.localStorage.removeItem(STORAGE_KEYS.copyEditor);
  }

  function applyIntakeDraft() {
    setContent(createCopyEditorState(null, storedIntakeDraft));
  }

  const intakeAvailable = Boolean(storedIntakeDraft);

  return html`
    <div className="app-shell">
      <header className="mx-auto max-w-7xl px-5 py-8 md:px-6 md:py-10">
        <div className="panel-card flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--color-dorado)]">Copy Editor</p>
            <div className="space-y-2">
              <h1 className="ameno-serif text-4xl leading-tight md:text-5xl">Edita cada seccion con su screenshot al lado</h1>
              <p className="max-w-3xl text-sm leading-7 text-[color:rgba(44,27,24,0.68)]">
                Cada bloque muestra una captura de referencia de la landing actual para que el cliente escriba sobre algo concreto, sin perder contexto visual ni recorrer un preview largo.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            ${intakeAvailable ? html`<${ActionButton} label="Aplicar intake guardado" variant="secondary" onClick=${applyIntakeDraft} />` : null}
            <${ActionButton} label="Exportar JSON" variant="secondary" onClick=${exportJson} />
            <${ActionButton} label="Reset a copy original" variant="ghost" onClick=${resetDefaults} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl gap-6 px-5 pb-10 md:px-6 xl:flex xl:items-start">
        <aside className="space-y-6 xl:w-96 xl:flex-none">
          <${CopyEditorSection}
            eyebrow="Control"
            title="Secciones y referencias"
            description="Activa u oculta bloques opcionales del editor y cambia la referencia visual entre desktop y movil."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <${TogglePill} label="Barra de especialidad" checked=${content.visibility.specialty} onToggle=${() => updateValue('visibility.specialty', !content.visibility.specialty)} />
              <${TogglePill} label="Eventos" checked=${content.visibility.events} onToggle=${() => updateValue('visibility.events', !content.visibility.events)} />
              <${TogglePill} label="Frase" checked=${content.visibility.quote} onToggle=${() => updateValue('visibility.quote', !content.visibility.quote)} />
              <${TogglePill} label="Galeria" checked=${content.visibility.gallery} onToggle=${() => updateValue('visibility.gallery', !content.visibility.gallery)} />
              <${TogglePill} label="Cotizacion" checked=${content.visibility.contact} onToggle=${() => updateValue('visibility.contact', !content.visibility.contact)} />
              <${TogglePill} label="Footer" checked=${content.visibility.footer} onToggle=${() => updateValue('visibility.footer', !content.visibility.footer)} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <${ActionButton} label="Referencia desktop" variant=${device === 'desktop' ? 'primary' : 'secondary'} onClick=${() => setDevice('desktop')} />
              <${ActionButton} label="Referencia movil" variant=${device === 'mobile' ? 'primary' : 'secondary'} onClick=${() => setDevice('mobile')} />
            </div>
            <p className="text-xs leading-6 text-[color:rgba(44,27,24,0.56)]">Autosave local activo. Los screenshots son referencias fijas tomadas de la landing actual.</p>
          </${CopyEditorSection}>
        </aside>

        <section className="space-y-6 xl:min-w-0 xl:flex-1">
          <${EditorSectionLayout}
            sectionKey="hero"
            device=${device}
            eyebrow="Hero"
            title="Inicio"
            description="Ajusta la promesa principal y los CTAs sin perder la composicion actual."
            imageAlt="Screenshot de la seccion hero de Ameno Cafe"
          >
            <${TextInput} label="Eyebrow" value=${content.hero.eyebrow} onChange=${(value) => updateValue('hero.eyebrow', value)} />
            <${TextInput} label="Titulo linea 1" value=${content.hero.titleLineOne} onChange=${(value) => updateValue('hero.titleLineOne', value)} />
            <${TextInput} label="Palabra destacada" value=${content.hero.titleAccent} onChange=${(value) => updateValue('hero.titleAccent', value)} />
            <${TextInput} label="Titulo linea 2" value=${content.hero.titleLineTwo} onChange=${(value) => updateValue('hero.titleLineTwo', value)} />
            <${TextArea} label="Descripcion" rows=${4} value=${content.hero.body} onChange=${(value) => updateValue('hero.body', value)} />
            <div className="grid gap-4 sm:grid-cols-2">
              <${TextInput} label="CTA principal" value=${content.hero.primaryCta} onChange=${(value) => updateValue('hero.primaryCta', value)} />
              <${TextInput} label="CTA secundario" value=${content.hero.secondaryCta} onChange=${(value) => updateValue('hero.secondaryCta', value)} />
            </div>
          </${EditorSectionLayout}>

          ${content.visibility.specialty
            ? html`
                <${EditorSectionLayout}
                  sectionKey="specialty"
                  device=${device}
                  eyebrow="Especialidad"
                  title="Barra de especialidad"
                  description="Edita el bloque que explica el producto central."
                  imageAlt="Screenshot de la seccion barra de especialidad"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <${TextInput} label="Titulo lead" value=${content.specialty.titleLead} onChange=${(value) => updateValue('specialty.titleLead', value)} />
                    <${TextInput} label="Linea dos" value=${content.specialty.titleLineTwo} onChange=${(value) => updateValue('specialty.titleLineTwo', value)} />
                  </div>
                  <${TextInput} label="Acento" value=${content.specialty.titleAccent} onChange=${(value) => updateValue('specialty.titleAccent', value)} />
                  <${TextArea} label="Descripcion" rows=${5} value=${content.specialty.body} onChange=${(value) => updateValue('specialty.body', value)} />
                  <${TextInput} label="Badge" value=${content.specialty.badge} onChange=${(value) => updateValue('specialty.badge', value)} />
                  <${FeatureFields} content=${content} updateValue=${updateValue} />
                </${EditorSectionLayout}>
              `
            : null}

          ${content.visibility.events
            ? html`
                <${EditorSectionLayout}
                  sectionKey="events"
                  device=${device}
                  eyebrow="Eventos"
                  title="Catering premium"
                  description="Edita el intro y cada tarjeta de servicio."
                  imageAlt="Screenshot de la seccion eventos"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <${TextInput} label="Titulo lead" value=${content.events.titleLead} onChange=${(value) => updateValue('events.titleLead', value)} />
                    <${TextInput} label="Titulo acento" value=${content.events.titleAccent} onChange=${(value) => updateValue('events.titleAccent', value)} />
                  </div>
                  <${TextArea} label="Descripcion" rows=${4} value=${content.events.body} onChange=${(value) => updateValue('events.body', value)} />
                  <${EventCardFields} content=${content} updateLines=${updateLines} updateValue=${updateValue} />
                </${EditorSectionLayout}>
              `
            : null}

          ${content.visibility.quote
            ? html`
                <${EditorSectionLayout}
                  sectionKey="quote"
                  device=${device}
                  eyebrow="Frase"
                  title="Frase divisoria"
                  description="Edita el momento editorial que separa la oferta de la galeria."
                  imageAlt="Screenshot de la frase divisoria"
                >
                  <${TextArea} label="Frase principal" rows=${3} value=${content.quote.text} onChange=${(value) => updateValue('quote.text', value)} />
                  <${TextInput} label="Palabra a destacar" value=${content.quote.accent} onChange=${(value) => updateValue('quote.accent', value)} />
                </${EditorSectionLayout}>
              `
            : null}

          ${content.visibility.gallery
            ? html`
                <${EditorSectionLayout}
                  sectionKey="gallery"
                  device=${device}
                  eyebrow="Galeria"
                  title="Galeria"
                  description="Solo ajusta el copy de entrada para no complicar la edicion de assets."
                  imageAlt="Screenshot de la seccion galeria"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <${TextInput} label="Galeria lead" value=${content.gallery.titleLead} onChange=${(value) => updateValue('gallery.titleLead', value)} />
                    <${TextInput} label="Galeria acento" value=${content.gallery.titleAccent} onChange=${(value) => updateValue('gallery.titleAccent', value)} />
                  </div>
                </${EditorSectionLayout}>
              `
            : null}

          ${content.visibility.contact
            ? html`
                <${EditorSectionLayout}
                  sectionKey="contact"
                  device=${device}
                  eyebrow="Contacto"
                  title="Cotizacion"
                  description="Ajusta el cierre comercial y el lenguaje del contacto."
                  imageAlt="Screenshot de la seccion de cotizacion"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <${TextInput} label="Contacto lead" value=${content.contact.titleLead} onChange=${(value) => updateValue('contact.titleLead', value)} />
                    <${TextInput} label="Contacto linea dos" value=${content.contact.titleLineTwo} onChange=${(value) => updateValue('contact.titleLineTwo', value)} />
                  </div>
                  <${TextInput} label="Contacto acento" value=${content.contact.titleAccent} onChange=${(value) => updateValue('contact.titleAccent', value)} />
                  <${TextArea} label="Descripcion de contacto" rows=${4} value=${content.contact.body} onChange=${(value) => updateValue('contact.body', value)} />
                  <${TextArea}
                    label="Beneficios (uno por linea)"
                    rows=${3}
                    value=${content.contact.benefits.join('\n')}
                    onChange=${(value) => updateLines(['contact', 'benefits'], value)}
                  />
                  <${TextArea}
                    label="Tipos de evento (uno por linea)"
                    rows=${3}
                    value=${content.contact.eventTypes.join('\n')}
                    onChange=${(value) => updateLines(['contact', 'eventTypes'], value)}
                  />
                  <${TextArea} label="Mensaje preview" rows=${4} value=${content.contact.responseNote} onChange=${(value) => updateValue('contact.responseNote', value)} />
                  <${TextInput} label="CTA de WhatsApp" value=${content.contact.ctaLabel} onChange=${(value) => updateValue('contact.ctaLabel', value)} />
                </${EditorSectionLayout}>
              `
            : null}

          ${content.visibility.footer
            ? html`
                <${EditorSectionLayout}
                  sectionKey="footer"
                  device=${device}
                  eyebrow="Footer"
                  title="Remate final"
                  description="Edita el cierre institucional y la informacion util del pie de pagina."
                  imageAlt="Screenshot del footer"
                >
                  <${TextArea} label="Footer descripcion" rows=${4} value=${content.footer.body} onChange=${(value) => updateValue('footer.body', value)} />
                  <${FooterLocationFields} content=${content} updateValue=${updateValue} />
                  <${TextInput} label="WhatsApp" value=${content.brand.whatsappNumber} onChange=${(value) => updateValue('brand.whatsappNumber', value)} />
                  <${TextInput} label="Instagram" value=${content.brand.socialLinks.instagram} onChange=${(value) => updateValue('brand.socialLinks.instagram', value)} />
                </${EditorSectionLayout}>
              `
            : null}
        </section>
      </main>
    </div>
  `;
}
