# Métricas de recuperación de ofertas

## Métrica principal EP2

La métrica principal de MagNet para evaluar la información recuperada desde la fuente externa es el **porcentaje de registros válidos**.

### Fórmula

**Porcentaje de registros válidos = valid / (valid + invalid) × 100**

Donde:

- `valid`: registros que superan la validación y pueden continuar en el pipeline.
- `invalid`: registros rechazados por incumplir el modelo esperado.
- Los registros duplicados no se consideran inválidos; se contabilizan de forma separada.

### Justificación

Esta métrica permite evaluar qué proporción de los registros procesados desde la fuente externa posee la estructura y los datos mínimos requeridos por MagNet.

Es relevante porque una alta cantidad de registros inválidos puede afectar la confiabilidad del flujo Fuente web → FastAPI → NestJS → PostgreSQL → Frontend.

### Métricas complementarias disponibles

El servicio Python también registra:

- cantidad de duplicados;
- tiempo de procesamiento en milisegundos.

Estas métricas se consideran complementarias y no reemplazan la métrica principal.

## Medición con datos reales

**Fecha de medición:** 21 de noviembre de 2026  
**Fuente:** Get on Board, consumida mediante el servicio Python de MagNet  
**Endpoint utilizado:** `/jobs/fetch?limit=20`

### Resultados

| Métrica | Resultado |
|---|---:|
| Registros informados por la fuente | 120 |
| Registros evaluados por el pipeline | 20 |
| Registros válidos | 20 |
| Registros inválidos | 0 |
| Duplicados detectados | 0 |
| Tiempo de procesamiento | 1724,41 ms |
| Porcentaje de registros válidos | **100%** |

### Cálculo

**20 / (20 + 0) × 100 = 100%**

### Interpretación

En esta ejecución, los 20 registros evaluados por el pipeline cumplieron las validaciones definidas por MagNet, por lo que la muestra obtuvo un 100% de registros válidos.

El valor `total_received = 120` representa la cantidad de registros informados por la respuesta de la fuente, mientras que el parámetro `limit=20` restringió la cantidad procesada por MagNet. Por esta razón, `total_received` no se utiliza como denominador de la métrica principal.

La medición representa una ejecución puntual y no debe interpretarse como garantía de que todas las respuestas futuras de la fuente tendrán un 100% de registros válidos.   