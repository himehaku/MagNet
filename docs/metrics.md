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