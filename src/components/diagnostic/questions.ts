export const questions = [
  [
    'team',
    '¿Cuántos colaboradores hay en tu empresa?',
    ['1–5', '6–10', '11–25', '26–50', '51–100', 'Más de 100'],
  ],
  [
    'timing',
    '¿Cuándo te gustaría comenzar?',
    ['Este mes', 'En 2–3 meses', 'Entre 4 y 6 meses', 'Solo estoy explorando'],
  ],
  [
    'experience',
    '¿Has trabajado con una agencia de marketing antes?',
    [
      'Sí, he trabajado con agencias',
      'No, nunca he trabajado con agencias',
      'Tengo un equipo de marketing interno',
    ],
  ],
  [
    'role',
    '¿Cuál es tu puesto laboral?',
    [
      'Practicante / Asistente',
      'Analista / Especialista',
      'Jefe / Coordinador / Supervisor',
      'Gerente / Director',
      'Emprendedor / Independiente',
      'Otros',
    ],
  ],
] as const;
