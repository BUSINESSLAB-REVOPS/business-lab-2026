# Estilos y Tailwind

La entrada compartida es `src/styles/tailwind.css`, importada una sola vez desde `global.css`. Registra los tokens de Tailwind y busca clases en todo `src`. Los layouts, páginas Astro y componentes React pueden utilizar utilidades sin abrir el diagnóstico.

Se conserva el reset propio del sitio: no se importa Preflight. El diagnóstico tiene una entrada de utilidades independiente y diferida, limitada a sus componentes React. Ambas entradas comparten tokens.css; no importar Preflight en ninguna.

`global.css` contiene fuentes locales, tokens de marca y valores base. Los colores que deban generar utilidades se registran en `@theme`; definirlos solamente en `:root` no genera clases Tailwind. Los alias enlazados a otras variables utilizan `@theme inline`.

`shared.css` declara recetas Tailwind reutilizables mediante `@utility`. Las hojas de página las cargan con `@reference` y las aplican en sus selectores originales. Esto centraliza las declaraciones repetidas conservando su orden y especificidad. Mover todos esos selectores a una hoja anterior cambiaba la cascada; se descartó después de comparar los estilos calculados.

Las capas mantienen el orden `theme, components, pages, overrides, utilities`. Las utilidades del marcado tienen prioridad sobre las reglas normales de las capas anteriores. Usarlas solo cuando esa prioridad sea intencionada. El contenedor del sitio se llama `site-container` para evitar colisiones con la utilidad `container`.

Los estilos propios que permanecen en componentes y páginas describen sus variantes, estados interactivos, breakpoints heredados y composiciones específicas. El uso de Tailwind no requiere convertir cada selector complejo en clases arbitrarias.

Las fuentes Host Grotesk e Instrument Sans se sirven desde `public/assets`. No se depende de Google Fonts.

El diagnóstico carga bajo demanda React y los estilos del teléfono. Sus reglas de compatibilidad están en `diagnostic.css`; los tokens y las utilidades pertenecen a la entrada compartida.

Validación: `npm run build`, `npm run check` y `npm test`. La prueba `tests/tailwind.spec.ts` comprueba disponibilidad inicial, fuentes locales, borde del diagnóstico y estabilidad del token global al abrirlo y cerrarlo.
