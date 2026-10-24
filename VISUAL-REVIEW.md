# Revisión visual de Business Lab

Se compararon las ocho rutas contra business-lab.net a 1280 px y se guardaron capturas completas en `screenshots/review/`. También se capturaron las ocho rutas locales a 390 px.

## Causa y correcciones

La capa de compatibilidad añadía `flex-wrap: wrap` y padding a todas las filas de Divi. Las columnas de escritorio estaban diseñadas para compartir el ancho mediante flex-shrink: al permitir salto de línea, cada columna ocupaba toda la fila. Se eliminaron esas reglas, se restauró el contexto de gutters y se limita el apilado al breakpoint móvil.

También se restauró la estructura original de la portada, se reconstruyeron las alturas compartidas de los sliders y la fila de tres artículos del Blog/Casos, y se ajustaron proporciones de cabecera, footer y encuadres de fondos. Los contadores se renderizan de forma estática con sus valores originales.

## Evidencia

- Entrenamiento: las columnas pasaron de 1012 + 1012 px apiladas a 478 + 478 px en una fila, igual que el original. La fila mide 521 px de alto en ambas versiones.
- Consultoría: filas principales con columnas 478 + 478 px y alturas 478, 346 y 466 px, iguales al original.
- FAQs: alturas 177, 348, 99 y 1138 px, iguales al original.
- Portada: anchos y alturas de las ocho secciones de contenido coinciden con la referencia a 1280 px.
- Blog: portada en columnas 478 + 478 px; artículos en tarjetas de aproximadamente 327 px, con desplazamiento funcional.
- Las ocho rutas a 1280 y 390 px no presentan desbordamiento horizontal ni imágenes fallidas detectadas.

Medidas completas: `screenshots/review/desktop-comparison.json` y `mobile-checks.json`.

Los controles adicionales de accesibilidad y el footer con solicitud de suscripción por correo conservan pequeñas diferencias respecto a WordPress. Los fondos originales tienen parallax; el encuadre puede variar según el scroll. Las capturas de la referencia pueden mostrar animaciones de entrada en curso.
