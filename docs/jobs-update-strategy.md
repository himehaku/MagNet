# Estrategia de actualización de ofertas

## Objetivo

Este documento define cómo MagNet recupera, actualiza y mantiene ofertas laborales provenientes de fuentes externas.

La estrategia actual está orientada a Get on Board como fuente inicial, pero debe permitir incorporar otras fuentes posteriormente.

## Estado actual

La actualización de ofertas se realiza actualmente mediante una operación explícita de importación desde NestJS hacia FastAPI.

El flujo es:

```text id="web003flow"
NestJS
  ↓
FastAPI
  ↓
Get on Board
  ↓
FastAPI
  ↓
NestJS
  ↓
PostgreSQL
```

Actualmente no existe un proceso automático programado mediante cron, scheduler o worker.

## Frecuencia de actualización

### Comportamiento implementado

La recuperación se ejecuta bajo demanda cuando NestJS llama al servicio Python mediante:

```text id="web003endpoint"
GET /jobs/fetch
```

NestJS controla además la cantidad solicitada mediante el parámetro:

```text id="web003limit"
limit
```

El valor por defecto actual en `importFromPython` es:

```text id="web003default"
20 ofertas
```

### Política para EP2

Para EP2 se adopta una estrategia conservadora:

- no realizar consultas continuas;
- no ejecutar scraping;
- actualizar únicamente mediante operaciones explícitas de importación;
- reutilizar ofertas ya almacenadas cuando no sea necesario consultar nuevamente la fuente;
- evitar asumir límites de frecuencia no publicados por Get on Board.

La automatización periódica queda fuera del comportamiento actual.

## Identificación de ofertas

Cada oferta se identifica mediante:

```text id="web003key"
(source, external_id)
```

Esta combinación permite distinguir una misma identificación externa utilizada por distintas fuentes.

La base de datos mantiene además una restricción única para esta combinación.

## Creación de nuevas ofertas

Cuando NestJS recibe una oferta y no existe un registro con la misma combinación:

```text id="web003create"
source + external_id
```

se crea un nuevo registro en PostgreSQL.

El contador `created` informa cuántas ofertas nuevas fueron insertadas durante la importación.

## Actualización de ofertas existentes

Si la oferta ya existe, MagNet no crea un duplicado.

NestJS actualiza el registro existente con los datos más recientes recibidos desde FastAPI.

Actualmente pueden actualizarse:

- título;
- empresa;
- descripción;
- ubicación;
- modalidad remota;
- categoría;
- fuente;
- URL original;
- fecha de publicación;
- fecha de recuperación.

El contador `updated` informa cuántas ofertas existentes fueron actualizadas.

## Fecha de recuperación

Cada importación conserva:

```text id="web003fetched"
fetchedAt
```

Este valor permite conocer cuándo fue recuperada la versión actual de la oferta.

Puede utilizarse posteriormente para detectar registros que no hayan sido actualizados durante un período determinado.

## Duplicados

La estrategia de actualización evita duplicados mediante dos mecanismos:

1. NestJS busca previamente una oferta por `source` y `externalId`.
2. PostgreSQL mantiene una restricción única sobre `(source, external_id)`.

Por lo tanto, sucesivas importaciones de una misma oferta actualizan el registro existente.

## Indisponibilidad del servicio Python

NestJS utiliza un timeout de:

```text id="web003timeout"
10000 ms
```

para la llamada hacia FastAPI.

Si FastAPI no responde o la solicitud falla, NestJS devuelve un error controlado:

```text id="web003error"
BadGatewayException
```

La falla de una nueva importación no elimina las ofertas previamente almacenadas.

Por tanto, las ofertas ya persistidas pueden continuar consultándose desde PostgreSQL.

## Expiración de ofertas

### Estado actual

MagNet todavía no elimina ni marca automáticamente una oferta como expirada.

Actualmente, una oferta importada permanece almacenada aunque posteriormente deje de aparecer en una consulta a la fuente externa.

Esto debe considerarse una limitación conocida del comportamiento actual.

### Estrategia futura

La evolución prevista consiste en incorporar un mecanismo explícito de vigencia.

Una implementación futura podrá utilizar:

- fecha de publicación;
- `fetchedAt`;
- presencia o ausencia en importaciones sucesivas;
- información de cierre entregada por la fuente, si existe.

Una posible estrategia es agregar un estado como:

```text id="web003status"
active
expired
unavailable
```

o una fecha:

```text id="web003expires"
expired_at
```

Esta funcionalidad no se considera implementada mientras no exista el campo correspondiente y la lógica que lo gestione.

## Eliminación de registros

La estrategia actual no realiza eliminación automática.

Se evita borrar una oferta solo porque no aparezca en una recuperación puntual, debido a que:

- una consulta puede estar limitada por `limit`;
- la fuente externa puede estar temporalmente incompleta;
- una oferta puede quedar fuera del subconjunto recuperado sin haber expirado realmente.

Por esta razón, la ausencia en una única importación no debe interpretarse automáticamente como eliminación.

## Política recomendada para futuras actualizaciones automáticas

Cuando MagNet incorpore ejecución programada, deberá cumplir al menos estas reglas:

1. utilizar una frecuencia configurable;
2. evitar consultas excesivas a la fuente;
3. registrar el resultado de cada actualización;
4. actualizar registros existentes en lugar de duplicarlos;
5. conservar `source` y `external_id`;
6. manejar indisponibilidad sin borrar datos;
7. definir explícitamente cuándo una oferta se considera expirada;
8. permitir revisar la frecuencia sin cambiar código fuente.

La frecuencia exacta deberá configurarse según las condiciones vigentes de cada fuente.

## Resultado de una importación

La operación actual devuelve un resumen con:

```json id="web003result"
{
  "source": "Get on Board",
  "received": 20,
  "created": 0,
  "updated": 20
}
```

Los valores dependen del resultado real de cada ejecución.

Esto permite verificar cuántos registros fueron recibidos, creados y actualizados.

## Limitaciones actuales

La estrategia actual todavía no incluye:

- ejecución automática programada;
- historial de versiones de una oferta;
- campo explícito de expiración;
- eliminación automática;
- detección automática de ofertas retiradas de la fuente;
- métricas históricas de importaciones.

Estas características pueden incorporarse posteriormente sin modificar la regla principal de identificación por procedencia.

## Conclusión

MagNet utiliza actualmente una estrategia de actualización **explícita e incremental**.

Las ofertas nuevas se crean y las existentes se actualizan mediante la combinación `(source, external_id)`.

No existe actualmente una política automática de expiración, por lo que esta funcionalidad queda documentada como evolución futura y no como comportamiento ya implementado.