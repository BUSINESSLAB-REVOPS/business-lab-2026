import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
export default defineConfig({
  site: 'https://business-lab.net',
  outDir: fileURLToPath(
    new URL('../../../.artifacts/cta-site/', import.meta.url),
  ),
  publicDir: fileURLToPath(new URL('../../../public/', import.meta.url)),
});
