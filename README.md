# MagNet

MagNet es una aplicación web orientada a personas en búsqueda de empleo. Su objetivo es centralizar ofertas laborales obtenidas desde fuentes externas y, progresivamente, analizarlas según el perfil, habilidades, experiencia y preferencias de cada usuario.

Actualmente el proyecto permite recuperar ofertas laborales reales desde **Get on Board**, normalizarlas mediante un servicio Python, almacenarlas en PostgreSQL a través de NestJS y visualizarlas desde un frontend desarrollado con Angular e Ionic.

La capacidad de compatibilidad laboral forma parte de la evolución prevista del proyecto y todavía no se considera completamente implementada.

## Descripción del problema

Existe una gran cantidad de ofertas laborales con requisitos y características diversas, lo que dificulta a las personas en búsqueda de empleo identificar rápidamente aquellas oportunidades que se ajustan mejor a su perfil, habilidades, intereses y preferencias.

MagNet busca reducir este problema mediante la centralización de ofertas y, posteriormente, mediante mecanismos de compatibilidad explicables entre el perfil del usuario y cada oportunidad laboral.

## Usuarios objetivo

Personas que se encuentren en búsqueda activa de empleo y utilicen plataformas web para consultar oportunidades laborales, independientemente de su área profesional o nivel de experiencia.

La fuente inicial utilizada actualmente tiene una mayor concentración de ofertas relacionadas con tecnología y trabajo digital, por lo que la cobertura de otras áreas dependerá de la incorporación futura de nuevas fuentes.

## Objetivo general

Desarrollar una plataforma que permita consultar oportunidades laborales reales y que evolucione hacia la generación de recomendaciones personalizadas, indicando el nivel de compatibilidad entre una oferta y el perfil del usuario.

## Estado actual del proyecto

Actualmente se encuentra implementado el flujo principal de recuperación y visualización de ofertas:

```text
Get on Board
    ↓
FastAPI / Python
    ↓
NestJS
    ↓
PostgreSQL
    ↓
Angular / Ionic
```

Entre las capacidades actualmente implementadas se encuentran:

- recuperación de ofertas reales desde Get on Board;
- normalización básica de los datos mediante FastAPI;
- importación de ofertas desde NestJS;
- persistencia de ofertas en PostgreSQL;
- actualización de ofertas ya existentes;
- prevención de duplicados mediante la combinación de fuente e identificador externo;
- consulta de ofertas almacenadas;
- visualización de ofertas desde Angular/Ionic;
- redirección hacia la publicación original;
- registro e inicio de sesión de usuarios;
- manejo controlado de indisponibilidad del servicio Python.

Algunas funcionalidades definidas en el alcance general todavía se encuentran en desarrollo o pendientes.

## Alcance

### Incluido en el alcance general

MagNet contempla:

- crear y gestionar cuentas de usuario;
- gestionar información de perfil profesional;
- registrar áreas de interés y preferencias laborales;
- consultar ofertas obtenidas desde fuentes web externas;
- filtrar ofertas según distintos criterios;
- calcular compatibilidad entre perfiles y ofertas;
- identificar requisitos de una oferta que no estén presentes en el perfil;
- redirigir al usuario al sitio original para consultar o postular a una oferta.

No todas estas funcionalidades se encuentran implementadas actualmente.

### Fuera de alcance

MagNet no contempla:

- realizar directamente procesos de contratación;
- gestionar la postulación dentro de los portales laborales externos;
- publicar ofertas laborales propias;
- realizar postulaciones automáticas en nombre del usuario;
- modificar información de una oferta externa.

## Funcionalidades implementadas

### Ofertas laborales

Actualmente el sistema permite:

- recuperar ofertas laborales reales;
- persistir ofertas en PostgreSQL;
- consultar ofertas almacenadas;
- actualizar registros existentes durante nuevas importaciones;
- evitar duplicados por fuente e identificador externo;
- visualizar información básica de las ofertas;
- acceder a la publicación original.

### Usuarios

El backend dispone actualmente de funcionalidades básicas relacionadas con:

- registro de usuarios;
- almacenamiento seguro del hash de contraseña;
- inicio de sesión y autenticación implementada en el backend.

### Manejo de errores

NestJS maneja de forma controlada errores de comunicación con FastAPI.

La indisponibilidad temporal del servicio Python no elimina las ofertas que ya se encuentran almacenadas en PostgreSQL.

## Funcionalidades pendientes o en desarrollo

Las siguientes capacidades forman parte del proyecto, pero no deben considerarse completamente implementadas todavía:

- perfil profesional completo;
- habilidades del usuario;
- preferencias laborales avanzadas;
- filtros completos de ofertas;
- índice de compatibilidad laboral;
- identificación automática de requisitos faltantes;
- ranking personalizado de ofertas;
- expiración automática de ofertas;
- actualización programada de ofertas;
- procesamiento avanzado de texto;
- adaptación automática del CV.

## Funcionalidades avanzadas futuras

Se contempla como evolución posterior:

- transformación del CV a formato LaTeX;
- adaptación del CV a una oferta específica;
- generación de recomendaciones sobre mejoras del CV;
- análisis del CV para mejorar su compatibilidad con sistemas ATS (*Applicant Tracking Systems*);
- sugerencias sobre estructura, secciones, palabras clave y formato para facilitar el procesamiento automático por ATS;
- comparación entre el contenido del CV y los requisitos de una oferta para identificar términos o competencias relevantes que podrían destacarse;
- autorización explícita del usuario antes de realizar modificaciones;
- prohibición de inventar experiencia, conocimientos o antecedentes que el usuario no haya proporcionado.

Las mejoras orientadas a ATS deberán conservar la veracidad del CV. MagNet podrá reorganizar, resumir o destacar información existente, pero no generar experiencia, habilidades o antecedentes falsos con el objetivo de aumentar artificialmente la coincidencia con una oferta.

## Fuente de información web

La fuente externa inicial seleccionada es **Get on Board**.

MagNet utiliza su API pública para recuperar ofertas laborales reales.

La integración conserva información de procedencia como:

- fuente;
- identificador externo;
- URL original;
- fecha de publicación cuando está disponible;
- fecha de recuperación.

El sistema utiliza Get on Board únicamente como fuente inicial. La arquitectura está diseñada para permitir la incorporación futura de otras fuentes mediante adaptadores y un modelo normalizado común.

La política de uso de esta fuente se encuentra documentada en:

```text
docs/external-source-policy.md
```

La estrategia de actualización de ofertas se encuentra documentada en:

```text
docs/jobs-update-strategy.md
```

## Arquitectura

MagNet utiliza una arquitectura distribuida compuesta actualmente por cuatro componentes principales.

### Frontend

Tecnologías:

- Angular;
- Ionic.

Responsabilidades:

- interfaz de usuario;
- navegación;
- autenticación desde el cliente;
- visualización de ofertas;
- interacción futura con perfiles y compatibilidad.

El frontend se comunica únicamente con NestJS.

### Backend principal

Tecnología:

- NestJS.

Responsabilidades:

- API REST principal;
- autenticación y autorización;
- lógica de aplicación;
- gestión de usuarios;
- persistencia;
- acceso a PostgreSQL;
- integración con FastAPI;
- manejo de errores hacia el frontend.

NestJS es el propietario principal de la persistencia del sistema.

### Servicio Python

Tecnologías:

- Python;
- FastAPI.

Responsabilidades actuales:

- comunicación con Get on Board;
- recuperación de ofertas;
- transformación y normalización de información.

Responsabilidades previstas:

- procesamiento de texto;
- extracción de características;
- cálculo de compatibilidad laboral.

FastAPI funciona como un servicio especializado y no como una segunda API pública para el frontend.

### Base de datos

Tecnología:

- PostgreSQL.

Actualmente contiene información asociada a:

- usuarios;
- ofertas laborales.

NestJS administra la persistencia mediante TypeORM y migraciones.

## Flujo de recuperación de ofertas

El flujo implementado actualmente es:

```text
Get on Board
      ↓
FastAPI
      ↓
NestJS
      ↓
PostgreSQL
```

Posteriormente, para mostrar las ofertas:

```text
PostgreSQL
      ↓
NestJS
      ↓
Angular / Ionic
      ↓
Usuario
```

## Documentación de arquitectura

Los principales documentos técnicos se encuentran en:

```text
docs/architecture/context-diagram.md
docs/architecture/container-diagram.md
docs/architecture/data-model.md
```

Las decisiones arquitectónicas se encuentran registradas en:

```text
docs/adr/ADR-001-get-on-board-source.md
docs/adr/ADR-002-nestjs-fastapi-separation.md
```

## Capacidad adaptativa

La capacidad adaptativa de MagNet tiene como objetivo comparar información del perfil del usuario con los requisitos de una oferta laboral.

Se proyecta utilizar información como:

- habilidades;
- experiencia;
- áreas de interés;
- ubicación;
- preferencias laborales;
- requisitos extraídos desde la oferta.

El resultado previsto incluye:

- un índice de compatibilidad;
- factores que contribuyeron al resultado;
- requisitos coincidentes;
- requisitos faltantes.

Esta funcionalidad todavía se encuentra en etapa de diseño y desarrollo y no debe considerarse terminada.

## Estructura general del repositorio

```text
MagNet/
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

## Seguimiento del desarrollo

El desarrollo y estado de las tareas del proyecto se registran en:

```text
PLAN_DESARROLLO.md
```

Este documento funciona como backlog y referencia central para identificar tareas completadas, en desarrollo, pendientes o bloqueadas.