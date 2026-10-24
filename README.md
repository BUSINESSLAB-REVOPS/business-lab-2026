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

## Interacciones y alcance

- Menú móvil accesible con soporte de Escape.
- Carrusel con flechas, indicadores, pausa, teclado y preferencia de movimiento reducido.
- Preguntas frecuentes desplegables por ratón o teclado.
- Consulta gratuita y suscripción mediante solicitud de correo; no hay backend ni envío automático.
- Los documentos legales no estaban enlazados en el original: sus enlaces permiten solicitarlos por correo.
- Los artículos que no tienen ruta local conservan su destino público original.
- El contenido de páginas interiores se conserva como instantánea HTML estática, sin scripts de WordPress, formularios de envío ni analítica.

El informe `reference-audit.md` documenta la referencia. Las fuentes de trabajo están en `.reference/` y no se necesitan para servir el sitio.
