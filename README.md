# MagNet

MagNet es una plataforma web orientada a personas en búsqueda de empleo. Su objetivo es centralizar ofertas laborales reales y ayudar al usuario a identificar cuáles se ajustan mejor a su perfil mediante un mecanismo de compatibilidad explicable.

El sistema recupera ofertas desde **Get on Board**, procesa y normaliza la información mediante un servicio especializado en Python, la almacena en PostgreSQL a través de NestJS y la presenta desde una aplicación desarrollada con Angular e Ionic.

Además, MagNet permite mantener un perfil profesional, analizar un CV en formato PDF para detectar habilidades y comparar dichas habilidades con los requisitos identificados en cada oferta.

---

## Problema

Las personas en búsqueda de empleo deben revisar grandes cantidades de ofertas con requisitos, tecnologías y características diferentes.

Esto dificulta responder rápidamente preguntas como:

- ¿qué ofertas coinciden mejor con mi perfil?;
- ¿qué habilidades mías aparecen en una oferta?;
- ¿qué requisitos me faltan?;
- ¿qué oportunidades debería revisar primero?

MagNet busca reducir este esfuerzo mediante la centralización de ofertas y un mecanismo de comparación transparente entre el perfil del usuario y las características detectadas en cada oportunidad.

---

## Usuarios objetivo

MagNet está dirigido a personas en búsqueda activa de empleo que utilizan plataformas digitales para consultar oportunidades laborales.

Actualmente la fuente utilizada, Get on Board, tiene una concentración importante de ofertas relacionadas con tecnología y trabajo digital. Por esta razón, la cobertura actual del sistema presenta un sesgo hacia ese tipo de perfiles.

La arquitectura permite incorporar nuevas fuentes en el futuro.

---

# Funcionalidades principales

## Autenticación

El sistema permite:

- registro de usuarios;
- inicio de sesión;
- autenticación mediante JWT;
- acceso protegido al perfil del usuario;
- almacenamiento seguro del hash de contraseña.

---

## Perfil profesional

Cada usuario puede mantener información como:

- ubicación;
- habilidades;
- áreas de interés;
- años de experiencia;
- preferencia por trabajo remoto.

Los cambios se almacenan en PostgreSQL y posteriormente son utilizados por el mecanismo de compatibilidad.

El usuario mantiene el control sobre la información que forma parte de su perfil.

---

## Análisis de CV

MagNet permite cargar un CV en formato PDF.

El flujo actual es:

```text
Usuario
   ↓
Angular / Ionic
   ↓
NestJS
   ↓
FastAPI
   ↓
Extracción de texto del PDF
   ↓
Detección de habilidades
   ↓
Habilidades sugeridas al usuario
```

Las habilidades detectadas **no se incorporan automáticamente al perfil**.

El sistema presenta las habilidades encontradas y el usuario decide si desea agregarlas y posteriormente guardar los cambios.

Esta decisión permite conservar control humano sobre los datos utilizados por el sistema adaptativo.

Actualmente:

- se aceptan archivos PDF;
- existe validación de tipo de archivo;
- existe un límite de tamaño para el archivo;
- la extracción utiliza `pypdf`;
- la detección de habilidades utiliza un catálogo normalizado de tecnologías y expresiones conocidas.

---

# Ofertas laborales

MagNet utiliza actualmente la API pública de **Get on Board** como fuente externa.

El sistema permite:

- recuperar ofertas reales;
- limpiar y normalizar información;
- detectar habilidades presentes en las ofertas;
- evitar duplicados;
- actualizar ofertas previamente importadas;
- almacenar ofertas en PostgreSQL;
- consultar ofertas mediante NestJS;
- filtrar resultados;
- visualizar las ofertas desde Angular/Ionic;
- acceder a la publicación original.

Las ofertas conservan información de procedencia como:

- fuente;
- identificador externo;
- URL original;
- fecha de publicación cuando está disponible;
- fecha de recuperación.

La combinación de fuente e identificador externo permite evitar duplicados durante nuevas importaciones.

---

# Compatibilidad laboral

MagNet incluye una capacidad adaptativa que compara las habilidades guardadas en el perfil del usuario con las habilidades detectadas en cada oferta.

Actualmente se consideran principalmente:

```text
habilidades del usuario
        +
habilidades detectadas en la oferta
```

El porcentaje se calcula sobre los requisitos detectados en la oferta:

```text
compatibilidad =
habilidades coincidentes
──────────────────────────── × 100
habilidades detectadas en la oferta
```

Por ejemplo:

```text
Perfil:
Angular, Git, Java

Oferta:
Angular, Git, Java, Spring, Docker

Coincidencias:
Angular, Git, Java

Faltantes:
Spring, Docker

Compatibilidad:
60 %
```

El sistema devuelve:

- porcentaje de compatibilidad;
- habilidades coincidentes;
- habilidades faltantes;
- explicación textual del resultado.

La interfaz muestra esta información dentro de cada oferta para que el usuario pueda comprender por qué obtuvo determinado resultado.

Las ofertas pueden utilizar esta información para priorizar resultados relevantes para el perfil autenticado.

---

## Explicabilidad y control del usuario

MagNet evita presentar la compatibilidad como una decisión absoluta.

El porcentaje corresponde solamente a las variables actualmente procesadas por el sistema.

El usuario puede:

- modificar manualmente sus habilidades;
- revisar habilidades obtenidas desde su CV;
- decidir cuáles incorporar;
- modificar sus preferencias;
- revisar tanto coincidencias como requisitos faltantes.

El resultado debe interpretarse como una ayuda para priorizar ofertas y no como una evaluación definitiva de la capacidad profesional del usuario.

---

# Limitaciones de la compatibilidad

La implementación actual utiliza extracción determinista basada en patrones y habilidades conocidas.

Por lo tanto:

- una tecnología puede no detectarse si no forma parte del catálogo;
- una descripción ambigua puede producir detecciones imperfectas;
- una habilidad mencionada no necesariamente representa un requisito obligatorio;
- requisitos deseables y obligatorios todavía no reciben pesos diferentes;
- tecnologías relacionadas pueden requerir normalización adicional;
- el porcentaje no representa la probabilidad real de ser contratado;
- experiencia, estudios y habilidades blandas todavía no tienen el mismo peso que las habilidades técnicas.

Estas limitaciones forman parte de la evaluación del mecanismo adaptativo y deben considerarse al interpretar los resultados.

---

# Arquitectura

MagNet utiliza una arquitectura distribuida.

```text
                    ┌──────────────────┐
                    │   Get on Board   │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Python / FastAPI │
                    │                  │
                    │ - extracción     │
                    │ - normalización  │
                    │ - skills         │
                    │ - compatibilidad │
                    └────────┬─────────┘
                             │
                             ▼
┌──────────────────┐   ┌──────────────────┐
│ Angular / Ionic  │──▶│ NestJS           │
│                  │◀──│                  │
│ Frontend         │   │ API principal    │
└──────────────────┘   └────────┬─────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │ PostgreSQL       │
                       └──────────────────┘
```

El frontend se comunica únicamente con NestJS.

NestJS funciona como API principal, administra autenticación, usuarios, persistencia e integración con el servicio Python.

FastAPI funciona como un servicio especializado para procesamiento de información y no como API directa del frontend.

---

# Componentes

## Frontend

Tecnologías:

- Angular;
- Ionic;
- TypeScript.

Responsabilidades:

- navegación;
- autenticación;
- gestión del perfil;
- carga de CV;
- consulta y filtrado de ofertas;
- visualización de compatibilidad;
- redirección hacia la fuente original.

---

## Backend

Tecnologías:

- NestJS;
- TypeScript;
- TypeORM.

Responsabilidades:

- API REST principal;
- autenticación JWT;
- usuarios;
- perfiles;
- persistencia;
- ofertas laborales;
- integración con FastAPI;
- compatibilidad personalizada;
- manejo de errores.

NestJS es el propietario principal de la persistencia.

---

## Servicio Python

Tecnologías principales:

- Python;
- FastAPI;
- HTTPX;
- pypdf.

Responsabilidades:

- comunicación con Get on Board;
- recuperación de ofertas;
- limpieza;
- normalización;
- deduplicación previa;
- extracción de habilidades;
- procesamiento de CV;
- cálculo determinista de compatibilidad.

---

## Base de datos

Tecnología:

- PostgreSQL.

Almacena actualmente:

- usuarios;
- información de perfil;
- habilidades;
- intereses;
- preferencias;
- ofertas laborales;
- habilidades detectadas por oferta.

NestJS administra el esquema mediante TypeORM y migraciones.

---

# Flujo de información web

La recuperación de ofertas funciona de la siguiente forma:

```text
Get on Board
      ↓
FastAPI
      ↓
limpieza / normalización
      ↓
extracción de habilidades
      ↓
NestJS
      ↓
PostgreSQL
```

Posteriormente:

```text
PostgreSQL
      ↓
NestJS
      ↓
Angular / Ionic
      ↓
Usuario
```

Para usuarios autenticados también existe el flujo:

```text
Perfil del usuario
      +
Oferta laboral
      ↓
NestJS
      ↓
FastAPI
      ↓
Compatibilidad
      ↓
Angular / Ionic
```

---

# API principal

Algunos endpoints relevantes del backend son:

```text
GET    /health

POST   /auth/register
POST   /auth/login
GET    /auth/profile
PATCH  /auth/profile
POST   /auth/profile/cv

GET    /jobs
POST   /jobs/import

GET    /compatibility/jobs/:jobId
```

El endpoint de perfil, análisis de CV y compatibilidad personalizada requieren autenticación mediante JWT.

---

# Servicio Python

Endpoints relevantes:

```text
GET  /health

GET  /jobs/fetch
POST /skills/extract
POST /cv/analyze
POST /compatibility
```

Estos endpoints soportan las operaciones especializadas utilizadas por el backend.

---

# Filtros de ofertas

La interfaz permite filtrar ofertas según parámetros como:

- texto;
- ubicación;
- modalidad remota;
- categoría.

NestJS obtiene los resultados persistidos desde PostgreSQL y el frontend no consulta directamente la fuente externa.

---

# Manejo de errores

La arquitectura mantiene separada la disponibilidad de las ofertas persistidas de la disponibilidad de la fuente externa.

Si temporalmente Get on Board o FastAPI no pueden recuperar información nueva:

- las ofertas previamente almacenadas permanecen disponibles;
- el backend controla errores de comunicación;
- el frontend puede continuar consultando información existente.

Esto evita que una falla temporal de la fuente externa elimine los datos ya recuperados.

---

# Seguridad

Entre las medidas implementadas se encuentran:

- contraseñas almacenadas mediante hash;
- autenticación JWT;
- rutas de perfil protegidas;
- validación de DTOs;
- manejo de variables sensibles mediante variables de entorno;
- `.env` excluido del repositorio;
- escaneo de secretos en CI;
- auditoría de dependencias Python;
- auditoría de dependencias del ecosistema Node;
- análisis de imágenes Docker;
- construcción reproducible mediante contenedores.

Los secretos de producción y staging no deben almacenarse en el repositorio.

---

# Privacidad y ética

MagNet procesa información profesional proporcionada por el usuario.

El sistema debe evitar utilizar esta información para decisiones automatizadas opacas.

Principios aplicados actualmente:

- el usuario controla las habilidades almacenadas;
- las habilidades obtenidas desde un CV requieren confirmación;
- el resultado de compatibilidad es explicable;
- se muestran requisitos coincidentes y faltantes;
- no se realizan postulaciones automáticas;
- no se modifica información de una oferta externa;
- no se deben inventar habilidades, experiencia o antecedentes del usuario.

La información derivada del CV se utiliza como ayuda para completar el perfil, no como una fuente automática e incuestionable.

---

# Sesgos y limitaciones

Actualmente existe un sesgo importante asociado a la fuente de datos.

Get on Board concentra gran parte de sus ofertas en:

- tecnología;
- desarrollo de software;
- productos digitales;
- áreas relacionadas.

Por lo tanto, MagNet no debe asumir que la distribución actual de ofertas representa todo el mercado laboral.

El catálogo utilizado para detectar habilidades también puede favorecer tecnologías explícitamente incluidas en sus patrones.

La incorporación futura de nuevas fuentes y una evaluación más amplia del extractor permitiría reducir estas limitaciones.

---

# Testing

El proyecto dispone de pruebas automatizadas para los distintos componentes.

## Backend

Desde:

```bash
cd backend
```

Ejecutar:

```bash
npm test
npm run build
```

---

## Python

Desde:

```bash
cd python-service
```

Ejecutar:

```bash
pytest -q
python -m ruff check .
python -m pip_audit -r requirements.txt
```

---

## Frontend

Desde:

```bash
cd frontend
```

Ejecutar:

```bash
npm test -- --watch=false
npm run build
```

Actualmente las suites utilizadas por el pipeline se encuentran en estado verde.

---

# Integración continua

El repositorio utiliza GitHub Actions.

El pipeline verifica, entre otros aspectos:

- lint;
- tests;
- builds;
- dependencias;
- secretos;
- imágenes Docker;
- vulnerabilidades;
- validación de Terraform.

El objetivo es impedir que cambios que no superen los controles definidos sean considerados candidatos válidos para despliegue.

---

# Docker

Los componentes principales pueden ejecutarse mediante Docker Compose.

Desde la raíz:

```bash
docker compose up -d
```

Para reconstruir los servicios:

```bash
docker compose build
docker compose up -d
```

Para revisar su estado:

```bash
docker compose ps
```

Para detenerlos:

```bash
docker compose down
```

Los servicios principales son:

```text
frontend
backend
python-service
postgres
```

---

# Ejecución local

## 1. Clonar el repositorio

```bash
git clone https://github.com/himehaku/MagNet.git
cd MagNet
```

---

## 2. Configurar variables

Crear el archivo local de variables utilizando como referencia:

```text
.env.example
```

Los secretos reales no deben versionarse.

Entre las configuraciones de comunicación relevantes se encuentran:

```text
PYTHON_SERVICE_URL
FRONTEND_URL
```

además de las variables necesarias para PostgreSQL, autenticación y los distintos servicios.

---

## 3. Iniciar servicios

```bash
docker compose up -d --build
```

---

## 4. Verificar backend

```text
http://localhost:3000/health
```

---

## 5. Verificar servicio Python

```text
http://localhost:8000/health
```

---

## 6. Acceder al frontend

```text
http://localhost:4200
```

---

# Importación de ofertas

En desarrollo local puede solicitarse una importación desde el backend:

```text
POST /jobs/import?limit=20
```

El backend solicita las ofertas al servicio Python, las normaliza y finalmente realiza inserciones o actualizaciones en PostgreSQL.

El parámetro `limit` permite controlar la cantidad solicitada a la fuente externa.

---

# Staging

MagNet dispone de un entorno desplegado para evaluación.

## Frontend

```text
https://magnet-frontend-fiqd.onrender.com
```

## Backend

```text
https://magnet-backend-g7xh.onrender.com
```

PostgreSQL y el servicio Python también se ejecutan como servicios asociados al entorno de staging.

Antes de una entrega se verifica el flujo:

```text
registro / login
      ↓
perfil
      ↓
carga de CV
      ↓
confirmación de habilidades
      ↓
consulta de ofertas
      ↓
compatibilidad
      ↓
oferta original
```

---

# Infraestructura

El repositorio contiene configuración de infraestructura en:

```text
infra/
```

La configuración Terraform forma parte del proceso de validación DevSecOps.

El pipeline comprueba formato y validez de la configuración.

La infraestructura actual no debe interpretarse como una representación completa de todos los recursos administrados automáticamente mediante IaC; constituye una de las áreas con posibilidades de evolución del proyecto.

---

# Documentación técnica

Los documentos de arquitectura se encuentran principalmente en:

```text
docs/architecture/
```

Entre ellos:

```text
docs/architecture/context-diagram.md
docs/architecture/container-diagram.md
docs/architecture/data-model.md
```

Las decisiones arquitectónicas se documentan mediante ADR:

```text
docs/adr/ADR-001-get-on-board-source.md
docs/adr/ADR-002-nestjs-fastapi-separation.md
```

También existen documentos dedicados a la fuente externa y estrategia de actualización:

```text
docs/external-source-policy.md
docs/jobs-update-strategy.md
```

---

# Estructura del repositorio

```text
MagNet/
├── .github/
│   └── workflows/
├── backend/
├── frontend/
├── python-service/
├── infra/
├── docs/
│   ├── architecture/
│   └── adr/
├── docker-compose.yml
├── .env.example
├── PLAN_DESARROLLO.md
└── README.md
```

---

# Fuera de alcance

MagNet no realiza actualmente:

- procesos de contratación;
- publicación de ofertas propias;
- postulaciones automáticas;
- postulación dentro de MagNet;
- modificación de publicaciones externas;
- decisiones automáticas de contratación;
- invención de experiencia o habilidades para mejorar artificialmente la compatibilidad.

El usuario siempre es redirigido hacia la publicación original para continuar el proceso.

---

# Posibles evoluciones

Entre las extensiones consideradas se encuentran:

- incorporación de nuevas fuentes;
- extracción más avanzada de requisitos;
- diferenciación entre requisitos obligatorios y deseables;
- ponderación por experiencia;
- mejora del ranking personalizado;
- procesamiento semántico;
- análisis avanzado de CV;
- recomendaciones de mejora del CV;
- optimización de estructura para sistemas ATS;
- adaptación controlada del CV a una oferta;
- comparación de resultados mediante métricas adicionales.

Cualquier modificación futura de un CV deberá respetar la información proporcionada por el usuario y no inventar antecedentes, experiencia ni conocimientos.

---

# Seguimiento del desarrollo

El backlog técnico y académico se encuentra en:

```text
PLAN_DESARROLLO.md
```

Este documento registra tareas, dependencias, prioridades y criterios de aceptación.

---

# Estado actual

Actualmente MagNet dispone de un flujo funcional que integra:

```text
Fuente externa real
        ↓
procesamiento Python
        ↓
NestJS
        ↓
PostgreSQL
        ↓
Angular / Ionic
```

junto con:

```text
Usuario
   ↓
Perfil
   ↓
CV
   ↓
Habilidades confirmadas
   ↓
Comparación con ofertas
   ↓
Compatibilidad explicable
```

El proyecto cuenta además con pruebas automatizadas, contenedores, pipeline CI, controles de seguridad, staging y documentación técnica.

El objetivo de MagNet no es decidir por el usuario, sino reducir el esfuerzo necesario para identificar oportunidades relevantes y explicar qué aspectos de su perfil coinciden o no con una oferta.