export const pages = {
  home: {
    path: '/',
    title: 'Nosotros - Business Lab',
    description:
      'Ayudamos a empresas tecnológicas B2B a crecer con estrategia, ejecución comercial e inteligencia artificial.',
    navigation: 'Nosotros',
  },
  metodologia: {
    path: '/metodologia/',
    title: 'Metodologia - Business Lab',
    description:
      'Conoce Revenue Factory, nuestra metodología para validar tu propuesta, generar demanda y escalar las ventas B2B.',
    navigation: 'Metodologia',
  },
  'nosotros-faqs': {
    path: '/nosotros/faqs/',
    title: 'FAQs - Business Lab',
    description:
      'Respuestas sobre nuestra consultoría, metodología, plazos y colaboración con empresas tecnológicas B2B.',
    navigation: 'FAQs',
  },
  consultoriaagil: {
    path: '/consultoriaagil/',
    title: 'Consultoria Agil - Business Lab',
    description:
      'Consultoría ágil que conecta estrategia y ejecución para mejorar tu proceso comercial y tus ventas B2B.',
    navigation: 'Consultoria Agil',
  },
  'servicios-entrenamiento': {
    path: '/servicios/entrenamiento/',
    title: 'Entrenamiento - Business Lab',
    description:
      'Entrenamiento de ventas para equipos comerciales que venden productos y servicios tecnológicos B2B.',
    navigation: 'Entrenamiento',
  },
  casos: {
    path: '/casos/',
    title: 'Casos - Business Lab',
    description:
      'Descubre casos de empresas que han estructurado su proceso comercial y acelerado su crecimiento con Business Lab.',
    navigation: 'Casos',
  },
  blog: {
    path: '/blog/',
    title: 'Blog - Business Lab',
    description:
      'Artículos sobre ventas B2B, crecimiento comercial, marketing e inteligencia artificial para empresas tecnológicas.',
    navigation: 'Blog',
  },
  'sectores-representantes': {
    path: '/sectores/representantes/',
    title: 'Representantes - Business Lab',
    description:
      'Estrategia y ejecución comercial para representantes de marcas que quieren desarrollar su negocio B2B.',
    navigation: null,
  },
} as const;
export type PageId = keyof typeof pages;
