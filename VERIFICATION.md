# Verificación de la réplica

- `npm run build`: correcto; ocho rutas estáticas generadas.
- Navegador a 1280 px: portada y fondos de metodología revisados visualmente.
- Navegador a 390 px: ocho rutas sin desbordamiento horizontal y sin imágenes fallidas reportadas.
- Carrusel: cambio directo a diapositiva 3, pausa y estado accesible comprobados.
- Menú móvil: apertura y cierre mediante Escape comprobados.
- FAQs: apertura de segunda pregunta y aparición de respuesta comprobadas.
- Consola de navegador durante navegación móvil: sin errores.
- HTML de secundarias sin scripts, iframes, formularios POST, handlers ni URLs JavaScript heredados.

Limitaciones: la suscripción requiere enviar un correo; los artículos externos conservan sus destinos originales; documentos legales se solicitan por correo, porque el original no ofrece enlaces válidos.

Segunda revisión visual: consultar `VISUAL-REVIEW.md`. Las ocho páginas ahora usan la estructura y los estilos originales aislados, con controles locales para los sliders. Se verificaron columnas y capturas a 1280 y 390 px; carrusel, tarjetas de artículos, FAQs y Escape del menú funcionando.
