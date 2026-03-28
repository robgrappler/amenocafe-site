// src/components/editor/ClientIntakeApp.js - Client onboarding intake form with autosave, export, and handoff into the copy editor.
import { html, useEffect, useState } from '../../lib/browserReact.js';
import {
  STORAGE_KEYS,
  buildExportPayload,
  createClientIntakeState,
  deepClone,
  resetClientIntakeState,
} from '../../lib/editorState.js';
import { ActionButton, TextArea, TextInput } from './formControls.js';
import { SectionCard } from './SectionCard.js';

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

function IntakeSection({ children, ...props }) {
  return SectionCard({ ...props, children });
}

export function ClientIntakeApp() {
  const [intake, setIntake] = useState(() => createClientIntakeState(readStoredJson(STORAGE_KEYS.intake)));

  useEffect(() => {
    saveStoredJson(STORAGE_KEYS.intake, intake);
  }, [intake]);

  function updateValue(path, value) {
    setIntake((current) => {
      const next = deepClone(current);
      setPath(next, path, value);
      return next;
    });
  }

  function resetDraft() {
    const confirmed = window.confirm('Esto limpiara el formulario actual. ¿Continuar?');
    if (!confirmed) {
      return;
    }

    const next = resetClientIntakeState();
    setIntake(next);
    window.localStorage.removeItem(STORAGE_KEYS.intake);
  }

  function exportJson() {
    const payload = buildExportPayload('client-intake', intake);
    downloadJson('ameno-client-intake.json', payload);
  }

  function openEditor() {
    window.location.href = '/copy-editor/';
  }

  return html`
    <div className="app-shell">
      <header className="mx-auto max-w-7xl px-5 py-8 md:px-6 md:py-10">
        <div className="panel-card flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--color-dorado)]">Client Intake</p>
            <div className="space-y-2">
              <h1 className="ameno-serif text-4xl leading-tight md:text-5xl">Onboarding simple para aterrizar el nuevo copy</h1>
              <p className="max-w-3xl text-sm leading-7 text-[color:rgba(44,27,24,0.68)]">
                Este formulario guarda avances automaticamente. Cuando termines, exporta el JSON o abre el copy editor para revisar la redaccion directamente sobre el diseno actual.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <${ActionButton} label="Abrir copy editor" onClick=${openEditor} />
            <${ActionButton} label="Exportar intake JSON" variant="secondary" onClick=${exportJson} />
            <${ActionButton} label="Reset formulario" variant="ghost" onClick=${resetDraft} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-5 pb-10 md:px-6">
        <${IntakeSection}
          eyebrow="Base del negocio"
          title="Informacion principal"
          description="Cuanta mas claridad haya aqui, mas facil sera convertirla en copy util para el sitio."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <${TextInput} label="Nombre del negocio" value=${intake.business.businessName} onChange=${(value) => updateValue('business.businessName', value)} />
            <${TextInput} label="Nombre del owner o contacto principal" value=${intake.business.ownerName} onChange=${(value) => updateValue('business.ownerName', value)} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <${TextInput} label="Ciudad y zona de servicio" value=${intake.business.cityAndRegion} onChange=${(value) => updateValue('business.cityAndRegion', value)} />
            <${TextInput} label="Audiencia ideal" value=${intake.business.targetAudience} onChange=${(value) => updateValue('business.targetAudience', value)} />
          </div>
          <${TextArea} label="Resumen del negocio" rows=${4} value=${intake.business.businessSummary} onChange=${(value) => updateValue('business.businessSummary', value)} />
          <${TextArea} label="Diferenciadores" rows=${4} value=${intake.business.differentiators} onChange=${(value) => updateValue('business.differentiators', value)} />
        </${IntakeSection}>

        <div className="grid gap-6 lg:grid-cols-2">
          <${IntakeSection}
            eyebrow="Contacto"
            title="Canales para responder y cerrar cambios"
            description="Incluye el canal que prefieres para aprobaciones o dudas."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <${TextInput} label="Email" type="email" value=${intake.contact.email} onChange=${(value) => updateValue('contact.email', value)} />
              <${TextInput} label="Telefono" value=${intake.contact.phone} onChange=${(value) => updateValue('contact.phone', value)} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <${TextInput} label="WhatsApp" value=${intake.contact.whatsapp} onChange=${(value) => updateValue('contact.whatsapp', value)} />
              <${TextInput} label="Metodo de contacto preferido" value=${intake.contact.preferredContactMethod} onChange=${(value) => updateValue('contact.preferredContactMethod', value)} />
            </div>
          </${IntakeSection}>

          <${IntakeSection}
            eyebrow="Redes y horarios"
            title="Operacion publica"
            description="Usa texto simple. No hace falta tener todo perfecto para avanzar."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <${TextInput} label="Instagram" value=${intake.socialLinks.instagram} onChange=${(value) => updateValue('socialLinks.instagram', value)} />
              <${TextInput} label="Facebook" value=${intake.socialLinks.facebook} onChange=${(value) => updateValue('socialLinks.facebook', value)} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <${TextInput} label="TikTok" value=${intake.socialLinks.tiktok} onChange=${(value) => updateValue('socialLinks.tiktok', value)} />
              <${TextInput} label="Sitio o link adicional" value=${intake.socialLinks.website} onChange=${(value) => updateValue('socialLinks.website', value)} />
            </div>
            <${TextArea} label="Horarios regulares" rows=${3} value=${intake.hours.regularHours} onChange=${(value) => updateValue('hours.regularHours', value)} />
            <${TextArea} label="Disponibilidad para eventos" rows=${3} value=${intake.hours.eventAvailability} onChange=${(value) => updateValue('hours.eventAvailability', value)} />
            <${TextInput} label="Tiempo ideal de anticipacion para reservar" value=${intake.hours.bookingLeadTime} onChange=${(value) => updateValue('hours.bookingLeadTime', value)} />
          </${IntakeSection}>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <${IntakeSection}
            eyebrow="Oferta"
            title="Productos y servicios"
            description="Lista lo que vendes y cualquier detalle comercial clave."
          >
            <${TextArea} label="Productos y servicios" rows=${5} value=${intake.offerings.productsAndServices} onChange=${(value) => updateValue('offerings.productsAndServices', value)} />
            <${TextArea} label="Productos estrella o especiales" rows=${4} value=${intake.offerings.signatureItems} onChange=${(value) => updateValue('offerings.signatureItems', value)} />
            <${TextArea} label="Notas de precios o paquetes" rows=${4} value=${intake.offerings.pricingNotes} onChange=${(value) => updateValue('offerings.pricingNotes', value)} />
          </${IntakeSection}>

          <${IntakeSection}
            eyebrow="Voz"
            title="Tono de voz deseado"
            description="Sirve para orientar la redaccion del sitio sin perder la esencia de la marca."
          >
            <${TextArea} label="Como debe sonar la marca" rows=${4} value=${intake.voice.brandTone} onChange=${(value) => updateValue('voice.brandTone', value)} />
            <${TextArea} label="Palabras o ideas que si quieres usar" rows=${3} value=${intake.voice.wordsToUse} onChange=${(value) => updateValue('voice.wordsToUse', value)} />
            <${TextArea} label="Palabras o ideas que quieres evitar" rows=${3} value=${intake.voice.wordsToAvoid} onChange=${(value) => updateValue('voice.wordsToAvoid', value)} />
          </${IntakeSection}>
        </div>

        <${IntakeSection}
          eyebrow="Cambios requeridos"
          title="Que debe cambiar si o si"
          description="Prioriza las correcciones o mensajes mas importantes para esta version del sitio."
        >
          <${TextArea} label="Cambios requeridos" rows=${4} value=${intake.requests.requiredChanges} onChange=${(value) => updateValue('requests.requiredChanges', value)} />
          <div className="grid gap-4 md:grid-cols-2">
            <${TextArea} label="Secciones prioritarias" rows=${3} value=${intake.requests.prioritySections} onChange=${(value) => updateValue('requests.prioritySections', value)} />
            <${TextArea} label="Elementos que deben mantenerse" rows=${3} value=${intake.requests.mustKeep} onChange=${(value) => updateValue('requests.mustKeep', value)} />
          </div>
        </${IntakeSection}>

        <${IntakeSection}
          eyebrow="Copy sugerido"
          title="Borrador por seccion"
          description="No hace falta escribir todo perfecto. Estas respuestas sirven para precargar el copy editor."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <${TextInput} label="Hero eyebrow" value=${intake.preferredCopy.heroEyebrow} onChange=${(value) => updateValue('preferredCopy.heroEyebrow', value)} />
            <${TextInput} label="Hero titulo lead" value=${intake.preferredCopy.heroTitleLead} onChange=${(value) => updateValue('preferredCopy.heroTitleLead', value)} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <${TextInput} label="Hero acento" value=${intake.preferredCopy.heroTitleAccent} onChange=${(value) => updateValue('preferredCopy.heroTitleAccent', value)} />
            <${TextInput} label="Hero cierre" value=${intake.preferredCopy.heroTitleTail} onChange=${(value) => updateValue('preferredCopy.heroTitleTail', value)} />
          </div>
          <${TextArea} label="Hero descripcion" rows=${3} value=${intake.preferredCopy.heroBody} onChange=${(value) => updateValue('preferredCopy.heroBody', value)} />
          <div className="grid gap-4 md:grid-cols-2">
            <${TextInput} label="Especialidad titulo" value=${intake.preferredCopy.specialtyTitleLead} onChange=${(value) => updateValue('preferredCopy.specialtyTitleLead', value)} />
            <${TextInput} label="Especialidad acento" value=${intake.preferredCopy.specialtyTitleAccent} onChange=${(value) => updateValue('preferredCopy.specialtyTitleAccent', value)} />
          </div>
          <${TextArea} label="Especialidad descripcion" rows=${3} value=${intake.preferredCopy.specialtyBody} onChange=${(value) => updateValue('preferredCopy.specialtyBody', value)} />
          <div className="grid gap-4 md:grid-cols-2">
            <${TextInput} label="Eventos titulo" value=${intake.preferredCopy.eventsTitleLead} onChange=${(value) => updateValue('preferredCopy.eventsTitleLead', value)} />
            <${TextInput} label="Eventos acento" value=${intake.preferredCopy.eventsTitleAccent} onChange=${(value) => updateValue('preferredCopy.eventsTitleAccent', value)} />
          </div>
          <${TextArea} label="Eventos descripcion" rows=${3} value=${intake.preferredCopy.eventsBody} onChange=${(value) => updateValue('preferredCopy.eventsBody', value)} />
          <${TextArea} label="Frase divisoria" rows=${3} value=${intake.preferredCopy.quoteText} onChange=${(value) => updateValue('preferredCopy.quoteText', value)} />
          <div className="grid gap-4 md:grid-cols-2">
            <${TextInput} label="Galeria titulo" value=${intake.preferredCopy.galleryTitleLead} onChange=${(value) => updateValue('preferredCopy.galleryTitleLead', value)} />
            <${TextInput} label="Galeria acento" value=${intake.preferredCopy.galleryTitleAccent} onChange=${(value) => updateValue('preferredCopy.galleryTitleAccent', value)} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <${TextInput} label="Contacto titulo" value=${intake.preferredCopy.contactTitleLead} onChange=${(value) => updateValue('preferredCopy.contactTitleLead', value)} />
            <${TextInput} label="Contacto acento" value=${intake.preferredCopy.contactTitleAccent} onChange=${(value) => updateValue('preferredCopy.contactTitleAccent', value)} />
          </div>
          <${TextArea} label="Contacto descripcion" rows=${3} value=${intake.preferredCopy.contactBody} onChange=${(value) => updateValue('preferredCopy.contactBody', value)} />
          <${TextArea} label="Footer descripcion" rows=${3} value=${intake.preferredCopy.footerBody} onChange=${(value) => updateValue('preferredCopy.footerBody', value)} />
        </${IntakeSection}>

        <${IntakeSection}
          eyebrow="Notas"
          title="Notas finales y assets"
          description="Usa este bloque para links, referencias, pendientes o aprobaciones."
        >
          <${TextArea} label="Notas generales" rows=${4} value=${intake.notesAndAssets.notes} onChange=${(value) => updateValue('notesAndAssets.notes', value)} />
          <${TextArea} label="Links a assets o carpetas" rows=${4} value=${intake.notesAndAssets.linksToAssets} onChange=${(value) => updateValue('notesAndAssets.linksToAssets', value)} />
          <div className="grid gap-4 md:grid-cols-2">
            <${TextArea} label="Solicitudes de foto o material visual" rows=${3} value=${intake.notesAndAssets.photoRequests} onChange=${(value) => updateValue('notesAndAssets.photoRequests', value)} />
            <${TextArea} label="Estatus de aprobacion" rows=${3} value=${intake.notesAndAssets.approvalStatus} onChange=${(value) => updateValue('notesAndAssets.approvalStatus', value)} />
          </div>
        </${IntakeSection}>
      </main>
    </div>
  `;
}
