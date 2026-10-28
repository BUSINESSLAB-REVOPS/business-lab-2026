export interface Article {
  title: string;
  href: string;
  image?: string;
  excerpt: string;
  date: string;
  category: string;
  categoryHref: string;
  author: string;
  authorHref: string;
}
export const articles: Record<string, Article> = {
  'institucion-educativa': {
    title: 'Institucion Educativa',
    href: 'https://business-lab.net/casos-uso/institucion-educativa/',
    image: '/assets/uniflex-blog-growth-machine-5.jpg',
    excerpt:
      'Revertir su caída de matrículas y modernizar su gestión integral en solo 10 meses',
    date: 'Jul 22, 2025',
    category: 'Casos de uso',
    categoryHref: 'https://business-lab.net/category/casos-uso/',
    author: 'admin',
    authorHref: 'https://business-lab.net/author/admin/',
  },
  '5-senales-de-que-necesitas-una-maquina-comercial': {
    title: '5 señales de que necesitas una maquina comercial',
    href: 'https://business-lab.net/articulos/5-senales-de-que-necesitas-una-maquina-comercial/',
    image: '/assets/pexels-olly-3789100-1024x683.jpg',
    excerpt:
      'Muchos fundadores y gerentes de SaaS llegan a un punto en que el marketing y el boca a boca ya no da más',
    date: 'Jul 22, 2025',
    category: 'Artículos',
    categoryHref: 'https://business-lab.net/category/articulos/',
    author: 'admin',
    authorHref: 'https://business-lab.net/author/admin/',
  },
  'como-la-inteligencia-artificial-esta-redefiniendo-el-marketing-digital-en-2025':
    {
      title:
        'Cómo la Inteligencia Artificial está Redefiniendo el Marketing Digital en 2025',
      href: 'https://business-lab.net/articulos/como-la-inteligencia-artificial-esta-redefiniendo-el-marketing-digital-en-2025/',
      image: '/assets/Slide29-1024x576.jpg',
      excerpt:
        'La IA ya es una realidad, en 2025, es el motor de las estrategias de marketing más eficaces y escalables del mundo',
      date: 'Jul 14, 2025',
      category: 'Artículos',
      categoryHref: 'https://business-lab.net/category/articulos/',
      author: 'admin',
      authorHref: 'https://business-lab.net/author/admin/',
    },
  'guia-de-diagnostico-de-madurez-comercial': {
    title: 'Guía de Diagnóstico de Madurez Comercial',
    href: 'https://business-lab.net/articulos/guia-de-diagnostico-de-madurez-comercial/',
    image: '/assets/GUIA-DIAGNOSTICO-REVENUE-FACTORY-1-1024x576.jpg',
    excerpt:
      'La herramienta que usamos para evaluar los factores que componen nuestra metodología REVENUE FACTORY',
    date: 'Jul 1, 2025',
    category: 'Artículos',
    categoryHref: 'https://business-lab.net/category/articulos/',
    author: 'admin',
    authorHref: 'https://business-lab.net/author/admin/',
  },
  'como-aplicamos-la-metodologia-revenue-factory': {
    title: 'Cómo Aplicamos la metodología REVENUE FACTORY',
    href: 'https://business-lab.net/articulos/como-aplicamos-la-metodologia-revenue-factory/',
    image: '/assets/Slide1-1-1024x576.jpg',
    excerpt:
      'En este artículo te explicamos cómo crear un un plan de acción concreto para mejorar tus ventas.',
    date: 'Jun 14, 2025',
    category: 'Artículos',
    categoryHref: 'https://business-lab.net/category/articulos/',
    author: 'admin',
    authorHref: 'https://business-lab.net/author/admin/',
  },
  'como-escalar-tus-ventas-b2b-con-una-ecuacion': {
    title: 'Cómo Escalar tus Ventas B2B con una Ecuación',
    href: 'https://business-lab.net/articulos/como-escalar-tus-ventas-b2b-con-una-ecuacion/',
    image: '/assets/Slide24-1024x576.jpg',
    excerpt:
      'Una fórmula que nos permite analizar, optimizar y escalar cada parte del proceso comercial con claridad y método',
    date: 'Jun 1, 2025',
    category: 'Artículos',
    categoryHref: 'https://business-lab.net/category/articulos/',
    author: 'admin',
    authorHref: 'https://business-lab.net/author/admin/',
  },
  'como-convertimos-la-venta-b2b-en-un-sistema-que-escala': {
    title: 'Cómo Convertimos la Venta B2B en un Sistema que Escala',
    href: 'https://business-lab.net/articulos/como-convertimos-la-venta-b2b-en-un-sistema-que-escala/',
    image: '/assets/Slide3-1-1024x576.jpg',
    excerpt:
      'La metodología REVENUE FACTORY se basa en 6 etapas que atacan las causas por las que una empresa no vende más',
    date: 'May 14, 2025',
    category: 'Artículos',
    categoryHref: 'https://business-lab.net/category/articulos/',
    author: 'admin',
    authorHref: 'https://business-lab.net/author/admin/',
  },
  'te-quieren-volver-influencer-guia-para-detectarlo': {
    title: 'Te quieren volver influencer…Guia para detectarlo Parte 2',
    href: 'https://business-lab.net/articulos/te-quieren-volver-influencer-guia-para-detectarlo/',
    image: '/assets/Slide90-1024x576.jpg',
    excerpt:
      'Saber detectar si te están vendiendo marketing de influencer cuando tú vendes a empresas',
    date: 'May 1, 2025',
    category: 'Artículos',
    categoryHref: 'https://business-lab.net/category/articulos/',
    author: 'admin',
    authorHref: 'https://business-lab.net/author/admin/',
  },
  'te-quieren-volver-influencer-pero-tu-vendes-a-empresas': {
    title: 'Te quieren volver influencer… pero tú vendes a empresas Parte 1',
    href: 'https://business-lab.net/articulos/te-quieren-volver-influencer-pero-tu-vendes-a-empresas/',
    image: '/assets/influencer-dark-1024x576.jpg',
    excerpt:
      'Si tú diriges una empresa B2B esa receta no solo es ineficaz, puede ser peligrosa para tu marca',
    date: 'Abr 14, 2025',
    category: 'Artículos',
    categoryHref: 'https://business-lab.net/category/articulos/',
    author: 'admin',
    authorHref: 'https://business-lab.net/author/admin/',
  },
  'distinguir-entre-una-consultoria-real-y-un-analisis-express': {
    title: 'Consultoría real vs Express',
    href: 'https://business-lab.net/articulos/distinguir-entre-una-consultoria-real-y-un-analisis-express/',
    image: '/assets/Slide38-1024x576.jpg',
    excerpt:
      'Aprende a distinguir entre una consultoría real y un «análisis express» que te vende un enlatado',
    date: 'Abr 1, 2025',
    category: 'Artículos',
    categoryHref: 'https://business-lab.net/category/articulos/',
    author: 'admin',
    authorHref: 'https://business-lab.net/author/admin/',
  },
  'porque-tu-empresa-b2b-no-esta-creciendo': {
    title: 'Porque tu empresa B2B no esta creciendo',
    href: 'https://business-lab.net/articulos/porque-tu-empresa-b2b-no-esta-creciendo/',
    image: '/assets/Slide9-300x169.jpg',
    excerpt:
      '6 errores comunes que frenan la escalabilidad de empresas tecnologicas que buscan crecer',
    date: '',
    category: '',
    categoryHref: '',
    author: '',
    authorHref: '',
  },
};
