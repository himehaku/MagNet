# PLAN_DESARROLLO.md — MagNet

> Documento central de planificación y seguimiento del Proyecto Final de Ingeniería Web Avanzada.
>
> **Regla de seguimiento:** una tarea solo pasa a **completada** cuando cumple sus criterios de aceptación y existe evidencia verificable en el repositorio, pipeline, base de datos, staging o demostración funcional.

---

## 1. Resumen y objetivo de MagNet

**MagNet** es una aplicación web/móvil orientada a personas que buscan empleo. Su objetivo es recuperar ofertas laborales reales desde fuentes externas, normalizarlas y almacenarlas para que los usuarios puedan consultarlas, comparar sus requisitos con su perfil y recibir una explicación de compatibilidad que incluya coincidencias y requisitos faltantes. La aplicación debe redirigir siempre a la publicación original de la oferta.

### Objetivo funcional actual

El flujo principal previsto es:

```text
Fuente web de empleos
        ↓
Python + FastAPI
(recuperación, limpieza, normalización, deduplicación, métricas)
        ↓
NestJS
(validación, lógica de negocio, persistencia, API principal)
        ↓
PostgreSQL
        ↓
Angular + Ionic
(consulta, visualización y futura compatibilidad)
```

La capacidad adaptativa/inteligente propuesta consiste en calcular un **índice explicable de compatibilidad laboral** entre el perfil del usuario y una oferta, mostrando porcentaje, requisitos coincidentes y requisitos faltantes. La implementación final del mecanismo todavía no se considera terminada.

---

## 2. Arquitectura y tecnologías conocidas

| Capa | Tecnología / decisión | Estado conocido |
|---|---|---|
| Frontend | Angular + TypeScript | Parcialmente implementado |
| UI multiplataforma | Ionic | Integrado, uso todavía incompleto |
| Android | Capacitor | Configuración inicial y proyecto Android creados |
| PWA | Angular/Ionic PWA | Pendiente / no confirmado |
| Backend principal | NestJS | Implementado como backend principal |
| Persistencia | PostgreSQL + TypeORM | Funcional para usuarios; extensión a ofertas en desarrollo |
| Servicio especializado | Python + FastAPI | Funcional; compatibilidad básica y recuperación web en desarrollo |
| Fuente web | Get on Board API pública | Recuperación real comprobada; adopción formal/documentación pendiente |
| Autenticación | JWT + Passport + bcrypt | Básica implementada |
| Autorización | Roles/permisos | Pendiente o no verificada |
| Contenedores | Docker + Docker Compose | Cuatro servicios ejecutándose; reproducibilidad completa por verificar |
| CI/CD | GitHub Actions | Crítico: workflow vacío/incompleto y ejecuciones fallidas según profesor |
| IaC | Terraform | Estructura inicial, contenido insuficiente |
| Staging | Por definir/implementar | Pendiente |
| Observabilidad | health endpoints + logs básicos | Parcial |

---

## 3. Estado actual conocido del proyecto

### 3.1 Implementado y con evidencia previa

- [x] Proyecto Angular creado y ejecutable.
- [x] Ionic integrado con Angular.
- [x] Capacitor configurado y plataforma Android agregada inicialmente.
- [x] Navegación básica con rutas para home, registro, login y perfil.
- [x] Frontend puede consultar el health del backend.
- [x] Registro de usuarios Angular → NestJS → PostgreSQL.
- [x] Login básico con JWT.
- [x] Endpoint protegido de perfil en NestJS.
- [x] NestJS organizado por módulos principales.
- [x] PostgreSQL conectado mediante TypeORM.
- [x] Entidad y migración inicial de usuarios.
- [x] Endpoint `/health` de NestJS.
- [x] FastAPI ejecutándose como servicio separado.
- [x] Endpoint `/health` de FastAPI.
- [x] Endpoint inicial `/compatibility` en Python.
- [x] NestJS puede comunicarse con FastAPI para compatibilidad.
- [x] Dockerfile de frontend.
- [x] Dockerfile de backend.
- [x] Dockerfile de servicio Python.
- [x] PostgreSQL en Docker Compose.
- [x] Docker Compose levanta backend, frontend, Python y PostgreSQL.
- [x] PostgreSQL del contenedor tiene el rol `magnet` y se ha verificado healthy.
- [x] Get on Board devuelve ofertas reales mediante FastAPI.
- [x] Se comprobó recuperación de al menos 3 ofertas reales.
- [x] El mapper Python actual extrae y normaliza campos principales de ofertas.

### 3.2 En desarrollo / parcialmente implementado

- [-] Módulo `jobs` de NestJS: estructura, entidad y código inicial preparados, pero persistencia end-to-end todavía no demostrada.
- [-] Migración `jobs`: bloqueada por un problema de conexión/resolución al ejecutar TypeORM CLI.
- [-] Deduplicación: existe lógica básica en Python y diseño de restricción `source + externalId`, pero falta evidencia en PostgreSQL.
- [-] Compatibilidad laboral: existe algoritmo básico por coincidencia de skills, pero falta especificación formal del mecanismo, variables, fórmula, límites y evaluación.
- [-] Autenticación frontend: funciona en forma básica, pero falta una separación Angular adecuada con guards/interceptors y manejo centralizado.
- [-] Seguridad de variables: existen `.env`, `.env.example` y `.gitignore` en alguna medida; falta auditoría completa y evidencia.
- [-] Tests Python: se trabajó su estructura, pero el estado actual de ejecución no está confirmado.
- [-] Tests NestJS: configuración Jest fue modificada; no está confirmado que la suite pase.
- [-] README: contiene propósito del proyecto, pero faltan instrucciones reproducibles.
- [-] Arquitectura/documentación: existe estructura de docs, pero no está confirmado que todos los diagramas/ADR requeridos estén completos.

### 3.3 Pendiente / sin evidencia suficiente

- [ ] Página Angular de ofertas reales.
- [ ] Servicio Angular dedicado a jobs.
- [ ] Modelos/interfaces frontend para ofertas.
- [ ] Guard de rutas Angular formal.
- [ ] Interceptor JWT y manejo centralizado de errores.
- [ ] Persistencia final de ofertas recuperadas.
- [ ] Consulta `/jobs` funcional demostrada desde PostgreSQL.
- [ ] Búsqueda/filtrado inicial de ofertas.
- [ ] Métrica formal de calidad de recuperación.
- [ ] Escenario documentado de indisponibilidad de fuente/FastAPI.
- [ ] Swagger/OpenAPI NestJS.
- [ ] Pipeline CI/CD funcional.
- [ ] Análisis estático, dependencias, secretos e imágenes Docker en CI.
- [ ] Terraform válido y plan reproducible.
- [ ] Staging automatizado y accesible.
- [ ] Health checks posteriores al despliegue.
- [ ] Request/correlation ID.
- [ ] Métrica de tiempo de respuesta.
- [ ] PWA demostrable.
- [ ] Android final demostrable.
- [ ] Tag/release oficial de la próxima entrega.

---

## 4. Observaciones del profesor convertidas en acciones

| Obs. | Corrección solicitada | Estado | Tareas asociadas |
|---|---|---|---|
| P-01 | Definir definitivamente la fuente web | En desarrollo | WEB-001, WEB-002, WEB-003 |
| P-02 | Especificar mecanismo de compatibilidad | Pendiente | ADAPT-001, ADAPT-002, ADAPT-003 |
| P-03 | CI vacío y ejecuciones fallidas | Crítica / pendiente | CI-001 a CI-009 |
| P-04 | Frontend muy incompleto en separación Angular | Parcial | FE-001 a FE-010 |
| P-05 | Aclarar función específica del servicio Python | Parcial | PY-001 a PY-008 |
| P-06 | Revisar seguridad/variables/credenciales | Parcial | SEC-001 a SEC-007 |
| P-07 | Terraform sin código base suficiente | Pendiente | INFRA-001 a INFRA-006 |
| P-08 | README insuficiente | Pendiente | DOC-001 a DOC-006 |
| P-09 | Documentar instalación, variables, Compose y tests | Pendiente | DOC-002, DOC-003, DOC-004 |
| P-10 | Crear tag oficial por entrega | Pendiente | REL-001, REL-002 |

**Regla:** ninguna observación se considera resuelta solo porque exista código local; debe existir evidencia versionada y verificable.

---

## 5. Matriz de cumplimiento académico

### Leyenda

- **Completado:** evidencia conocida y funcional.
- **Parcial:** existe parte importante, pero falta integración/evidencia/requisito.
- **Pendiente:** no existe evidencia suficiente.
- **Por verificar:** puede existir, pero no se debe asumir.
- **Futuro:** requisito del proyecto final no obligatorio todavía para EP2.

| Área académica | Requisito | Entrega | Estado | Evidencia / brecha |
|---|---|---|---|---|
| Frontend | Angular + TypeScript | EP1/Final | Parcial | App funciona, pero arquitectura Angular incompleta |
| Frontend | Ionic integrado | EP1/Final | Parcial | Integrado; falta mayor uso funcional/adaptativo |
| Frontend | Capacitor Android | EP1/Final | Parcial | Configuración inicial completada |
| Frontend | PWA | Final | Pendiente | Sin evidencia |
| Frontend | Router | EP1/Final | Completado básico | Rutas principales existentes |
| Frontend | Formularios reactivos | Final | Por verificar | No asumir implementación correcta |
| Frontend | Servicios Angular | EP1/Final | Parcial | Comunicación existe, separación insuficiente |
| Frontend | Interceptores | Final | Pendiente | JWT/error handling centralizado ausente |
| Frontend | Guards | Final | Pendiente | Perfil protegido manualmente, no guard formal |
| Frontend | Signals/RxJS | Final | Por verificar | Sin evidencia suficiente |
| Backend | NestJS API principal | EP1/EP2 | Completado base | Frontend se conecta a NestJS |
| Backend | DTO/validación | EP1/Final | Parcial | Usuarios/auth sí; jobs por completar |
| Backend | Autenticación | EP1/Final | Completado básico | JWT + bcrypt |
| Backend | Autorización por roles/permisos | Final | Pendiente | Sin evidencia |
| Backend | Swagger/OpenAPI | Final/EP2 docs | Pendiente | Sin evidencia |
| PostgreSQL | Conexión | EP1 | Completado | Funcional en Docker y usuarios |
| PostgreSQL | Migraciones | EP1/EP2 | Parcial | Users sí; jobs bloqueada |
| PostgreSQL | Persistencia ofertas | EP2 | Pendiente | No demostrada aún |
| Python | FastAPI | EP1/EP2 | Completado base | Health + compatibility + jobs fetch |
| Python | Procesamiento no trivial | EP2 | Parcial | Recuperación/limpieza existe; falta formalización/tests/métricas |
| Python | NestJS → FastAPI | EP1/EP2 | Completado para compatibility; jobs pendiente | Flujo jobs no demostrado |
| Web | Fuente real | EP2 | Parcial | Get on Board funciona; falta decisión/documentación formal |
| Web | Limpieza/normalización | EP2 | Parcial | Implementación inicial en Python |
| Web | Deduplicación | EP2 | Parcial | En memoria; falta BD/evidencia |
| Web | Trazabilidad | EP2 | Parcial | source, URL, fetched_at previstos |
| Web | Actualización | EP2 | Pendiente | Estrategia no documentada/automatizada |
| Web | Legal/ética/privacidad | EP2 | Pendiente | Debe documentarse API y condiciones |
| Adaptación | Diseño preliminar | EP2 | Pendiente | Debe especificarse formalmente |
| Adaptación | Motor final | Final | Futuro | No obligatorio EP2 |
| Docker | 4 contenedores | EP1/EP2 | Completado base | Funcionan en Compose |
| Docker | Reproducibilidad fresca | EP1/EP2 | Por verificar | Migraciones automáticas/volumen limpio no comprobado |
| CI/CD | GitHub Actions | EP1/EP2 | Pendiente crítico | Profesor: workflow vacío y ejecuciones fallidas |
| CI/CD | Lint + tests + build | EP1/EP2 | Pendiente crítico | Debe integrarse como quality gate |
| CI/CD | Seguridad | EP1/EP2 | Pendiente | SAST/deps/secrets/images |
| Terraform | Provider/variables/outputs | EP1/EP2 | Pendiente | Estructura sin código suficiente |
| Terraform | fmt/validate/plan | EP1/EP2 | Pendiente | Sin evidencia |
| Staging | Deploy automatizado | EP2 | Pendiente crítico | Obligatorio para demo EP2 |
| Staging | Post-deploy health | EP2 | Pendiente | Sin evidencia |
| Testing | Python unit tests | EP2 | Por verificar | Estado actual no confirmado |
| Testing | NestJS tests | EP1/EP2 | Bloqueado/por verificar | Jest tuvo problemas ESM |
| Testing | NestJS↔FastAPI integration | EP2 | Pendiente | Sin evidencia |
| Testing | Retrieval tests | EP2 | Pendiente | Sin evidencia |
| Observabilidad | Structured logs | EP2 | Pendiente | Sin evidencia consistente |
| Observabilidad | Correlation ID | EP2 | Pendiente | Sin evidencia |
| Observabilidad | Health Nest/FastAPI | EP2 | Completado | Ambos endpoints existen |
| Observabilidad | PG health | EP2 | Pendiente | Debe exponerse/verificarse |
| Observabilidad | External-source errors | EP2 | Parcial | FastAPI maneja errores básicos; falta evidencia/logging |
| Observabilidad | Response-time metric | EP2 | Pendiente | Sin evidencia |
| Documentación | README completo | EP1/EP2 | Pendiente | Profesor lo observó |
| Documentación | Arquitectura/ADR | EP1/EP2 | Por verificar | Estructura existe; completitud no confirmada |
| Release | Tag/release evaluable | Todas | Pendiente | Obligatorio por entrega |

---

# 6. Planificación por fases y módulos

## Fase 0 — Gestión, correcciones y control del proyecto

### Módulo: estado, backlog y trazabilidad

- [ ] **GOV-001 — Adoptar este documento como backlog oficial**
  - **Descripción:** incorporar `PLAN_DESARROLLO.md` al repositorio y usarlo como fuente central de seguimiento.
  - **Estado:** pendiente
  - **Prioridad:** alta
  - **Entrega:** EP2 y posteriores
  - **Dependencias:** ninguna
  - **Aceptación:** archivo versionado, IDs conservados, estados coherentes.
  - **Evidencia:** commit que agrega `PLAN_DESARROLLO.md`.

- [ ] **GOV-002 — Registrar correcciones de EP1 y observaciones del profesor**
  - **Descripción:** documentar qué observaciones se recibieron y qué tareas las resuelven.
  - **Estado:** pendiente
  - **Prioridad:** alta
  - **Entrega:** EP2
  - **Dependencias:** GOV-001
  - **Aceptación:** todas las observaciones P-01 a P-10 enlazadas con tareas.
  - **Evidencia:** sección de seguimiento actualizada en repositorio/tablero.

- [ ] **GOV-003 — Actualizar tablero de gestión y estado real**
  - **Descripción:** trasladar tareas críticas y entregables al tablero sin marcar trabajo no evidenciado.
  - **Estado:** pendiente
  - **Prioridad:** media
  - **Entrega:** EP2
  - **Dependencias:** GOV-001
  - **Aceptación:** backlog visible con responsables/estado/prioridad.
  - **Evidencia:** enlace al tablero y captura/enlace verificable.

---

## Fase 1 — Arquitectura y decisiones técnicas

### Módulo: arquitectura base

- [ ] **ARCH-001 — Verificar y actualizar diagrama de contexto**
  - **Estado:** por verificar
  - **Prioridad:** media
  - **Entrega:** corrección EP1 / EP2
  - **Dependencias:** WEB-001
  - **Aceptación:** usuarios, MagNet y fuente externa representados.
  - **Evidencia:** archivo versionado en `docs/architecture/`.

- [ ] **ARCH-002 — Actualizar diagrama de contenedores/componentes**
  - **Estado:** por verificar
  - **Prioridad:** alta
  - **Entrega:** EP2
  - **Dependencias:** WEB-001, PY-001, BEJOB-001
  - **Aceptación:** Angular/Ionic, NestJS, FastAPI, PostgreSQL y Get on Board con flujos correctos.
  - **Evidencia:** Mermaid/PlantUML/imagen versionada.

- [ ] **ARCH-003 — Actualizar diagrama de despliegue**
  - **Estado:** pendiente
  - **Prioridad:** alta
  - **Entrega:** EP2
  - **Dependencias:** INFRA-004, STG-001
  - **Aceptación:** local Docker + staging documentados.
  - **Evidencia:** diagrama versionado.

- [ ] **ARCH-004 — Actualizar modelo de datos**
  - **Estado:** en desarrollo
  - **Prioridad:** alta
  - **Entrega:** EP2
  - **Dependencias:** DB-001
  - **Aceptación:** `users` y `jobs` con índices, restricciones y procedencia.
  - **Evidencia:** DER/diagrama y descripción de tablas.

### Módulo: decisiones arquitectónicas

- [ ] **ADR-001 — Formalizar Get on Board como fuente inicial**
  - **Estado:** pendiente
  - **Prioridad:** alta
  - **Entrega:** EP2
  - **Dependencias:** WEB-001, WEB-002
  - **Aceptación:** motivo de selección, límites y alternativas descartadas.
  - **Evidencia:** ADR versionado.

- [ ] **ADR-002 — Formalizar separación NestJS/FastAPI**
  - **Estado:** pendiente
  - **Prioridad:** media
  - **Entrega:** corrección EP1 / EP2
  - **Dependencias:** PY-001
  - **Aceptación:** Python especializado; NestJS conserva API principal y persistencia.
  - **Evidencia:** ADR.

- [ ] **ADR-003 — Formalizar estrategia de compatibilidad laboral**
  - **Estado:** pendiente
  - **Prioridad:** alta
  - **Entrega:** EP2 / Final
  - **Dependencias:** ADAPT-001
  - **Aceptación:** mecanismo, entradas, salida, explicabilidad, límites y evolución futura definidos.
  - **Evidencia:** ADR o especificación técnica.

---

## Fase 2 — Fuente web y servicio Python

### Módulo: fuente externa

- [-] **WEB-001 — Seleccionar definitivamente Get on Board como fuente EP2**
  - **Descripción:** cerrar formalmente la decisión de fuente inicial de ofertas.
  - **Estado:** en desarrollo
  - **Prioridad:** crítica
  - **Entrega:** EP2
  - **Dependencias:** ninguna
  - **Aceptación:** API identificada, datos disponibles, uso justificado y decisión documentada.
  - **Evidencia:** documentación + endpoint funcional + ADR-001.

- [ ] **WEB-002 — Documentar restricciones legales, éticas y de privacidad**
  - **Estado:** pendiente
  - **Prioridad:** alta
  - **Entrega:** EP2
  - **Dependencias:** WEB-001
  - **Aceptación:** condiciones de uso, atribución, frecuencia y minimización de datos documentadas.
  - **Evidencia:** sección README/docs con fuentes consultadas.

- [ ] **WEB-003 — Definir estrategia de actualización de ofertas**
  - **Estado:** pendiente
  - **Prioridad:** alta
  - **Entrega:** EP2
  - **Dependencias:** WEB-001, DB-003
  - **Aceptación:** frecuencia, comportamiento ante actualizaciones y expiración descritos.
  - **Evidencia:** docs + configuración/endpoint correspondiente.

### Módulo: recuperación y preparación Python

- [x] **PY-001 — Recuperar ofertas reales desde Get on Board**
  - **Estado:** completada
  - **Prioridad:** crítica
  - **Entrega:** EP2
  - **Dependencias:** WEB-001
  - **Aceptación:** FastAPI devuelve ofertas reales de la fuente.
  - **Evidencia:** respuesta comprobada con al menos 3 ofertas.

- [-] **PY-002 — Validar contrato normalizado de Job con Pydantic**
  - **Estado:** en desarrollo
  - **Prioridad:** crítica
  - **Entrega:** EP2
  - **Dependencias:** PY-001
  - **Aceptación:** campos mínimos, opcionales y tipos definidos; respuestas inválidas rechazadas/controladas.
  - **Evidencia:** modelo `Job` + tests.

- [-] **PY-003 — Limpiar HTML y normalizar texto**
  - **Estado:** en desarrollo
  - **Prioridad:** alta
  - **Entrega:** EP2
  - **Dependencias:** PY-001
  - **Aceptación:** descripción sin HTML residual significativo, espacios normalizados.
  - **Evidencia:** función + tests con casos reales.

- [-] **PY-004 — Implementar deduplicación en recuperación**
  - **Estado:** en desarrollo
  - **Prioridad:** alta
  - **Entrega:** EP2
  - **Dependencias:** PY-001
  - **Aceptación:** IDs externos repetidos no producen duplicados en una recuperación.
  - **Evidencia:** test unitario.

- [ ] **PY-005 — Incorporar métricas de recuperación**
  - **Estado:** pendiente
  - **Prioridad:** alta
  - **Entrega:** EP2
  - **Dependencias:** PY-002, PY-004
  - **Aceptación:** total recibido, válidos, inválidos, duplicados y tiempo de procesamiento disponibles.
  - **Evidencia:** respuesta/log + test.

- [-] **PY-006 — Manejar timeout y caída de la fuente externa**
  - **Estado:** en desarrollo
  - **Prioridad:** alta
  - **Entrega:** EP2
  - **Dependencias:** PY-001
  - **Aceptación:** timeout configurado; 502/504 controlado; no se expone traceback.
  - **Evidencia:** test mockeando fallo/timeout.

- [ ] **PY-007 — Documentar endpoints FastAPI y contratos**
  - **Estado:** pendiente
  - **Prioridad:** media
  - **Entrega:** EP2
  - **Dependencias:** PY-002, PY-005
  - **Aceptación:** `/docs` refleja endpoints y modelos utilizados.
  - **Evidencia:** FastAPI OpenAPI + README.

- [ ] **PY-008 — Resolver nombre real de empresa**
  - **Estado:** pendiente
  - **Prioridad:** media
  - **Entrega:** EP2
  - **Dependencias:** PY-001
  - **Aceptación:** ofertas muestran nombre real o estrategia documentada para resolver relación company.
  - **Evidencia:** respuesta normalizada + test.

---

## Fase 3 — Backend NestJS y persistencia

### Módulo: jobs

- [-] **BEJOB-001 — Consolidar módulo `jobs` de NestJS**
  - **Estado:** en desarrollo
  - **Prioridad:** crítica
  - **Entrega:** EP2
  - **Dependencias:** PY-002
  - **Aceptación:** module, controller, service y DTO compilan y están registrados en AppModule.
  - **Evidencia:** build exitoso.

- [-] **DB-001 — Definir entidad `Job` y restricciones**
  - **Estado:** en desarrollo
  - **Prioridad:** crítica
  - **Entrega:** EP2
  - **Dependencias:** BEJOB-001
  - **Aceptación:** externalId, source, URL, descripción, metadatos y timestamps; unique `(source, externalId)`.
  - **Evidencia:** entidad TypeORM + build.

- [ ] **DB-002 — Generar y ejecutar migración `jobs`**
  - **Estado:** bloqueada
  - **Prioridad:** crítica
  - **Entrega:** EP2
  - **Dependencias:** DB-001, BLK-001
  - **Aceptación:** migración aplicada a PostgreSQL sin `synchronize:true`.
  - **Evidencia:** archivo de migración + tabla visible + migration history.

- [ ] **BEJOB-002 — Implementar NestJS → FastAPI para importar jobs**
  - **Estado:** en desarrollo / por verificar
  - **Prioridad:** crítica
  - **Entrega:** EP2
  - **Dependencias:** DB-002, PY-002
  - **Aceptación:** endpoint NestJS solicita jobs a FastAPI con timeout y respuesta controlada.
  - **Evidencia:** request funcional y logs/tests.

- [ ] **DB-003 — Persistir y actualizar ofertas sin duplicados**
  - **Estado:** pendiente
  - **Prioridad:** crítica
  - **Entrega:** EP2
  - **Dependencias:** DB-002, BEJOB-002
  - **Aceptación:** primera importación crea; segunda actualiza/ignora sin duplicar.
  - **Evidencia:** conteos DB + respuesta endpoint.

- [ ] **BEJOB-003 — Implementar `GET /jobs`**
  - **Estado:** pendiente / por verificar
  - **Prioridad:** crítica
  - **Entrega:** EP2
  - **Dependencias:** DB-003
  - **Aceptación:** devuelve ofertas persistidas con códigos HTTP consistentes.
  - **Evidencia:** Postman/curl + test.

- [ ] **BEJOB-004 — Implementar criterios básicos de consulta**
  - **Estado:** pendiente
  - **Prioridad:** media
  - **Entrega:** EP2
  - **Dependencias:** BEJOB-003
  - **Aceptación:** búsqueda por texto y/o filtros básicos documentados.
  - **Evidencia:** endpoints/tests.

- [ ] **BEJOB-005 — Manejar indisponibilidad de FastAPI**
  - **Estado:** pendiente
  - **Prioridad:** alta
  - **Entrega:** EP2
  - **Dependencias:** BEJOB-002
  - **Aceptación:** NestJS corta por timeout y devuelve 502/503 comprensible.
  - **Evidencia:** test integración/error demo.

### Módulo: base de datos

- [ ] **DB-004 — Verificar inicialización reproducible de PostgreSQL**
  - **Estado:** pendiente
  - **Prioridad:** alta
  - **Entrega:** EP1/EP2
  - **Dependencias:** DB-002
  - **Aceptación:** entorno limpio puede crear esquema vía migraciones.
  - **Evidencia:** prueba con volumen nuevo/documentación.

- [ ] **DB-005 — Documentar estrategia de migraciones**
  - **Estado:** pendiente
  - **Prioridad:** media
  - **Entrega:** EP2
  - **Dependencias:** DB-004
  - **Aceptación:** comandos dev/Docker/staging claros.
  - **Evidencia:** README/docs.

---

## Fase 4 — Frontend Angular/Ionic

### Módulo: arquitectura frontend

- [ ] **FE-001 — Reorganizar frontend por páginas, servicios, modelos y utilidades**
  - **Estado:** pendiente
  - **Prioridad:** alta
  - **Entrega:** corrección EP1 / EP2
  - **Dependencias:** ninguna
  - **Aceptación:** lógica HTTP fuera de componentes/páginas cuando corresponda; estructura coherente.
  - **Evidencia:** árbol `src/app` + build.

- [ ] **FE-002 — Crear configuración de API por ambiente**
  - **Estado:** pendiente
  - **Prioridad:** alta
  - **Entrega:** EP2
  - **Dependencias:** FE-001
  - **Aceptación:** no depender de URLs hardcodeadas para dev/staging.
  - **Evidencia:** environment/config y build.

### Módulo: autenticación frontend

- [-] **FEAUTH-001 — Consolidar `AuthService`**
  - **Estado:** parcial / por verificar
  - **Prioridad:** alta
  - **Entrega:** corrección EP1 / Final
  - **Dependencias:** FE-001
  - **Aceptación:** login/logout/token/usuario centralizados.
  - **Evidencia:** servicio + tests.

- [ ] **FEAUTH-002 — Implementar interceptor JWT**
  - **Estado:** pendiente
  - **Prioridad:** alta
  - **Entrega:** Final, recomendable EP2
  - **Dependencias:** FEAUTH-001
  - **Aceptación:** token añadido automáticamente a requests protegidas; 401 tratado.
  - **Evidencia:** interceptor + test.

- [ ] **FEAUTH-003 — Implementar AuthGuard**
  - **Estado:** pendiente
  - **Prioridad:** alta
  - **Entrega:** Final, recomendable EP2
  - **Dependencias:** FEAUTH-001
  - **Aceptación:** rutas privadas no accesibles sin sesión válida.
  - **Evidencia:** guard + navegación demostrable.

### Módulo: ofertas

- [ ] **FEJOB-001 — Crear modelo/interface `Job` frontend**
  - **Estado:** pendiente
  - **Prioridad:** crítica
  - **Entrega:** EP2
  - **Dependencias:** BEJOB-003
  - **Aceptación:** contrato alineado con respuesta NestJS.
  - **Evidencia:** archivo model/interface + build.

- [ ] **FEJOB-002 — Crear `JobsService` Angular**
  - **Estado:** pendiente
  - **Prioridad:** crítica
  - **Entrega:** EP2
  - **Dependencias:** FEJOB-001, FE-002, BEJOB-003
  - **Aceptación:** frontend consulta NestJS, nunca FastAPI directamente.
  - **Evidencia:** service + test o demo.

- [ ] **FEJOB-003 — Crear página `/jobs` con Ionic**
  - **Estado:** pendiente
  - **Prioridad:** crítica
  - **Entrega:** EP2
  - **Dependencias:** FEJOB-002
  - **Aceptación:** lista de ofertas reales con cargo, empresa, ubicación/modalidad, categoría y fuente.
  - **Evidencia:** demo funcional.

- [ ] **FEJOB-004 — Agregar enlace a oferta original**
  - **Estado:** pendiente
  - **Prioridad:** alta
  - **Entrega:** EP2
  - **Dependencias:** FEJOB-003
  - **Aceptación:** botón abre `sourceUrl` correcto y muestra atribución.
  - **Evidencia:** demo.

- [ ] **FEJOB-005 — Estados loading/empty/error**
  - **Estado:** pendiente
  - **Prioridad:** alta
  - **Entrega:** EP2
  - **Dependencias:** FEJOB-003
  - **Aceptación:** UX diferenciada para carga, sin datos y error.
  - **Evidencia:** demo/tests.

- [ ] **FEJOB-006 — Búsqueda o filtro básico**
  - **Estado:** pendiente
  - **Prioridad:** media
  - **Entrega:** EP2
  - **Dependencias:** BEJOB-004, FEJOB-003
  - **Aceptación:** usuario puede restringir resultados por criterio documentado.
  - **Evidencia:** demo.

### Módulo: multiplataforma futuro

- [ ] **MOB-001 — Configurar PWA demostrable**
  - **Estado:** pendiente
  - **Prioridad:** media
  - **Entrega:** Final
  - **Dependencias:** FE-001
  - **Aceptación:** manifest, instalación, estrategia de cache/conectividad documentada.
  - **Evidencia:** build/instalación PWA.

- [-] **MOB-002 — Verificar build Android Capacitor**
  - **Estado:** parcial
  - **Prioridad:** media
  - **Entrega:** Final
  - **Dependencias:** FE-001
  - **Aceptación:** aplicación Android compila y ejecuta flujo principal.
  - **Evidencia:** build/ejecución real.

---

## Fase 5 — Capacidad adaptativa / compatibilidad laboral

### Módulo: definición EP2

- [ ] **ADAPT-001 — Especificar mecanismo de compatibilidad**
  - **Estado:** pendiente
  - **Prioridad:** crítica académica
  - **Entrega:** EP2
  - **Dependencias:** WEB-001
  - **Aceptación:** variables, fórmula/reglas, decisión y resultado visible definidos sin ambigüedad.
  - **Evidencia:** especificación versionada.

- [ ] **ADAPT-002 — Definir datos de usuario necesarios**
  - **Estado:** pendiente
  - **Prioridad:** alta
  - **Entrega:** EP2 / Final
  - **Dependencias:** ADAPT-001
  - **Aceptación:** skills, experiencia, intereses/preferencias y límites definidos.
  - **Evidencia:** modelo/documento.

- [-] **ADAPT-003 — Validar algoritmo básico actual de skills**
  - **Estado:** parcial
  - **Prioridad:** alta
  - **Entrega:** EP2
  - **Dependencias:** ADAPT-001
  - **Aceptación:** matched, missing y porcentaje reproducibles con casos de prueba.
  - **Evidencia:** tests Python y ejemplos.

### Módulo: implementación final futura

- [ ] **ADAPT-004 — Extraer/normalizar requisitos de una oferta real**
  - **Estado:** pendiente
  - **Prioridad:** media
  - **Entrega:** Final
  - **Dependencias:** PY-003, ADAPT-001
  - **Aceptación:** requisitos convertidos a representación comparable.
  - **Evidencia:** endpoint/tests.

- [ ] **ADAPT-005 — Integrar compatibilidad en resultados reales**
  - **Estado:** pendiente
  - **Prioridad:** media
  - **Entrega:** Final
  - **Dependencias:** ADAPT-004, FEJOB-003
  - **Aceptación:** usuario ve puntaje y explicación para oferta real.
  - **Evidencia:** demo.

- [ ] **ADAPT-006 — Evaluar utilidad/transparencia/sesgo**
  - **Estado:** pendiente
  - **Prioridad:** media
  - **Entrega:** Final
  - **Dependencias:** ADAPT-005
  - **Aceptación:** métrica/metodología y comparación base cuando sea posible.
  - **Evidencia:** resultados documentados.

---

## Fase 6 — Pruebas y seguridad

### Módulo: pruebas automatizadas

- [ ] **TEST-001 — Confirmar suite Python actual**
  - **Estado:** por verificar
  - **Prioridad:** alta
  - **Entrega:** EP2
  - **Dependencias:** PY-001
  - **Aceptación:** `pytest` ejecuta y estado documentado.
  - **Evidencia:** salida CI/local.

- [ ] **TEST-002 — Tests de recuperación Get on Board con mocks**
  - **Estado:** pendiente
  - **Prioridad:** alta
  - **Entrega:** EP2
  - **Dependencias:** PY-002 a PY-006
  - **Aceptación:** éxito, payload inválido, timeout, HTTP error, deduplicación.
  - **Evidencia:** tests verdes.

- [ ] **TEST-003 — Resolver/validar Jest NestJS**
  - **Estado:** por verificar / bloqueado históricamente
  - **Prioridad:** alta
  - **Entrega:** corrección EP1 / EP2
  - **Dependencias:** ninguna
  - **Aceptación:** suite Jest ejecuta realmente; no solo build.
  - **Evidencia:** `npm test` verde.

- [ ] **TEST-004 — Test `JobsService`**
  - **Estado:** pendiente
  - **Prioridad:** alta
  - **Entrega:** EP2
  - **Dependencias:** BEJOB-002, DB-003, TEST-003
  - **Aceptación:** creación/actualización/error FastAPI cubiertos.
  - **Evidencia:** Jest verde.

- [ ] **TEST-005 — Test integración NestJS ↔ FastAPI**
  - **Estado:** pendiente
  - **Prioridad:** crítica
  - **Entrega:** EP2
  - **Dependencias:** BEJOB-002, TEST-003
  - **Aceptación:** contrato real o servicio de test valida comunicación.
  - **Evidencia:** test de integración en CI.

- [ ] **TEST-006 — Pruebas frontend mínimas**
  - **Estado:** pendiente
  - **Prioridad:** media
  - **Entrega:** EP1/Final
  - **Dependencias:** FEJOB-002, FEAUTH-001
  - **Aceptación:** servicios/componentes críticos con tests ejecutables.
  - **Evidencia:** test runner verde.

### Módulo: seguridad

- [-] **SEC-001 — Auditar `.env`, `.env.example` y `.gitignore`**
  - **Estado:** parcial
  - **Prioridad:** alta
  - **Entrega:** corrección EP1 / EP2
  - **Dependencias:** ninguna
  - **Aceptación:** ningún secreto versionado; example completo sin valores reales.
  - **Evidencia:** repo + secret scan.

- [ ] **SEC-002 — Separar GitHub Variables y Secrets**
  - **Estado:** pendiente
  - **Prioridad:** alta
  - **Entrega:** EP2
  - **Dependencias:** CI-001, STG-001
  - **Aceptación:** no sensibles en Variables; secretos en Secrets.
  - **Evidencia:** configuración/documentación sin revelar valores.

- [ ] **SEC-003 — Revisar vulnerabilidades dependencias frontend/backend**
  - **Estado:** por verificar
  - **Prioridad:** alta
  - **Entrega:** EP2
  - **Dependencias:** CI-004
  - **Aceptación:** reporte actual y decisiones documentadas; no usar `--force` sin análisis.
  - **Evidencia:** audit CI + issue/ADR si se acepta riesgo.

- [ ] **SEC-004 — Analizar dependencias Python**
  - **Estado:** pendiente
  - **Prioridad:** alta
  - **Entrega:** EP2
  - **Dependencias:** CI-004
  - **Aceptación:** herramienta automatizada y quality gate definido.
  - **Evidencia:** job CI.

- [ ] **SEC-005 — Detección automatizada de secretos**
  - **Estado:** pendiente
  - **Prioridad:** alta
  - **Entrega:** EP1/EP2
  - **Dependencias:** CI-001
  - **Aceptación:** pipeline falla ante secreto detectable.
  - **Evidencia:** job CI + prueba controlada.

- [ ] **SEC-006 — Escaneo de imágenes Docker**
  - **Estado:** pendiente
  - **Prioridad:** alta
  - **Entrega:** EP2
  - **Dependencias:** CI-006
  - **Aceptación:** frontend/backend/python escaneados; política crítica definida.
  - **Evidencia:** CI.

- [ ] **SEC-007 — Documentar seguridad, privacidad y datos personales**
  - **Estado:** pendiente
  - **Prioridad:** media
  - **Entrega:** Final, iniciar EP2
  - **Dependencias:** WEB-002, ADAPT-002
  - **Aceptación:** datos, finalidad, riesgos, roles, transparencia y eliminación/actualización descritos.
  - **Evidencia:** docs.

---

## Fase 7 — Pipeline DevSecOps

### Módulo: GitHub Actions

- [ ] **CI-001 — Crear workflow CI funcional desde cero sobre el estado actual**
  - **Estado:** pendiente crítico
  - **Prioridad:** crítica
  - **Entrega:** corrección EP1 / EP2
  - **Dependencias:** TEST-001, TEST-003
  - **Aceptación:** YAML válido; dispara en push/PR; al menos un run completo.
  - **Evidencia:** GitHub Actions verde.

- [ ] **CI-002 — Job frontend reproducible**
  - **Estado:** pendiente
  - **Prioridad:** alta
  - **Entrega:** EP1/EP2
  - **Dependencias:** CI-001
  - **Aceptación:** `npm ci`, lint/test acordado, build.
  - **Evidencia:** job verde.

- [ ] **CI-003 — Job backend reproducible**
  - **Estado:** pendiente
  - **Prioridad:** crítica
  - **Entrega:** EP1/EP2
  - **Dependencias:** TEST-003, CI-001
  - **Aceptación:** `npm ci`, lint, tests y build.
  - **Evidencia:** job verde.

- [ ] **CI-004 — Job Python reproducible**
  - **Estado:** pendiente
  - **Prioridad:** crítica
  - **Entrega:** EP2
  - **Dependencias:** TEST-001, TEST-002
  - **Aceptación:** instalación fija, lint, pytest, dependency scan.
  - **Evidencia:** job verde.

- [ ] **CI-005 — Integrar análisis estático y secretos**
  - **Estado:** pendiente
  - **Prioridad:** alta
  - **Entrega:** EP1/EP2
  - **Dependencias:** SEC-005
  - **Aceptación:** quality gate bloquea fallos definidos.
  - **Evidencia:** workflow + ejecución.

- [ ] **CI-006 — Construir imágenes Docker en CI**
  - **Estado:** pendiente
  - **Prioridad:** alta
  - **Entrega:** EP1/EP2
  - **Dependencias:** CI-002, CI-003, CI-004
  - **Aceptación:** imágenes de los servicios construyen desde cero.
  - **Evidencia:** job verde.

- [ ] **CI-007 — Escanear imágenes Docker**
  - **Estado:** pendiente
  - **Prioridad:** alta
  - **Entrega:** EP2
  - **Dependencias:** CI-006, SEC-006
  - **Aceptación:** escaneo automatizado y criterio de fallo.
  - **Evidencia:** job CI.

- [ ] **CI-008 — Validar Terraform en pipeline**
  - **Estado:** pendiente
  - **Prioridad:** alta
  - **Entrega:** EP2
  - **Dependencias:** INFRA-003
  - **Aceptación:** fmt + validate; plan cuando corresponda.
  - **Evidencia:** job CI.

- [ ] **CI-009 — Despliegue staging + health checks**
  - **Estado:** pendiente
  - **Prioridad:** crítica
  - **Entrega:** EP2
  - **Dependencias:** STG-002, OBS-003
  - **Aceptación:** deploy automatizado y verificación post-deploy.
  - **Evidencia:** run + URLs.

---

## Fase 8 — Infraestructura y staging

### Módulo: Terraform

- [ ] **INFRA-001 — Definir proveedor y backend/estrategia de estado**
  - **Estado:** pendiente
  - **Prioridad:** alta
  - **Entrega:** corrección EP1 / EP2
  - **Dependencias:** STG-001
  - **Aceptación:** proveedor elegido y estado no versionado con secretos.
  - **Evidencia:** `main.tf`/docs.

- [ ] **INFRA-002 — Crear variables y outputs**
  - **Estado:** pendiente
  - **Prioridad:** alta
  - **Entrega:** EP1/EP2
  - **Dependencias:** INFRA-001
  - **Aceptación:** variables no sensibles/sensibles correctamente separadas.
  - **Evidencia:** `variables.tf`, `outputs.tf`.

- [ ] **INFRA-003 — Lograr `terraform fmt`, `validate` y `plan`**
  - **Estado:** pendiente
  - **Prioridad:** crítica
  - **Entrega:** EP1/EP2
  - **Dependencias:** INFRA-001, INFRA-002
  - **Aceptación:** tres comandos exitosos en entorno documentado.
  - **Evidencia:** CI/local logs.

- [ ] **INFRA-004 — Modelar infraestructura mínima de staging**
  - **Estado:** pendiente
  - **Prioridad:** alta
  - **Entrega:** EP2
  - **Dependencias:** STG-001
  - **Aceptación:** recursos/servicios de staging representados o justificación de límites de IaC.
  - **Evidencia:** Terraform + diagrama.

### Módulo: staging

- [ ] **STG-001 — Seleccionar plataforma de staging**
  - **Estado:** pendiente
  - **Prioridad:** crítica
  - **Entrega:** EP2
  - **Dependencias:** ninguna
  - **Aceptación:** soporta frontend, NestJS, FastAPI y PostgreSQL o arquitectura equivalente; costo/límites conocidos.
  - **Evidencia:** decisión documentada.

- [ ] **STG-002 — Desplegar versión funcional**
  - **Estado:** pendiente
  - **Prioridad:** crítica
  - **Entrega:** EP2
  - **Dependencias:** DB-003, FEJOB-003, STG-001
  - **Aceptación:** URL pública permite demostrar flujo EP2.
  - **Evidencia:** URL accesible.

- [ ] **STG-003 — Configurar secretos/variables de staging**
  - **Estado:** pendiente
  - **Prioridad:** alta
  - **Entrega:** EP2
  - **Dependencias:** STG-001, SEC-002
  - **Aceptación:** configuración sin secretos en repositorio.
  - **Evidencia:** docs/configuración.

- [ ] **STG-004 — Automatizar deployment desde GitHub Actions**
  - **Estado:** pendiente
  - **Prioridad:** crítica
  - **Entrega:** EP2
  - **Dependencias:** STG-002, CI-009
  - **Aceptación:** workflow despliega versión evaluable sin pasos manuales críticos no documentados.
  - **Evidencia:** run GitHub Actions.

---

## Fase 9 — Observabilidad y manejo de fallos

### Módulo: health y logs

- [x] **OBS-001 — Health de NestJS**
  - **Estado:** completada
  - **Prioridad:** alta
  - **Entrega:** EP1/EP2
  - **Evidencia:** `/health` existente.

- [x] **OBS-002 — Health de FastAPI**
  - **Estado:** completada
  - **Prioridad:** alta
  - **Entrega:** EP1/EP2
  - **Evidencia:** `/health` existente.

- [ ] **OBS-003 — Health con verificación PostgreSQL**
  - **Estado:** pendiente
  - **Prioridad:** alta
  - **Entrega:** EP2
  - **Dependencias:** DB-004
  - **Aceptación:** health reporta dependencia PostgreSQL de forma segura.
  - **Evidencia:** endpoint/test.

- [ ] **OBS-004 — Logging estructurado**
  - **Estado:** pendiente
  - **Prioridad:** alta
  - **Entrega:** EP2
  - **Dependencias:** ninguna
  - **Aceptación:** logs parseables; errores incluyen contexto sin secretos.
  - **Evidencia:** configuración + muestra de logs.

- [ ] **OBS-005 — Correlation/request ID**
  - **Estado:** pendiente
  - **Prioridad:** media
  - **Entrega:** EP2
  - **Dependencias:** OBS-004
  - **Aceptación:** request identificable a través de logs relevantes.
  - **Evidencia:** middleware/interceptor + log.

- [ ] **OBS-006 — Registrar errores de fuente externa**
  - **Estado:** pendiente
  - **Prioridad:** alta
  - **Entrega:** EP2
  - **Dependencias:** PY-006, OBS-004
  - **Aceptación:** timeout/HTTP error registrados sin datos sensibles.
  - **Evidencia:** test/demo/log.

- [ ] **OBS-007 — Métrica básica de tiempo de respuesta**
  - **Estado:** pendiente
  - **Prioridad:** alta
  - **Entrega:** EP2
  - **Dependencias:** OBS-004
  - **Aceptación:** tiempo de recuperación o endpoint medido y reportado.
  - **Evidencia:** métrica/log/documentación.

---

## Fase 10 — Evaluación de información recuperada

### Módulo: métricas EP2

- [ ] **MET-001 — Elegir y justificar métrica principal EP2**
  - **Estado:** pendiente
  - **Prioridad:** crítica académica
  - **Entrega:** EP2
  - **Dependencias:** PY-005
  - **Aceptación:** métrica formal; recomendación inicial: `% registros válidos`.
  - **Evidencia:** fórmula y justificación en docs.

- [ ] **MET-002 — Ejecutar medición con datos reales**
  - **Estado:** pendiente
  - **Prioridad:** alta
  - **Entrega:** EP2
  - **Dependencias:** MET-001, PY-005
  - **Aceptación:** muestra, fecha y resultado reproducibles.
  - **Evidencia:** tabla/log/resultados.

- [ ] **MET-003 — Medir duplicados y/o tiempo como métricas complementarias**
  - **Estado:** pendiente
  - **Prioridad:** media
  - **Entrega:** EP2
  - **Dependencias:** PY-005, DB-003
  - **Aceptación:** al menos una métrica complementaria si el tiempo lo permite.
  - **Evidencia:** resultados documentados.

---

## Fase 11 — Documentación, entrega y release

### Módulo: README y documentación técnica

- [ ] **DOC-001 — Actualizar resumen, alcance y arquitectura en README**
  - **Estado:** pendiente
  - **Prioridad:** alta
  - **Entrega:** corrección EP1 / EP2
  - **Dependencias:** ARCH-002
  - **Aceptación:** estado real, no promesas presentadas como hechas.
  - **Evidencia:** README versionado.

- [ ] **DOC-002 — Documentar instalación y requisitos previos**
  - **Estado:** pendiente
  - **Prioridad:** crítica
  - **Entrega:** corrección EP1 / EP2
  - **Dependencias:** DB-004
  - **Aceptación:** un tercero puede preparar el proyecto desde cero.
  - **Evidencia:** instrucciones probadas.

- [ ] **DOC-003 — Documentar variables de entorno**
  - **Estado:** pendiente
  - **Prioridad:** crítica
  - **Entrega:** corrección EP1 / EP2
  - **Dependencias:** SEC-001
  - **Aceptación:** nombre, propósito, sensible/no sensible y ejemplo sin secretos.
  - **Evidencia:** README + `.env.example`.

- [ ] **DOC-004 — Documentar Docker Compose y pruebas**
  - **Estado:** pendiente
  - **Prioridad:** crítica
  - **Entrega:** corrección EP1 / EP2
  - **Dependencias:** TEST-001, TEST-003, DB-004
  - **Aceptación:** comandos exactos para levantar, migrar y testear.
  - **Evidencia:** README probado.

- [ ] **DOC-005 — Documentar fuente web y pipeline de preparación**
  - **Estado:** pendiente
  - **Prioridad:** alta
  - **Entrega:** EP2
  - **Dependencias:** WEB-001 a WEB-003, PY-002 a PY-006
  - **Aceptación:** fuente, extracción, limpieza, normalización, dedupe, errores, frecuencia.
  - **Evidencia:** docs.

- [ ] **DOC-006 — Documentar métricas, limitaciones y adaptación preliminar**
  - **Estado:** pendiente
  - **Prioridad:** alta
  - **Entrega:** EP2
  - **Dependencias:** MET-002, ADAPT-001
  - **Aceptación:** resultados y limitaciones explícitas.
  - **Evidencia:** docs.

- [ ] **DOC-007 — Documentar API NestJS con Swagger/OpenAPI**
  - **Estado:** pendiente
  - **Prioridad:** media
  - **Entrega:** EP2/Final
  - **Dependencias:** BEJOB-003
  - **Aceptación:** endpoints principales explorables/documentados.
  - **Evidencia:** Swagger accesible.

### Módulo: release

- [ ] **REL-001 — Preparar checklist de versión evaluable EP2**
  - **Estado:** pendiente
  - **Prioridad:** alta
  - **Entrega:** EP2
  - **Dependencias:** CI-009, STG-004, DOC-006
  - **Aceptación:** repo, staging, tablero, Figma, README, demo y evidencias revisados.
  - **Evidencia:** checklist cerrada.

- [ ] **REL-002 — Crear tag/release oficial EP2**
  - **Estado:** pendiente
  - **Prioridad:** crítica
  - **Entrega:** EP2
  - **Dependencias:** REL-001
  - **Aceptación:** tag apunta exactamente al commit demostrable/evaluable.
  - **Evidencia:** tag/release GitHub.

- [ ] **REL-003 — Preparar guion de demostración EP2**
  - **Estado:** pendiente
  - **Prioridad:** alta
  - **Entrega:** EP2
  - **Dependencias:** STG-002, MET-002, BEJOB-005
  - **Aceptación:** flujo normal + error + pipeline + métrica demostrables en vivo.
  - **Evidencia:** guion/presentación.

- [ ] **REL-004 — Registrar participación de integrantes**
  - **Estado:** pendiente
  - **Prioridad:** media
  - **Entrega:** EP2
  - **Dependencias:** GOV-003
  - **Aceptación:** contribuciones identificadas y coherentes con Git/tablero.
  - **Evidencia:** documento/tablero.

---

# 7. Priorización y dependencias

## 7.1 Ruta crítica para EP2

La siguiente secuencia debe priorizarse porque cada bloque desbloquea el siguiente:

```text
WEB-001
  ↓
PY-002 / PY-003 / PY-004 / PY-006
  ↓
DB-002  ← BLK-001 debe resolverse
  ↓
BEJOB-002
  ↓
DB-003
  ↓
BEJOB-003
  ↓
FEJOB-001 → FEJOB-002 → FEJOB-003 → FEJOB-004/005
  ↓
TEST-002 / TEST-004 / TEST-005
  ↓
MET-001 → MET-002
  ↓
CI-001 ... CI-009
  ↓
STG-002 → STG-004
  ↓
DOC-001 ... DOC-006
  ↓
REL-001 → REL-002
```

## 7.2 Prioridad crítica inmediata

1. **BLK-001 / DB-002:** resolver migración y conexión TypeORM para `jobs`.
2. **BEJOB-002 / DB-003 / BEJOB-003:** cerrar persistencia y consulta de ofertas.
3. **FEJOB-001 a FEJOB-005:** mostrar ofertas reales desde NestJS en Angular/Ionic.
4. **ADAPT-001:** especificar formalmente compatibilidad laboral para cerrar observación del profesor.
5. **TEST-001 a TEST-005:** asegurar pruebas exigidas por EP2.
6. **CI-001 a CI-009:** reemplazar workflow vacío/fallido por pipeline real.
7. **INFRA-001 a INFRA-004 + STG-001 a STG-004:** Terraform y staging.
8. **MET-001/MET-002 + OBS:** métricas y evidencia de indisponibilidad.
9. **DOC + REL:** documentación reproducible y tag oficial.

## 7.3 Tareas que pueden esperar después de EP2

- PWA completa.
- Android final/pulido.
- Motor adaptativo definitivo.
- Perfil de usuario completo para recomendación.
- Evaluación A/B o comparación final.
- Evaluación final con usuarios.
- Observabilidad avanzada.
- UX definitiva.
- Producción definitiva.

---

# 8. Bloqueos y decisiones técnicas pendientes

- [ ] **BLK-001 — TypeORM CLI no logra generar migración `jobs` correctamente**
  - **Estado:** bloqueada
  - **Impacta:** DB-002, DB-003, BEJOB-002, BEJOB-003, FEJOB-003.
  - **Síntoma conocido:** PostgreSQL CLI reportó `no existe el rol �magnet` aun cuando `DB_USERNAME` se lee como `magnet` y el contenedor PostgreSQL sí contiene dicho rol.
  - **Evidencia disponible:** Docker Compose muestra `magnet-postgres` healthy; `psql -U magnet -d magnet -c "\\du"` lista rol `magnet`.
  - **Próxima verificación:** inspeccionar valores efectivos del `DataSource` compilado y destino real de host/puerto antes de modificar código.

- [ ] **BLK-002 — Estado real de Jest no confirmado**
  - **Impacta:** TEST-003, TEST-004, TEST-005, CI-003.
  - **Contexto:** hubo fallos ESM de `@nestjs/testing`; `package.json` fue corregido sintácticamente, pero no se ha demostrado suite verde.

- [ ] **DEC-001 — Plataforma de staging no seleccionada**
  - **Impacta:** Terraform, Secrets/Variables, CI deploy y URL evaluable.

- [ ] **DEC-002 — Mecanismo definitivo de compatibilidad no formalizado**
  - **Impacta:** ADAPT-001 a ADAPT-006 y observación P-02.

- [ ] **DEC-003 — Alcance de autorización/roles**
  - **Impacta:** requisito final de autorización; no bloquea el flujo mínimo EP2, pero debe planificarse antes de EF.

---

# 9. Criterios globales para cerrar tareas

Una tarea solo puede pasar a **completada** cuando, según aplique:

1. El código está guardado y versionado.
2. Compila/builda sin errores relevantes.
3. Las pruebas asociadas pasan.
4. Está integrada al resto del sistema.
5. Puede ejecutarse desde una instalación reproducible.
6. No depende únicamente de una captura o mock manual.
7. Tiene evidencia en GitHub Actions, Postman/curl, base de datos, staging o demo.
8. La documentación refleja exactamente el comportamiento actual.
9. Los secretos no aparecen en Git ni logs.
10. Si pertenece a una entrega, está incluida en el commit del tag/release evaluable.

---

# 10. Próximas tareas recomendadas

## Próxima sesión técnica

**No iniciar nuevas funcionalidades antes de cerrar el bloqueo de persistencia.**

Orden recomendado:

1. **BLK-001:** diagnosticar conexión efectiva de `dist/database/data-source.js`.
2. **DB-002:** generar y ejecutar migración `CreateJobsTable`.
3. **BEJOB-002:** verificar `POST /jobs/import?limit=3`.
4. **DB-003:** comprobar primera importación y segunda importación sin duplicados.
5. **BEJOB-003:** comprobar `GET /jobs` con datos desde PostgreSQL.
6. Recién entonces iniciar **FEJOB-001/002/003**.

## Próxima tarea documental paralela

Mientras se trabaja backend, puede avanzarse sin conflicto en:

- WEB-002 — restricciones legales/éticas de Get on Board.
- ADAPT-001 — especificación formal de compatibilidad.
- DOC-003 — inventario de variables de entorno.

---

# 11. Resumen de avance por fase

> Los porcentajes no representan nota académica; son una lectura operativa conservadora basada únicamente en evidencia conocida.

| Fase | Estado general | Comentario |
|---|---|---|
| Gestión/correcciones | Inicial | Backlog central recién definido |
| Arquitectura | Parcial | Base conocida; documentación debe verificarse/actualizarse |
| Fuente web/Python | Avanzado pero incompleto | Recuperación real funciona; faltan tests/métricas/documentación |
| Backend/persistencia | Parcial y bloqueado | Users funciona; jobs detenido en migración |
| Frontend | Parcial | Auth básico; jobs y estructura Angular faltantes |
| Adaptación | Inicial/parcial | Endpoint básico existe; especificación académica falta |
| Testing/seguridad | Inicial/parcial | Estados reales deben verificarse |
| CI/CD | Crítico pendiente | Observación directa del profesor |
| Terraform/staging | Crítico pendiente | Obligatorio para EP2 |
| Observabilidad | Parcial | Health existe; resto pendiente |
| Documentación/release | Pendiente | README y tag requieren trabajo antes de entrega |

---

# 12. Resumen por entrega académica

## EP1 — deuda que debe corregirse dentro de EP2

**Con evidencia conocida:** base Angular/Ionic/Capacitor, NestJS, PostgreSQL, auth básica, FastAPI, health, comunicación NestJS↔FastAPI, Docker/Compose.

**Pendiente o por verificar:** arquitectura/documentación completa, frontend bien estructurado, pipeline DevSecOps, variables/secrets en GitHub, tests iniciales, Terraform válido, README reproducible, evidencia de control de seguridad, tag/release.

## EP2 — objetivo inmediato

Para considerar EP2 lista debe poder demostrarse en staging:

```text
Get on Board
→ recuperación automatizada
→ validación/limpieza/normalización Python
→ FastAPI
→ NestJS
→ PostgreSQL
→ GET /jobs
→ Angular/Ionic
```

junto con:

- métrica de evaluación;
- escenario de error/indisponibilidad;
- tests Python + integración;
- pipeline DevSecOps;
- Terraform validado;
- deploy automatizado a staging;
- health checks;
- observabilidad inicial;
- README/documentación;
- tag/release evaluable.

## Entrega Final — planificada, no prioritaria todavía

- capacidad adaptativa completa y evaluada;
- perfil de usuario suficiente;
- autorización robusta;
- PWA y Android demostrables;
- observabilidad más completa;
- seguridad/privacidad/accesibilidad final;
- evaluación de adaptación y comparación base cuando corresponda;
- documentación y defensa técnica completas.

---

# 13. Historial de seguimiento

| Fecha | Cambio | Tareas afectadas |
|---|---|---|
| 2026-11-03 | Creación del backlog central a partir del estado conocido, observaciones del profesor y requisitos académicos | Todas |
| 2026-11-03 | Get on Board queda como fuente técnicamente funcional pero aún pendiente de formalización académica | WEB-001, ADR-001 |
| 2026-11-03 | Se registra bloqueo TypeORM/migración `jobs` | BLK-001, DB-002 |

---

## Regla para futuras actualizaciones con ChatGPT

Cuando se indique que una tarea terminó, se debe revisar su **ID**, sus **criterios de aceptación** y su **evidencia**. Solo después se cambia el estado. Al cerrar una tarea, deben identificarse inmediatamente las dependencias desbloqueadas y recomendarse la siguiente tarea de mayor prioridad.
