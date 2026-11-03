import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
export default defineConfig({
  site: 'https://business-lab.net',
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
  outDir: fileURLToPath(
    new URL('../../../.artifacts/cta-site/', import.meta.url),
  ),
  publicDir: fileURLToPath(new URL('../../../public/', import.meta.url)),
});
