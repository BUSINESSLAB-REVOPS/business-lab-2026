# Business Lab

Réplica local de https://business-lab.net/ realizada con Astro. Incluye la portada y las rutas Metodología, FAQs, Consultoría Ágil, Entrenamiento, Casos, Blog y Representantes B2B. Fotografías, logotipos, fuentes y estilos se sirven desde `public/assets`.

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

## Componentes

- `src/layouts/Layout.astro`: estructura del documento y metadatos; compone el header, el contenido y el footer.
- `src/components/Header.astro`: logo, navegación y comportamiento del menú móvil.
- `src/components/Footer.astro`: contacto, enlaces y formulario de suscripción.
- `src/components/Newsletter.astro`: formulario y preparación de la solicitud por correo.
- `src/components/CTA.astro`: llamada a la acción compartida. Permite configurar `title`, `description`, `label`, `href`, `id`, `backgroundImage` e `index` (variante de estilos heredados).
- `src/components/pages/`: contenido editable de las ocho páginas en plantillas Astro. Todas usan el mismo CTA.
- `src/components/SecondaryPage.astro`: selecciona la plantilla de cada página y conserva los estilos e interacciones comunes del contenido importado.

El contenido se edita directamente en las plantillas de `src/components/pages/`. Los títulos de página se definen en sus rutas dentro de `src/pages/`.

## Interacciones y alcance

- Menú móvil accesible con soporte de Escape.
- Carrusel con flechas, indicadores, pausa, teclado y preferencia de movimiento reducido.
- Preguntas frecuentes desplegables por ratón o teclado.
- Consulta gratuita y suscripción mediante solicitud de correo; no hay backend ni envío automático.
- Los documentos legales no estaban enlazados en el original: sus enlaces permiten solicitarlos por correo.
- Los artículos que no tienen ruta local conservan su destino público original.
- El contenido de páginas interiores se conserva como instantánea HTML estática, sin scripts de WordPress, formularios de envío ni analítica.
