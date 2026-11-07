# ADR-001 — Get on Board como fuente inicial de ofertas laborales

## Estado

Aceptada técnicamente, pendiente de completar revisión de restricciones de uso mediante WEB-002.

## Contexto

MagNet requiere una fuente externa de ofertas laborales reales para implementar el flujo principal del sistema:

```text
Fuente externa
    ↓
FastAPI
    ↓
NestJS
    ↓
PostgreSQL
    ↓
Angular/Ionic
```

La fuente debe permitir recuperar información suficiente para mostrar ofertas reales y conservar su procedencia, además de proporcionar datos que posteriormente puedan utilizarse para calcular compatibilidad con el perfil laboral de un usuario.

Durante el desarrollo de EP2 se evaluó la necesidad de seleccionar una fuente inicial concreta y estable para evitar que la recuperación de ofertas dependiera de datos simulados.

## Decisión

Se selecciona **Get on Board** como fuente inicial de ofertas laborales para MagNet.

La recuperación de información se realiza desde el servicio FastAPI. FastAPI transforma la información externa a un formato interno normalizado y la entrega a NestJS.

NestJS es responsable de almacenar las ofertas en PostgreSQL y exponerlas posteriormente al frontend.

El frontend no consulta directamente Get on Board.

## Motivos de selección

### Ofertas laborales reales

Get on Board permite trabajar con publicaciones laborales reales, evitando que el flujo principal de MagNet dependa exclusivamente de datos ficticios.

### Información útil para MagNet

Las respuestas obtenidas permiten recuperar información relevante para el dominio del proyecto, incluyendo elementos como:

- identificador externo;
- título de la oferta;
- empresa;
- descripción;
- ubicación cuando está disponible;
- modalidad remota cuando está disponible;
- categoría cuando está disponible;
- fecha de publicación;
- enlace hacia la publicación original.

Estos datos son suficientes para implementar el flujo inicial de recuperación, persistencia y visualización.

### Integración comprobada

La integración ya fue validada durante el desarrollo.

FastAPI puede recuperar ofertas reales desde Get on Board y entregar una representación normalizada a NestJS.

NestJS puede posteriormente persistir esas ofertas en PostgreSQL.

### Procedencia verificable

MagNet conserva para cada oferta:

- la fuente;
- el identificador de la fuente;
- la URL original;
- la fecha de recuperación.

Esto permite mantener trazabilidad sobre el origen de los datos y redirigir al usuario a la publicación original.

### Adecuación al alcance inicial

Get on Board está especialmente orientado a ofertas relacionadas con tecnología y trabajo digital.

Esto permite implementar y evaluar el flujo técnico de MagNet sin requerir inicialmente la integración simultánea de múltiples portales laborales.

## Forma de integración

La comunicación definida es:

```text
NestJS
    ↓ HTTP
FastAPI
    ↓ HTTP
Get on Board
    ↓
FastAPI
    ↓
NestJS
    ↓
PostgreSQL
```

FastAPI cumple la función de adaptador y procesador de la fuente externa.

NestJS conserva la responsabilidad de API principal y persistencia de MagNet.

## Normalización

MagNet no debe hacer depender el resto de su arquitectura del formato particular utilizado por Get on Board.

FastAPI transforma las ofertas recuperadas a un modelo interno común.

De esta forma, una futura segunda fuente podría transformarse al mismo modelo sin requerir que el frontend conozca qué portal produjo cada estructura externa.

## Deduplicación

Las ofertas almacenadas se identifican mediante la combinación:

```text
(source, external_id)
```

La base de datos mantiene una restricción única sobre dicha combinación.

Esto evita insertar repetidamente una misma oferta proveniente de la misma fuente.

## Límites de la decisión

### Cobertura del mercado laboral

Get on Board está orientado principalmente a empleos tecnológicos y digitales.

Por tanto, no representa por sí solo toda la variedad de áreas profesionales que MagNet pretende cubrir a largo plazo.

La arquitectura debe permitir incorporar otras fuentes posteriormente.

### Dependencia de un servicio externo

MagNet no controla la disponibilidad ni los cambios realizados por Get on Board.

Una modificación del formato de respuesta, indisponibilidad del servicio o cambio en sus condiciones puede afectar la recuperación de ofertas.

El sistema debe manejar estos errores sin impedir el funcionamiento del resto de MagNet.

### Datos incompletos

No todas las ofertas necesariamente entregan los mismos campos opcionales.

Por esta razón, atributos como ubicación, categoría, modalidad remota o fecha de publicación pueden ser nulos dentro del modelo interno.

### Compatibilidad laboral

La disponibilidad de una descripción laboral no garantiza que todos los requisitos estén expresados de forma estructurada.

El futuro cálculo de compatibilidad puede requerir procesamiento adicional para identificar habilidades y requisitos a partir del texto.

### Condiciones de uso

Las condiciones legales, éticas, de atribución, frecuencia de consulta y minimización de datos deben documentarse formalmente en **WEB-002**.

Hasta completar esa tarea, este aspecto constituye una restricción pendiente de la decisión.

No se asume en este ADR una frecuencia de consulta ni un límite de solicitudes que no haya sido verificado documentalmente.

## Alternativas consideradas

### Datos simulados

Se consideró utilizar exclusivamente datos ficticios o fixtures.

**Descartada como fuente principal** porque no permite demostrar adecuadamente la integración con una fuente web real requerida por el proyecto.

Los datos simulados pueden seguir siendo útiles para pruebas automatizadas.

### Scraping directo de portales laborales

Se podría extraer información directamente desde páginas HTML de otros portales.

**Descartado para la integración inicial** porque introduce mayor fragilidad ante cambios en la interfaz web y requiere un análisis adicional de condiciones de uso, frecuencia de acceso y restricciones técnicas.

Esto no impide evaluar fuentes adicionales posteriormente.

### Integrar múltiples fuentes desde EP2

Otra alternativa era integrar varios portales laborales desde el comienzo.

**Descartada para EP2** porque incrementaría significativamente la complejidad de normalización, deduplicación, manejo de errores y validación antes de disponer de un flujo vertical completo.

Se prefiere validar primero la arquitectura utilizando una fuente funcional.

## Consecuencias positivas

- MagNet utiliza ofertas laborales reales.
- Existe una fuente inicial concreta y reproducible para EP2.
- Se conserva trazabilidad de la procedencia.
- El sistema puede redirigir al usuario hacia la oferta original.
- FastAPI actúa como capa de adaptación frente a la fuente externa.
- El modelo interno permite evolucionar hacia múltiples fuentes.

## Consecuencias negativas y riesgos

- La cobertura inicial se concentra principalmente en trabajos tecnológicos.
- Existe dependencia de disponibilidad de un tercero.
- Cambios externos pueden requerir modificar el adaptador.
- Parte de la información puede llegar incompleta.
- Las restricciones formales de uso deben mantenerse revisadas mediante WEB-002.

## Evolución futura

La arquitectura deberá permitir incorporar nuevas fuentes mediante adaptadores independientes.

Cada fuente futura deberá:

1. recuperar información respetando sus condiciones de uso;
2. convertirla al modelo interno de MagNet;
3. conservar su identificador y procedencia;
4. aplicar mecanismos de deduplicación;
5. manejar indisponibilidad y cambios de formato;
6. evitar que Angular/Ionic dependa directamente de la fuente externa.

## Relación con otras tareas

- **WEB-001:** selección técnica de Get on Board como fuente inicial.
- **WEB-002:** restricciones legales, éticas, atribución, frecuencia y privacidad.
- **WEB-003:** estrategia de actualización de ofertas.
- **PY-001:** recuperación efectiva desde Get on Board.
- **BEJOB-002:** importación desde FastAPI hacia NestJS.
- **DB-003:** persistencia y deduplicación.
- **ARCH-002:** representación arquitectónica de la integración.

## Resultado

Get on Board se adopta como la **fuente inicial de ofertas laborales de MagNet**, sin convertirla en una dependencia conceptual permanente del dominio.

Su integración se encapsula detrás de FastAPI y del modelo normalizado del sistema, permitiendo sustituirla o complementarla con otras fuentes en futuras iteraciones.