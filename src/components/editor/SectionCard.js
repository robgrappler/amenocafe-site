// src/components/editor/SectionCard.js - Consistent card wrapper for grouped editor and intake sections.
import { html } from '../../lib/browserReact.js';

export function SectionCard({ eyebrow, title, description, children }) {
  return html`
    <section className="panel-card space-y-5">
      ${eyebrow
        ? html`<p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--color-dorado)]">${eyebrow}</p>`
        : null}
      <div className="space-y-2">
        <h2 className="ameno-serif text-2xl leading-tight text-[var(--color-cafe)]">${title}</h2>
        ${description
          ? html`<p className="max-w-2xl text-sm leading-relaxed text-[color:rgba(44,27,24,0.65)]">${description}</p>`
          : null}
      </div>
      <div className="space-y-4">${children}</div>
    </section>
  `;
}
