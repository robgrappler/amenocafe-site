// src/components/editor/formControls.js - Reusable form controls for the intake and copy editor pages.
import { html } from '../../lib/browserReact.js';

export function Field({ label, hint, children }) {
  return html`
    <label className="block space-y-2">
      <span className="block text-sm font-medium tracking-wide text-[var(--color-cafe)]">${label}</span>
      ${hint
        ? html`<span className="block text-xs leading-relaxed text-[color:rgba(44,27,24,0.62)]">${hint}</span>`
        : null}
      ${children}
    </label>
  `;
}

export function TextInput({ label, hint, value, onChange, placeholder = '', type = 'text' }) {
  return html`
    <${Field} label=${label} hint=${hint}>
      <input
        className="field-input"
        type=${type}
        value=${value ?? ''}
        placeholder=${placeholder}
        onChange=${(event) => onChange(event.target.value)}
      />
    </${Field}>
  `;
}

export function TextArea({ label, hint, value, onChange, placeholder = '', rows = 4 }) {
  return html`
    <${Field} label=${label} hint=${hint}>
      <textarea
        className="field-input field-textarea"
        rows=${rows}
        placeholder=${placeholder}
        value=${value ?? ''}
        onChange=${(event) => onChange(event.target.value)}
      />
    </${Field}>
  `;
}

export function TogglePill({ label, checked, onToggle }) {
  return html`
    <button
      type="button"
      className=${`chip-toggle ${checked ? 'chip-toggle--active' : ''}`}
      aria-pressed=${checked}
      onClick=${onToggle}
    >
      <span>${label}</span>
      <span className="text-xs opacity-75">${checked ? 'Visible' : 'Oculta'}</span>
    </button>
  `;
}

export function ActionButton({ label, onClick, variant = 'primary', type = 'button' }) {
  const className =
    variant === 'secondary'
      ? 'secondary-button'
      : variant === 'ghost'
        ? 'ghost-button'
        : 'action-button';

  return html`
    <button type=${type} className=${className} onClick=${onClick}>${label}</button>
  `;
}
