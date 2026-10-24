# Auditoría de referencia Business Lab

Fuente: https://business-lab.net/ y las seis rutas públicas del menú, leídas por HTTP el 23 octubre 2026. HTML original y contenido estructurado disponibles en `.reference/`.

## Identidad y estructura común

- WordPress + Divi 5.9.0 en referencia. No es necesario trasladar su runtime a Astro.
- Logo header `2025/07/BL-LOGO-White.jpg` (1140×256), header inicial 66px, logo al 54% de altura. Existe versión negra `BL-LOGO-BLACK-LABEL-short.png`.
- Tipografía global: Poppins 600 para encabezados, Inter 400 para texto, cuerpo 18px / 1.4. Menú usa Poppins. Google Fonts disponibles en el documento original.
- Colores activos encontrados en configuración global: azul #1959ff y #326bff; gris texto #666666 y encabezados #313131. Evitar asumir #2ea3f2 de Divi como color de identidad.
- Menú: Nosotros → `/`; Metodologia → `/metodologia/`; FAQs → `/nosotros/faqs/`; Consultoria Agil → `/consultoriaagil/`; Entrenamiento → `/servicios/entrenamiento/`; Casos → `/casos/`; Blog → `/blog/`.
- CTA final común: «¿Listo para escalar tus ventas con un sistema real y accesible?» + «Consultoria Gratuita» sobre `CONSULTORIA-GRATUITA.jpg`.
- Footer: Alicante, España; +34 652 94 72 64; eduardomz@business-lab.net; suscripción correo; Trabaja con nosotros / Política privacidad / Política de cookies / Aviso Legal. Estos últimos enlaces son `#` en referencia.
- Botones de reuniones y varios «Saber más» son `#` en origen. Para réplica útil conviene un contacto local accesible (mail/agenda) en lugar de botones muertos, dejando claro al usuario que el formulario necesita backend para entrega real.

## Página principal

1. Carrusel cuatro mensajes: «Especialistas en empresas B2B», «Más Clientes y Ventas Predecibles», «Escalabilidad Real», «Haz Crecer tu empresa tecnologica». CTA «Acerca de BL».
2. Misión: crecimiento sostenible B2B Latinoamérica/Europa y sistema comercial. Testimonio Eduardo Mogrovejo (Co-Founder), `EMZ-2023-3-1.png`.
3. Sectores cuatro imágenes cuadradas: Fabricantes / Representantes B2B / Agencias B2B / Software y SaaS, usando `Fabricante-square.jpg`, `IT2-square.jpg`, `Consultoras-square.jpg`, `Sofware-square.jpg`.
4. Servicios integrados: Consultoría Ágil / Entrenamiento.
5. Cuatro ayudas: leads de calidad, afinar producto, ratios de cierre, innovación con estrategia.
6. Metodología Revenue Factory BL. Imagen `Revenue-factory-LIght-V2.jpg`; testimonio Maritza Enciso (`MARITZA-ENCIZO-square.jpg`).
7. Resultados en 90 días con números JS exactos `-90`, `50%`, `30%`, `25%`, `12`: pipeline activo; calidad leads; cierre; ventas; mejoras producto.
8. Testimonio Martin Vidalon, CEO UNIFLEX, `Uniflex-logo-square.jpg`.
9. CTA y footer comunes.

Fondos de hero referenciados: `2024/05/Slide5.jpg`, `2025/07/Slide48.jpg`, `2025/07/Slide51-1.jpg`; revisar CSS específico para asignación precisa entre slides.

## Rutas secundarias

| Ruta | Contenido principal | Assets propios |
| --- | --- | --- |
| `/metodologia/` | Hero Revenue Factory, explicación, diferencias, resultados, seis beneficios, seis etapas desplegables | Slide11.jpg (2024/05), Slide19.jpg; Revenue-factory-LIght-V2.jpg; Slide43/44/51/59/60/78-300x300.jpg |
| `/nosotros/faqs/` | Misión y testimonio Eduardo; doce FAQs sobre servicio, empresas, equipo, plazos, canales, diferencias, validación, campañas, herramientas, IA, resultados, compromiso | EMZ-2023-3-1.png |
| `/consultoriaagil/` | Hero consultoría; problema informes sin ejecución; solución semanal; cuatro servicios; resultados y testimonio | Diapositiva91.jpg; Slide4.jpg; Uniflex-logo-square.jpg |
| `/servicios/entrenamiento/` | Hero Capacitación y contenido Entrenamiento ventas con tres párrafos sobre formación práctica | Slide97.jpg; sales-training-square.jpg |
| `/casos/` | «Algunos casos de exito»; caso Institución Educativa; listado artículos de origen visible debajo | uniflex-blog-growth-machine-5.jpg; imágenes de artículos |
| `/blog/` | Lista editorial, hero/listado inicial y grid repetido bajo «Lee nuestros ultimos articulos» | Slide*.jpg y GUIA-DIAGNOSTICO-REVENUE-FACTORY-1.jpg |

Etapas metodología: diagnóstico estratégico; validación con usuarios y competidores; entrenamiento comercial; generación de demanda multicanal; automatización y escalado con IA; feedback y mejora continua.

## Datos exportados

`.reference/content.json` contiene bloques de texto por etiqueta (h1–h4/p), imágenes completas con src/srcset/alt, links y URLs de assets por página. Los HTML conservan preguntas de acordeón, estadísticas y configuraciones de cada módulo para implementación fiel.

## Recomendaciones de fidelidad

Preservar los assets originales, jerarquía tipográfica, azul, navegación y orden narrativo. Convertir el carrusel a controles reales accesibles; FAQs y metodología a details/summary o botones con estado. Las copias tienen errores ortográficos del sitio original: decidir una política uniforme antes de pulir texto. No incluir analytics, trackers, jQuery ni Divi en la réplica Astro. El original presenta contenidos repetidos en Blog/Casos y un mensaje «No Se Encontraron Resultados» en Casos; replicar intención editorial sin trasladar estados rotos si no son necesarios para la fidelidad visual.
