# Business Lab

Sitio estático de Business Lab realizado con Astro y componentes propios, sin dependencias de Divi o WordPress. Incluye la portada y las rutas Metodología, FAQs, Consultoría Ágil, Entrenamiento, Casos, Blog y Representantes B2B. Conserva el diseño y los destinos de enlace de la referencia original.

## Desarrollo

```sh
npm install
npm run dev -- --background
npm run astro -- dev status
npm run astro -- dev stop
```

La dirección predeterminada es http://localhost:4321.

## Compilación

```sh
npm run build
npm run preview
```

La salida estática se genera en `dist`.

## Cloudflare Workers

`wrangler.jsonc` configura el Worker `business-lab-2026` para servir el sitio estático desde `dist` y habilita las previews de las ramas.

En la integración de Git de Cloudflare, usa estos comandos:

- Compilación: `npm run build`.
- Despliegue de producción: `npx wrangler deploy`.
- Despliegue de preview: `npx wrangler preview`.

La compilación debe ejecutarse antes del despliegue para generar `dist`. `npm run preview` sirve la compilación localmente; las previews publicadas en Cloudflare usan Wrangler.

## Componentes

- `src/layouts/Layout.astro`: documento, favicons, canonical y metadatos sociales; recibe una clave `page` del registro tipado.
- `src/components/Header.astro`: logo, navegación y comportamiento del menú móvil.
- `src/components/Footer.astro`: contacto, enlaces y formulario de suscripción.
- `src/components/Newsletter.astro`: formulario y preparación de la solicitud por correo.
- `src/components/CTA.astro`: llamada a la acción independiente, con props `title`, `description`, `label`, `href`, `id` y `backgroundImage`.
- `src/components/Carousel.astro` y `ArticleScroller.astro`: presentación de diapositivas y desplazamiento horizontal de artículos, respectivamente.
- `src/components/FaqItem.astro`: preguntas con controles nativos `details`/`summary`, utilizables sin JavaScript.
- `src/components/Testimonial.astro`, `Metric.astro`, `ArticleCard.astro`, `Button.astro` y `Section.astro`: bloques compartidos.
- `src/components/AssetImage.astro` y `Background.astro`: imágenes importadas, variantes WebP con respaldo JPEG/PNG, dimensiones y carga diferida.
- `src/components/pages/`: composición de las ocho páginas, importada directamente por cada ruta.
- `src/data/pages.ts`: títulos, descripciones, rutas y orden del menú. El dominio se define en `astro.config.mjs`.
- `src/data/articles.ts`: artículos y casos compartidos entre tarjetas.
- `src/styles/`: variables y utilidades globales, composición compartida y estilos particulares de cada página. Los estilos de cada componente están en su archivo Astro; las capas CSS definen la prioridad sin depender de `!important`.

El contenido se edita en las plantillas y los datos compartidos. Las imágenes originales utilizadas viven en `src/assets/images/`; las fuentes WOFF2 y la imagen social pública están en `public/assets`. `AssetImage` exige `alt`; las imágenes decorativas usan una cadena vacía y los enlaces de imágenes tienen nombre accesible.

## Verificación

```sh
npm run check
npm run format:check
npm test
```

`npm test` compila el sitio y la página de prueba aislada del CTA, y ejecuta Playwright. Usa Chrome instalado (`channel: chrome`) y sirve las compilaciones en los puertos locales 4325 y 4326. Las pruebas cubren las ocho rutas, semántica, metadatos, imágenes, presupuesto de 60 KB de CSS por página, menú móvil, FAQs, suscripción, pausa y movimiento reducido, y uso sin JavaScript.

Con el servidor de desarrollo activo en `http://localhost:4321`, `npm run test:dev` verifica también el formulario en desarrollo, incluidos la inicialización de React y los fallos de descarga. Si no se puede cargar el formulario, muestra un aviso dentro del sitio para recargar; nunca abre automáticamente una aplicación de correo.

Para comparar visualmente con una referencia local:

```sh
npm run preview -- --host 127.0.0.1 --port 4325
npm run capture:reference -- baseline
# Después de realizar los cambios y recompilar:
npm run capture:reference -- final
node scripts/compare-reference.mjs baseline final
```

El capturador toma las ocho rutas a 390, 768 y 1280 px, carga las imágenes y las fuentes y usa movimiento reducido. Las capturas, tamaños de recursos y medidas se guardan en `.artifacts/`, ignorado por Git, junto a los resultados de pruebas. No forman parte del sitio publicado.

Para convertir nuevas fuentes TTF locales sin cambiar su diseño:

```sh
python -m venv .venv-fonts
.venv-fonts/Scripts/python -m pip install -r scripts/font-requirements.txt
.venv-fonts/Scripts/python scripts/convert-fonts.py RUTA_A_LAS_TTF
```

## Interacciones y alcance

- Menú móvil accesible con soporte de Escape.
- Carrusel con flechas, pausa, teclado y preferencia de movimiento reducido; no gira mientras conserva foco o puntero.
- Preguntas frecuentes desplegables por ratón o teclado.
- Consulta gratuita mediante un formulario local de tres pasos: diagnóstico, datos de contacto y reserva en Zoho Bookings. Suscripción mediante solicitud de correo.
- Los documentos legales no estaban enlazados en el original: sus enlaces permiten solicitarlos por correo.
- Los artículos que no tienen ruta local conservan su destino público original.
- El contenido se genera como HTML estático desde plantillas Astro; React hidrata únicamente el diagnóstico. Los eventos del diagnóstico se guardan en una cola local, sin proveedor de analítica.

## Formulario de consultoría

`src/components/diagnostic/` y los componentes utilizados en `src/components/ui/` son copias locales independientes del formulario de REVOPS-center. No importan archivos ni requieren que ese proyecto esté en ejecución. Conservan las preguntas, validaciones, teléfono internacional (Perú predeterminado) y la configuración de Zoho Bookings.

Los enlaces de contacto y «Consultoría gratuita» abren una única ventana por página. `/?consultoria=gratuita#contacto` permite abrirla desde un enlace directo. El calendario predeterminado es `https://revops1.zohobookings.com/portal-embed#/5013442000000038009`; se puede sustituir mediante `PUBLIC_ZOHO_BOOKINGS_URL` (ver `.env.example`). Los datos de contacto se pasan a Zoho al llegar al paso de reserva; no hay almacenamiento local ni envío propio del formulario.

El formulario y sus estilos se cargan al abrir la consulta. Los estilos se generan con Tailwind únicamente a partir de sus componentes, sin Preflight global. Los logos enviados se usan en cabecera, pie, metadatos e icono del sitio.
