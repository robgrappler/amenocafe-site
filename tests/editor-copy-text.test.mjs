// tests/editor-copy-text.test.mjs - Node tests that lock accented Spanish UI copy for the intake and copy editor routes.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function readSource(relativePath) {
  return readFile(path.resolve(__dirname, '..', relativePath), 'utf8');
}

test('client intake keeps accented Spanish UI copy', async () => {
  const source = await readSource('src/components/editor/ClientIntakeApp.js');

  assert.equal(source.includes('Este formulario guarda avances automáticamente.'), true);
  assert.equal(source.includes('Información principal'), true);
  assert.equal(source.includes('Método de contacto preferido'), true);
  assert.equal(source.includes('Qué debe cambiar sí o sí'), true);
});

test('copy editor keeps accented Spanish UI copy', async () => {
  const source = await readSource('src/components/editor/CopyEditorApp.js');

  assert.equal(source.includes('flujo más limpio y continuo'), true);
  assert.equal(source.includes('móvil'), true);
  assert.equal(source.includes('Descripción'), true);
  assert.equal(source.includes('Cotización'), true);
  assert.equal(source.includes('línea'), true);
});
