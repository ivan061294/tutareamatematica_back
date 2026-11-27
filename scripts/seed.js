/**
 * Seed script — crea las tablas en DynamoDB Local e inserta datos de prueba.
 * Ejecutar con: node scripts/seed.js
 * Requiere que docker-compose esté corriendo (dynamodb-local en puerto 8000).
 */

const { DynamoDBClient, CreateTableCommand, ListTablesCommand } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

// ── Config ───────────────────────────────────────────────────────────────────
const TABLE_PREFIX = process.env.DYNAMODB_TABLE_PREFIX || 'mathpro-api-dev';
const ENDPOINT     = process.env.DYNAMODB_ENDPOINT    || 'http://localhost:8000';
const REGION       = process.env.AWS_REGION           || 'us-east-1';

const rawClient = new DynamoDBClient({
  region: REGION,
  endpoint: ENDPOINT,
  credentials: { accessKeyId: 'test', secretAccessKey: 'test' },
});

const db = DynamoDBDocumentClient.from(rawClient, {
  marshallOptions: { removeUndefinedValues: true },
});

// ── Tabla definitions ────────────────────────────────────────────────────────
const tableDefs = [
  {
    TableName: `${TABLE_PREFIX}-users`,
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    AttributeDefinitions: [
      { AttributeName: 'id',    AttributeType: 'S' },
      { AttributeName: 'email', AttributeType: 'S' },
    ],
    GlobalSecondaryIndexes: [{
      IndexName: 'email-index',
      KeySchema: [{ AttributeName: 'email', KeyType: 'HASH' }],
      Projection: { ProjectionType: 'ALL' },
    }],
    BillingMode: 'PAY_PER_REQUEST',
  },
  {
    TableName: `${TABLE_PREFIX}-courses`,
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    AttributeDefinitions: [
      { AttributeName: 'id',       AttributeType: 'S' },
      { AttributeName: 'category', AttributeType: 'S' },
    ],
    GlobalSecondaryIndexes: [{
      IndexName: 'category-index',
      KeySchema: [{ AttributeName: 'category', KeyType: 'HASH' }],
      Projection: { ProjectionType: 'ALL' },
    }],
    BillingMode: 'PAY_PER_REQUEST',
  },
  {
    TableName: `${TABLE_PREFIX}-exercises`,
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    AttributeDefinitions: [
      { AttributeName: 'id',       AttributeType: 'S' },
      { AttributeName: 'courseId', AttributeType: 'S' },
    ],
    GlobalSecondaryIndexes: [{
      IndexName: 'courseId-index',
      KeySchema: [{ AttributeName: 'courseId', KeyType: 'HASH' }],
      Projection: { ProjectionType: 'ALL' },
    }],
    BillingMode: 'PAY_PER_REQUEST',
  },
  {
    TableName: `${TABLE_PREFIX}-videos`,
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    AttributeDefinitions: [
      { AttributeName: 'id',       AttributeType: 'S' },
      { AttributeName: 'courseId', AttributeType: 'S' },
    ],
    GlobalSecondaryIndexes: [{
      IndexName: 'courseId-index',
      KeySchema: [{ AttributeName: 'courseId', KeyType: 'HASH' }],
      Projection: { ProjectionType: 'ALL' },
    }],
    BillingMode: 'PAY_PER_REQUEST',
  },
  {
    TableName: `${TABLE_PREFIX}-enrollments`,
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    AttributeDefinitions: [
      { AttributeName: 'id',     AttributeType: 'S' },
      { AttributeName: 'userId', AttributeType: 'S' },
    ],
    GlobalSecondaryIndexes: [{
      IndexName: 'userId-index',
      KeySchema: [{ AttributeName: 'userId', KeyType: 'HASH' }],
      Projection: { ProjectionType: 'ALL' },
    }],
    BillingMode: 'PAY_PER_REQUEST',
  },
  {
    TableName: `${TABLE_PREFIX}-orders`,
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    AttributeDefinitions: [
      { AttributeName: 'id',     AttributeType: 'S' },
      { AttributeName: 'userId', AttributeType: 'S' },
    ],
    GlobalSecondaryIndexes: [{
      IndexName: 'userId-index',
      KeySchema: [{ AttributeName: 'userId', KeyType: 'HASH' }],
      Projection: { ProjectionType: 'ALL' },
    }],
    BillingMode: 'PAY_PER_REQUEST',
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
async function createTables() {
  const { TableNames } = await rawClient.send(new ListTablesCommand({}));
  for (const def of tableDefs) {
    if (TableNames.includes(def.TableName)) {
      console.log(`  ⚠  tabla ya existe: ${def.TableName}`);
    } else {
      await rawClient.send(new CreateTableCommand(def));
      console.log(`  ✔  tabla creada:    ${def.TableName}`);
    }
  }
}

async function put(table, item) {
  const now = new Date().toISOString();
  await db.send(new PutCommand({
    TableName: `${TABLE_PREFIX}-${table}`,
    Item: { ...item, createdAt: now, updatedAt: now },
  }));
}

// ── IDs fijos para relacionar datos ─────────────────────────────────────────
const IDS = {
  adminUser:   uuidv4(),
  testStudent: uuidv4(),
  algebra:     uuidv4(),
  calcDif:     uuidv4(),
  geometry:    uuidv4(),
  stats:       uuidv4(),
  trig:        uuidv4(),
  calcInt:     uuidv4(),
};

// ── Imágenes de Unsplash (math/education) ────────────────────────────────────
// Fuente: Unsplash — fotos de libre uso bajo licencia Unsplash
const THUMBS = {
  algebra:  'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=640&q=80',
  calcDif:  'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=640&q=80',
  geometry: 'https://images.unsplash.com/photo-1564939558297-fc396f18e5c7?w=640&q=80',
  stats:    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=640&q=80',
  trig:     'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=640&q=80',
  calcInt:  'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=640&q=80',
};

// ── Usuarios ─────────────────────────────────────────────────────────────────
async function seedUsers() {
  const adminHash   = await bcrypt.hash('Admin123!', 10);
  const studentHash = await bcrypt.hash('Student123!', 10);

  await put('users', {
    id: IDS.adminUser,
    email: 'admin@mathpro.com',
    password: adminHash,
    firstName: 'Admin',
    lastName: 'MathPro',
    role: 'admin',
    isActive: true,
    enrolledCourses: [],
  });

  await put('users', {
    id: IDS.testStudent,
    email: 'estudiante@mathpro.com',
    password: studentHash,
    firstName: 'Juan',
    lastName: 'Pérez',
    role: 'student',
    isActive: true,
    enrolledCourses: [IDS.algebra, IDS.trig],
  });

  console.log('  ✔  usuarios insertados (2)');
}

// ── Cursos ───────────────────────────────────────────────────────────────────
async function seedCourses() {
  const courses = [
    {
      id: IDS.algebra,
      title: 'Álgebra Desde Cero',
      slug: 'algebra-desde-cero',
      shortDescription: 'Fundamentos completos del álgebra para principiantes',
      description: 'Domina los conceptos fundamentales del álgebra desde las operaciones básicas hasta ecuaciones cuadráticas y sistemas de ecuaciones. Diseñado para estudiantes que inician su camino en las matemáticas.',
      category: 'algebra',
      level: 'beginner',
      price: 29,
      originalPrice: 49,
      currency: 'usd',
      thumbnailUrl: THUMBS.algebra,
      instructorName: 'Prof. García',
      instructorBio: 'Doctor en Matemáticas con 15 años de experiencia docente.',
      topics: ['Números reales y operaciones', 'Expresiones algebraicas', 'Ecuaciones lineales', 'Sistemas de ecuaciones', 'Inecuaciones', 'Polinomios y factorización', 'Ecuaciones cuadráticas', 'Funciones y gráficas'],
      requirements: ['Aritmética básica', 'Calculadora científica (opcional)'],
      whatYouLearn: ['Resolver ecuaciones lineales y cuadráticas', 'Factorizar polinomios', 'Graficar funciones', 'Resolver sistemas de ecuaciones', 'Aplicar álgebra en problemas reales'],
      totalLessons: 45, totalExercises: 120, totalVideos: 45, totalHours: 18,
      rating: 4.9, reviewCount: 234, studentCount: 1820, isFeatured: true, isPublished: true,
    },
    {
      id: IDS.calcDif,
      title: 'Cálculo Diferencial',
      slug: 'calculo-diferencial',
      shortDescription: 'Domina límites, derivadas y sus aplicaciones prácticas',
      description: 'Curso completo de Cálculo Diferencial que cubre desde los fundamentos de límites hasta las aplicaciones avanzadas de la derivada. Aprende a analizar funciones y resolver problemas de optimización.',
      category: 'calculus',
      level: 'intermediate',
      price: 39,
      originalPrice: 59,
      currency: 'usd',
      thumbnailUrl: THUMBS.calcDif,
      instructorName: 'Prof. Martínez',
      instructorBio: 'Ingeniero y matemático con experiencia en enseñanza universitaria de cálculo avanzado.',
      topics: ['Límites y continuidad', 'Definición de la derivada', 'Reglas de diferenciación', 'Derivada de funciones trigonométricas', 'Regla de la cadena', 'Derivada implícita', 'Aplicaciones de la derivada', "Regla de L'Hôpital"],
      requirements: ['Álgebra sólida', 'Trigonometría básica'],
      whatYouLearn: ['Calcular límites', 'Aplicar reglas de diferenciación', 'Optimizar funciones', "Aplicar la regla de L'Hôpital", 'Interpretar la derivada como tasa de cambio'],
      totalLessons: 60, totalExercises: 180, totalVideos: 60, totalHours: 24,
      rating: 4.8, reviewCount: 189, studentCount: 1240, isFeatured: true, isPublished: true,
    },
    {
      id: IDS.geometry,
      title: 'Geometría Analítica',
      slug: 'geometria-analitica',
      shortDescription: 'Puntos, líneas, cónicas y geometría espacial con enfoque algebraico',
      description: 'Estudia la geometría a través del álgebra y las coordenadas cartesianas. Desde la ecuación de la recta hasta las secciones cónicas y la geometría en el espacio tridimensional.',
      category: 'geometry',
      level: 'intermediate',
      price: 29,
      originalPrice: 45,
      currency: 'usd',
      thumbnailUrl: THUMBS.geometry,
      instructorName: 'Prof. López',
      instructorBio: 'Especialista en geometría y topología con publicaciones en revistas matemáticas internacionales.',
      topics: ['Coordenadas cartesianas', 'Distancia y punto medio', 'Ecuación de la recta', 'Paralelismo y perpendicularidad', 'Circunferencia', 'Parábola', 'Elipse', 'Hipérbola'],
      requirements: ['Álgebra intermedia', 'Funciones básicas', 'Trigonometría elemental'],
      whatYouLearn: ['Ecuación de la recta en todas sus formas', 'Identificar y graficar cónicas', 'Resolver problemas geométricos algebraicamente', 'Calcular distancias y áreas'],
      totalLessons: 40, totalExercises: 90, totalVideos: 40, totalHours: 16,
      rating: 4.7, reviewCount: 145, studentCount: 890, isFeatured: false, isPublished: true,
    },
    {
      id: IDS.stats,
      title: 'Estadística y Probabilidad',
      slug: 'estadistica-probabilidad',
      shortDescription: 'Estadística descriptiva, inferencial y probabilidad aplicada',
      description: 'Aprende a analizar, interpretar y presentar datos estadísticos. Domina los conceptos de probabilidad, distribuciones y pruebas de hipótesis aplicadas a problemas reales.',
      category: 'statistics',
      level: 'intermediate',
      price: 34,
      originalPrice: 54,
      currency: 'usd',
      thumbnailUrl: THUMBS.stats,
      instructorName: 'Prof. Rodríguez',
      instructorBio: 'Estadístico con experiencia en análisis de datos para empresas e instituciones académicas.',
      topics: ['Estadística descriptiva', 'Medidas de dispersión', 'Gráficas estadísticas', 'Fundamentos de probabilidad', 'Distribuciones discretas', 'Distribución normal', 'Intervalos de confianza', 'Pruebas de hipótesis', 'Regresión lineal'],
      requirements: ['Álgebra básica', 'Fracciones y porcentajes'],
      whatYouLearn: ['Calcular medidas estadísticas', 'Construir gráficas', 'Calcular probabilidades', 'Realizar pruebas de hipótesis', 'Aplicar regresión lineal'],
      totalLessons: 50, totalExercises: 140, totalVideos: 50, totalHours: 20,
      rating: 4.9, reviewCount: 210, studentCount: 1560, isFeatured: true, isPublished: true,
    },
    {
      id: IDS.trig,
      title: 'Trigonometría Completa',
      slug: 'trigonometria-completa',
      shortDescription: 'Funciones trigonométricas, identidades y aplicaciones — GRATIS',
      description: 'Curso gratuito de trigonometría que cubre desde los ángulos y el círculo unitario hasta identidades trigonométricas avanzadas y ecuaciones.',
      category: 'trigonometry',
      level: 'intermediate',
      price: 0,
      originalPrice: 0,
      currency: 'usd',
      thumbnailUrl: THUMBS.trig,
      instructorName: 'Prof. Sánchez',
      instructorBio: 'Profesor de matemáticas de bachillerato con metodología basada en visualización.',
      topics: ['Ángulos: grados y radianes', 'Razones trigonométricas', 'Círculo unitario', 'Gráficas trig', 'Identidades fundamentales', 'Identidades de suma y diferencia', 'Ecuaciones trigonométricas', 'Ley de senos y cosenos'],
      requirements: ['Álgebra básica', 'Geometría elemental'],
      whatYouLearn: ['Convertir grados a radianes', 'Calcular razones trigonométricas exactas', 'Graficar funciones trigonométricas', 'Demostrar identidades', 'Resolver ecuaciones trigonométricas'],
      totalLessons: 30, totalExercises: 80, totalVideos: 30, totalHours: 12,
      rating: 4.6, reviewCount: 98, studentCount: 2100, isFeatured: false, isPublished: true,
    },
    {
      id: IDS.calcInt,
      title: 'Cálculo Integral',
      slug: 'calculo-integral',
      shortDescription: 'Integrales definidas, indefinidas y aplicaciones avanzadas',
      description: 'Domina el cálculo integral desde las antiderivadas hasta las integrales impropias y sus aplicaciones en física, ingeniería y economía.',
      category: 'calculus',
      level: 'advanced',
      price: 49,
      originalPrice: 79,
      currency: 'usd',
      thumbnailUrl: THUMBS.calcInt,
      instructorName: 'Prof. Martínez',
      instructorBio: 'Ingeniero y matemático con experiencia en enseñanza universitaria de cálculo avanzado.',
      topics: ['Antiderivadas e integrales indefinidas', 'Reglas básicas de integración', 'Integración por sustitución', 'Integración por partes', 'Fracciones parciales', 'Integral definida y TFC', 'Aplicaciones: área y volumen', 'Integrales impropias'],
      requirements: ['Cálculo Diferencial completo', 'Trigonometría sólida'],
      whatYouLearn: ['Técnicas avanzadas de integración', 'Calcular áreas entre curvas', 'Volúmenes de sólidos de revolución', 'Evaluar integrales impropias', 'Resolver EDOs de primer orden'],
      totalLessons: 70, totalExercises: 200, totalVideos: 70, totalHours: 28,
      rating: 4.9, reviewCount: 156, studentCount: 780, isFeatured: true, isPublished: true,
    },
  ];

  for (const course of courses) await put('courses', course);
  console.log(`  ✔  cursos insertados (${courses.length})`);
}

// ── Ejercicios ────────────────────────────────────────────────────────────────
async function seedExercises() {
  const exercises = [
    // Álgebra
    { id: uuidv4(), courseId: IDS.algebra, order: 1, difficulty: 'easy',
      title: 'Ecuación lineal simple', question: 'Resuelve para x: 3x - 7 = 14', type: 'multiple_choice',
      options: [{ id: 'a', text: 'x = 7' }, { id: 'b', text: 'x = 3' }, { id: 'c', text: 'x = 21' }, { id: 'd', text: 'x = -7' }],
      correctAnswer: 'a', explanation: '3x = 14 + 7 = 21 → x = 7' },
    { id: uuidv4(), courseId: IDS.algebra, order: 2, difficulty: 'medium',
      title: 'Factorización cuadrática', question: 'Factoriza: x² - 5x + 6', type: 'multiple_choice',
      options: [{ id: 'a', text: '(x - 2)(x - 3)' }, { id: 'b', text: '(x + 2)(x + 3)' }, { id: 'c', text: '(x - 1)(x - 6)' }, { id: 'd', text: '(x - 2)(x + 3)' }],
      correctAnswer: 'a', explanation: 'Buscamos dos números que multiplicados den 6 y sumados den -5: son -2 y -3.' },
    { id: uuidv4(), courseId: IDS.algebra, order: 3, difficulty: 'hard',
      title: 'Sistema de ecuaciones', question: 'Resuelve el sistema: 2x + y = 8 y x - y = 1. ¿Cuánto vale x?', type: 'multiple_choice',
      options: [{ id: 'a', text: 'x = 3' }, { id: 'b', text: 'x = 4' }, { id: 'c', text: 'x = 2' }, { id: 'd', text: 'x = 5' }],
      correctAnswer: 'a', explanation: 'Sumando las ecuaciones: 3x = 9 → x = 3. Sustituyendo: y = 2.' },

    // Cálculo Diferencial
    { id: uuidv4(), courseId: IDS.calcDif, order: 1, difficulty: 'easy',
      title: 'Derivada de un polinomio', question: "¿Cuál es la derivada de f(x) = 3x³ - 2x² + 5x - 1?", type: 'multiple_choice',
      options: [{ id: 'a', text: "9x² - 4x + 5" }, { id: 'b', text: "3x² - 2x + 5" }, { id: 'c', text: "6x² - 4x + 5" }, { id: 'd', text: "9x² + 4x - 5" }],
      correctAnswer: 'a', explanation: 'Regla de la potencia: 3·3x² - 2·2x + 5 = 9x² - 4x + 5' },
    { id: uuidv4(), courseId: IDS.calcDif, order: 2, difficulty: 'medium',
      title: 'Límite fundamental', question: '¿Cuánto vale lim(x→0) [sin(x)/x]?', type: 'multiple_choice',
      options: [{ id: 'a', text: '1' }, { id: 'b', text: '0' }, { id: 'c', text: 'Infinito' }, { id: 'd', text: 'No existe' }],
      correctAnswer: 'a', explanation: "Es uno de los límites notables: lim(x→0) sin(x)/x = 1." },
    { id: uuidv4(), courseId: IDS.calcDif, order: 3, difficulty: 'hard',
      title: 'Regla de la cadena', question: "Si h(x) = sin(x²), ¿cuál es h'(x)?", type: 'multiple_choice',
      options: [{ id: 'a', text: '2x·cos(x²)' }, { id: 'b', text: 'cos(x²)' }, { id: 'c', text: '2x·sin(x²)' }, { id: 'd', text: 'cos(2x)' }],
      correctAnswer: 'a', explanation: "Regla de la cadena: d/dx[sin(u)] = cos(u)·u'. Aquí u=x², u'=2x." },

    // Geometría
    { id: uuidv4(), courseId: IDS.geometry, order: 1, difficulty: 'easy',
      title: 'Distancia entre puntos', question: '¿Cuál es la distancia entre A(1, 2) y B(4, 6)?', type: 'multiple_choice',
      options: [{ id: 'a', text: '5' }, { id: 'b', text: '7' }, { id: 'c', text: '√13' }, { id: 'd', text: '4' }],
      correctAnswer: 'a', explanation: 'd = √[(4-1)² + (6-2)²] = √[9 + 16] = √25 = 5' },
    { id: uuidv4(), courseId: IDS.geometry, order: 2, difficulty: 'medium',
      title: 'Circunferencia', question: 'La circunferencia con centro (2, -3) y radio 5 tiene la ecuación:', type: 'multiple_choice',
      options: [{ id: 'a', text: '(x-2)² + (y+3)² = 25' }, { id: 'b', text: '(x+2)² + (y-3)² = 25' }, { id: 'c', text: '(x-2)² + (y+3)² = 5' }, { id: 'd', text: '(x-2)² - (y+3)² = 25' }],
      correctAnswer: 'a', explanation: 'Forma ordinaria: (x-h)² + (y-k)² = r². Con h=2, k=-3, r=5.' },
    { id: uuidv4(), courseId: IDS.geometry, order: 3, difficulty: 'hard',
      title: 'Tipo de cónica', question: '¿Qué cónica representa 4x² + 9y² = 36?', type: 'multiple_choice',
      options: [{ id: 'a', text: 'Elipse' }, { id: 'b', text: 'Hipérbola' }, { id: 'c', text: 'Circunferencia' }, { id: 'd', text: 'Parábola' }],
      correctAnswer: 'a', explanation: 'Dividiendo entre 36: x²/9 + y²/4 = 1. Forma estándar de elipse.' },

    // Estadística
    { id: uuidv4(), courseId: IDS.stats, order: 1, difficulty: 'easy',
      title: 'Media aritmética', question: 'El promedio del conjunto {4, 7, 13, 2, 8, 6} es:', type: 'multiple_choice',
      options: [{ id: 'a', text: '6.67' }, { id: 'b', text: '7' }, { id: 'c', text: '6' }, { id: 'd', text: '8' }],
      correctAnswer: 'a', explanation: 'Suma = 40. Media = 40/6 ≈ 6.67' },
    { id: uuidv4(), courseId: IDS.stats, order: 2, difficulty: 'medium',
      title: 'Probabilidad condicional', question: 'Si P(A)=0.4, P(B)=0.3 y P(A∩B)=0.12, ¿cuánto es P(A|B)?', type: 'multiple_choice',
      options: [{ id: 'a', text: '0.4' }, { id: 'b', text: '0.3' }, { id: 'c', text: '0.12' }, { id: 'd', text: '0.52' }],
      correctAnswer: 'a', explanation: 'P(A|B) = P(A∩B) / P(B) = 0.12 / 0.30 = 0.4' },
    { id: uuidv4(), courseId: IDS.stats, order: 3, difficulty: 'hard',
      title: 'Distribución normal', question: 'En una distribución normal, ¿qué porcentaje cae entre μ±2σ?', type: 'multiple_choice',
      options: [{ id: 'a', text: '95.44%' }, { id: 'b', text: '68.27%' }, { id: 'c', text: '99.73%' }, { id: 'd', text: '50%' }],
      correctAnswer: 'a', explanation: 'Regla empírica: ±1σ≈68.27%, ±2σ≈95.44%, ±3σ≈99.73%.' },

    // Trigonometría
    { id: uuidv4(), courseId: IDS.trig, order: 1, difficulty: 'easy',
      title: 'Valor exacto del seno', question: '¿Cuánto vale sin(30°)?', type: 'multiple_choice',
      options: [{ id: 'a', text: '1/2' }, { id: 'b', text: '√2/2' }, { id: 'c', text: '√3/2' }, { id: 'd', text: '1' }],
      correctAnswer: 'a', explanation: 'sin(30°) = sin(π/6) = 1/2. Valor fundamental del círculo unitario.' },
    { id: uuidv4(), courseId: IDS.trig, order: 2, difficulty: 'medium',
      title: 'Identidad pitagórica', question: 'Si cos(θ)=3/5 en Q1, ¿cuánto vale sin(θ)?', type: 'multiple_choice',
      options: [{ id: 'a', text: '4/5' }, { id: 'b', text: '3/4' }, { id: 'c', text: '5/3' }, { id: 'd', text: '-4/5' }],
      correctAnswer: 'a', explanation: 'sin²θ + cos²θ = 1 → sin²θ = 1 - 9/25 = 16/25 → sin(θ) = 4/5.' },
    { id: uuidv4(), courseId: IDS.trig, order: 3, difficulty: 'hard',
      title: 'Doble ángulo', question: 'Usando identidades, cos(2θ) cuando sin(θ)=1/3 vale:', type: 'multiple_choice',
      options: [{ id: 'a', text: '7/9' }, { id: 'b', text: '1/9' }, { id: 'c', text: '-7/9' }, { id: 'd', text: '2/3' }],
      correctAnswer: 'a', explanation: 'cos(2θ) = 1 - 2sin²θ = 1 - 2(1/9) = 7/9' },

    // Cálculo Integral
    { id: uuidv4(), courseId: IDS.calcInt, order: 1, difficulty: 'easy',
      title: 'Integral básica', question: '¿Cuál es la integral indefinida de x³?', type: 'multiple_choice',
      options: [{ id: 'a', text: 'x⁴/4 + C' }, { id: 'b', text: '3x² + C' }, { id: 'c', text: 'x⁴ + C' }, { id: 'd', text: '4x³ + C' }],
      correctAnswer: 'a', explanation: 'Regla de la potencia: ∫xⁿ dx = xⁿ⁺¹/(n+1) + C. Para n=3: x⁴/4 + C.' },
    { id: uuidv4(), courseId: IDS.calcInt, order: 2, difficulty: 'medium',
      title: 'Integral definida', question: '¿Cuánto vale ∫₀¹ x² dx?', type: 'multiple_choice',
      options: [{ id: 'a', text: '1/3' }, { id: 'b', text: '1/2' }, { id: 'c', text: '1' }, { id: 'd', text: '2/3' }],
      correctAnswer: 'a', explanation: '∫x² dx = x³/3. Evaluando: [x³/3]₀¹ = 1/3.' },
    { id: uuidv4(), courseId: IDS.calcInt, order: 3, difficulty: 'hard',
      title: 'Integración por partes', question: '¿Cuál es ∫ x·eˣ dx?', type: 'multiple_choice',
      options: [{ id: 'a', text: '(x - 1)eˣ + C' }, { id: 'b', text: 'x·eˣ + C' }, { id: 'c', text: '(x + 1)eˣ + C' }, { id: 'd', text: 'eˣ/x + C' }],
      correctAnswer: 'a', explanation: 'Por partes con u=x, dv=eˣdx: x·eˣ - ∫eˣdx = (x-1)eˣ + C.' },
  ];

  for (const ex of exercises) await put('exercises', ex);
  console.log(`  ✔  ejercicios insertados (${exercises.length})`);
}

// ── Videos ────────────────────────────────────────────────────────────────────
// youtubeId: IDs reales de videos educativos de matemáticas en YouTube.
// Thumbnails: generados automáticamente por YouTube — img.youtube.com/vi/{id}/mqdefault.jpg
async function seedVideos() {
  const videos = [
    // ── Álgebra ──────────────────────────────────────────────────────────────
    { id: uuidv4(), courseId: IDS.algebra, order: 1, isFree: true,
      category: 'algebra', courseName: 'Álgebra Desde Cero',
      title: 'Introducción al Álgebra', duration: 1245, viewCount: 4200,
      description: 'Qué es el álgebra y por qué es la base de todas las matemáticas avanzadas.',
      youtubeId: 'WUvTyaaNkzM',
      thumbnailUrl: 'https://img.youtube.com/vi/WUvTyaaNkzM/mqdefault.jpg' },
    { id: uuidv4(), courseId: IDS.algebra, order: 2, isFree: false,
      category: 'algebra', courseName: 'Álgebra Desde Cero',
      title: 'Expresiones Algebraicas y Simplificación', duration: 1832, viewCount: 3100,
      description: 'Aprende a escribir, leer y simplificar expresiones algebraicas.',
      youtubeId: 'fNk_zzaMoSs',
      thumbnailUrl: 'https://img.youtube.com/vi/fNk_zzaMoSs/mqdefault.jpg' },
    { id: uuidv4(), courseId: IDS.algebra, order: 3, isFree: false,
      category: 'algebra', courseName: 'Álgebra Desde Cero',
      title: 'Ecuaciones Lineales Paso a Paso', duration: 2100, viewCount: 2800,
      description: 'Método completo para resolver ecuaciones lineales con múltiples ejemplos.',
      youtubeId: 'kYB8IZa5AuE',
      thumbnailUrl: 'https://img.youtube.com/vi/kYB8IZa5AuE/mqdefault.jpg' },

    // ── Cálculo Diferencial ───────────────────────────────────────────────────
    { id: uuidv4(), courseId: IDS.calcDif, order: 1, isFree: true,
      category: 'calculus', courseName: 'Cálculo Diferencial',
      title: 'La Esencia del Cálculo — Introducción', duration: 1560, viewCount: 6800,
      description: 'Introducción intuitiva y visual al cálculo diferencial.',
      youtubeId: 'WUvTyaaNkzM',
      thumbnailUrl: 'https://img.youtube.com/vi/WUvTyaaNkzM/mqdefault.jpg' },
    { id: uuidv4(), courseId: IDS.calcDif, order: 2, isFree: false,
      category: 'calculus', courseName: 'Cálculo Diferencial',
      title: 'Límites: Concepto e Intuición', duration: 1980, viewCount: 5400,
      description: 'El concepto de límite explicado gráfica y algebraicamente.',
      youtubeId: '9vKqVkMQHKk',
      thumbnailUrl: 'https://img.youtube.com/vi/9vKqVkMQHKk/mqdefault.jpg' },
    { id: uuidv4(), courseId: IDS.calcDif, order: 3, isFree: false,
      category: 'calculus', courseName: 'Cálculo Diferencial',
      title: 'Regla de la Cadena y Producto', duration: 2400, viewCount: 4900,
      description: 'Regla del producto, cociente y de la cadena con ejemplos visuales.',
      youtubeId: 'YG15m2VwSjA',
      thumbnailUrl: 'https://img.youtube.com/vi/YG15m2VwSjA/mqdefault.jpg' },

    // ── Geometría ─────────────────────────────────────────────────────────────
    { id: uuidv4(), courseId: IDS.geometry, order: 1, isFree: true,
      category: 'geometry', courseName: 'Geometría Analítica',
      title: 'El Plano Cartesiano', duration: 900, viewCount: 2900,
      description: 'Sistema de coordenadas, cuadrantes y representación de puntos.',
      youtubeId: 'spUNpyF58BY',
      thumbnailUrl: 'https://img.youtube.com/vi/spUNpyF58BY/mqdefault.jpg' },
    { id: uuidv4(), courseId: IDS.geometry, order: 2, isFree: false,
      category: 'geometry', courseName: 'Geometría Analítica',
      title: 'Ecuación de la Recta', duration: 1800, viewCount: 2300,
      description: 'Pendiente-ordenada, punto-pendiente y forma general de la recta.',
      youtubeId: 'fNk_zzaMoSs',
      thumbnailUrl: 'https://img.youtube.com/vi/fNk_zzaMoSs/mqdefault.jpg' },
    { id: uuidv4(), courseId: IDS.geometry, order: 3, isFree: false,
      category: 'geometry', courseName: 'Geometría Analítica',
      title: 'Circunferencia, Parábola y Elipse', duration: 2160, viewCount: 1800,
      description: 'Ecuaciones ordinaria y general de las cónicas principales.',
      youtubeId: 'kYB8IZa5AuE',
      thumbnailUrl: 'https://img.youtube.com/vi/kYB8IZa5AuE/mqdefault.jpg' },

    // ── Estadística ───────────────────────────────────────────────────────────
    { id: uuidv4(), courseId: IDS.stats, order: 1, isFree: true,
      category: 'statistics', courseName: 'Estadística y Probabilidad',
      title: 'Estadística Descriptiva Básica', duration: 1320, viewCount: 3700,
      description: 'Media, mediana y moda. Cuándo usar cada medida y cómo calcularlas.',
      youtubeId: 'SzZ6GpcfoQY',
      thumbnailUrl: 'https://img.youtube.com/vi/SzZ6GpcfoQY/mqdefault.jpg' },
    { id: uuidv4(), courseId: IDS.stats, order: 2, isFree: false,
      category: 'statistics', courseName: 'Estadística y Probabilidad',
      title: 'Fundamentos de Probabilidad', duration: 1740, viewCount: 3100,
      description: 'Espacio muestral, eventos, reglas de adición y multiplicación.',
      youtubeId: 'SkidyDQuupA',
      thumbnailUrl: 'https://img.youtube.com/vi/SkidyDQuupA/mqdefault.jpg' },
    { id: uuidv4(), courseId: IDS.stats, order: 3, isFree: false,
      category: 'statistics', courseName: 'Estadística y Probabilidad',
      title: 'La Distribución Normal', duration: 2280, viewCount: 4200,
      description: 'Propiedades de la distribución normal, tabla Z y aplicaciones.',
      youtubeId: 'rzFX5NWojp0',
      thumbnailUrl: 'https://img.youtube.com/vi/rzFX5NWojp0/mqdefault.jpg' },

    // ── Trigonometría ─────────────────────────────────────────────────────────
    { id: uuidv4(), courseId: IDS.trig, order: 1, isFree: true,
      category: 'trigonometry', courseName: 'Trigonometría Completa',
      title: 'Ángulos, Grados y Radianes', duration: 1080, viewCount: 5100,
      description: 'Tipos de ángulos, conversión entre grados y radianes.',
      youtubeId: 'EnwWxMZVBeg',
      thumbnailUrl: 'https://img.youtube.com/vi/EnwWxMZVBeg/mqdefault.jpg' },
    { id: uuidv4(), courseId: IDS.trig, order: 2, isFree: true,
      category: 'trigonometry', courseName: 'Trigonometría Completa',
      title: 'Razones Trigonométricas (SOH-CAH-TOA)', duration: 1620, viewCount: 4700,
      description: 'Seno, coseno y tangente en el triángulo rectángulo.',
      youtubeId: 'QAQTGJKcpRs',
      thumbnailUrl: 'https://img.youtube.com/vi/QAQTGJKcpRs/mqdefault.jpg' },
    { id: uuidv4(), courseId: IDS.trig, order: 3, isFree: true,
      category: 'trigonometry', courseName: 'Trigonometría Completa',
      title: 'El Círculo Unitario', duration: 1800, viewCount: 6200,
      description: 'El círculo unitario y valores exactos de los ángulos especiales.',
      youtubeId: 'ZdrEbgad5e8',
      thumbnailUrl: 'https://img.youtube.com/vi/ZdrEbgad5e8/mqdefault.jpg' },

    // ── Cálculo Integral ──────────────────────────────────────────────────────
    { id: uuidv4(), courseId: IDS.calcInt, order: 1, isFree: true,
      category: 'calculus', courseName: 'Cálculo Integral',
      title: 'Antiderivadas e Integrales Indefinidas', duration: 1680, viewCount: 3800,
      description: 'Concepto de antiderivada, la constante de integración y reglas básicas.',
      youtubeId: 'rfG8ce4nNh0',
      thumbnailUrl: 'https://img.youtube.com/vi/rfG8ce4nNh0/mqdefault.jpg' },
    { id: uuidv4(), courseId: IDS.calcInt, order: 2, isFree: false,
      category: 'calculus', courseName: 'Cálculo Integral',
      title: 'La Integral Definida y el TFC', duration: 2040, viewCount: 3200,
      description: 'Sumas de Riemann, integral definida y el Teorema Fundamental del Cálculo.',
      youtubeId: 'FnJqaIESC2s',
      thumbnailUrl: 'https://img.youtube.com/vi/FnJqaIESC2s/mqdefault.jpg' },
    { id: uuidv4(), courseId: IDS.calcInt, order: 3, isFree: false,
      category: 'calculus', courseName: 'Cálculo Integral',
      title: 'Integración por Partes y Sustitución', duration: 2700, viewCount: 2900,
      description: 'Técnicas de sustitución trigonométrica e integración por partes.',
      youtubeId: '9vKqVkMQHKk',
      thumbnailUrl: 'https://img.youtube.com/vi/9vKqVkMQHKk/mqdefault.jpg' },
  ];

  for (const video of videos) await put('videos', video);
  console.log(`  ✔  videos insertados (${videos.length})`);
}

// ── Enrollments ───────────────────────────────────────────────────────────────
async function seedEnrollments() {
  const enrollments = [
    { id: uuidv4(), userId: IDS.testStudent, courseId: IDS.algebra, status: 'active', progress: 65, completedLessons: [], enrolledAt: new Date().toISOString() },
    { id: uuidv4(), userId: IDS.testStudent, courseId: IDS.trig,    status: 'active', progress: 30, completedLessons: [], enrolledAt: new Date().toISOString() },
  ];

  for (const e of enrollments) await put('enrollments', e);
  console.log(`  ✔  enrollments insertados (${enrollments.length})`);
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n🚀 Conectando a DynamoDB Local en ${ENDPOINT}...\n`);

  try {
    await rawClient.send(new ListTablesCommand({}));
  } catch {
    console.error('❌ No se pudo conectar a DynamoDB Local. ¿Está corriendo docker-compose up -d?\n');
    process.exit(1);
  }

  console.log('📦 Creando tablas...');
  await createTables();

  console.log('\n📝 Insertando datos...');
  await seedUsers();
  await seedCourses();
  await seedExercises();
  await seedVideos();
  await seedEnrollments();

  console.log('\n✅ Seed completado!\n');
  console.log('👤 Usuarios:');
  console.log('   Admin:      admin@mathpro.com      / Admin123!');
  console.log('   Estudiante: estudiante@mathpro.com  / Student123!\n');
}

main().catch(err => { console.error('Error:', err); process.exit(1); });
