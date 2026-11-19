# Estrategia preliminar de compatibilidad laboral

## Objetivo

MagNet utiliza un mecanismo preliminar de compatibilidad para comparar las habilidades declaradas por un usuario con las habilidades requeridas por una oferta laboral.

Este mecanismo corresponde a una primera versión explicable y determinista. No se considera todavía el motor adaptativo definitivo del proyecto.

## Entradas

El cálculo utiliza dos conjuntos de habilidades.

### Habilidades del usuario

```text
user_skills
```

Representan habilidades declaradas o almacenadas en el perfil del usuario.

Ejemplo:

```json
[
  "Python",
  "FastAPI",
  "PostgreSQL"
]
```

### Habilidades requeridas por la oferta

```text
job_skills
```

Representan habilidades identificadas como requisitos de una oferta laboral.

Ejemplo:

```json
[
  "Python",
  "Docker",
  "PostgreSQL"
]
```

Actualmente estas habilidades pueden entregarse explícitamente al endpoint de compatibilidad.

La extracción automática desde la descripción de una oferta real corresponde a una etapa posterior.

## Normalización

Antes de comparar las habilidades, cada valor se:

1. convierte a minúsculas;
2. elimina espacios al inicio y al final;
3. incorpora a un conjunto para evitar duplicados.

Ejemplo:

```text
" Python " → "python"
"FASTAPI"  → "fastapi"
```

Esto permite que diferencias simples de mayúsculas o espacios no afecten el resultado.

## Coincidencias

Las habilidades coincidentes corresponden a la intersección entre ambos conjuntos:

```text
matched_skills = user_skills ∩ job_skills
```

Ejemplo:

```text
Usuario:
python, fastapi, postgresql

Oferta:
python, docker, postgresql
```

Resultado:

```text
matched_skills:
python, postgresql
```

## Habilidades faltantes

Los requisitos faltantes corresponden a aquellas habilidades requeridas por la oferta que no se encuentran en el perfil del usuario:

```text
missing_skills = job_skills - user_skills
```

Para el ejemplo anterior:

```text
missing_skills:
docker
```

## Fórmula de compatibilidad

El porcentaje preliminar de compatibilidad se calcula mediante:

```text
compatibility =
(número de habilidades coincidentes / número de habilidades requeridas) × 100
```

Formalmente:

```text
compatibility =
|user_skills ∩ job_skills|
-------------------------- × 100
        |job_skills|
```

El resultado se redondea a dos decimales.

### Ejemplo

Si una oferta requiere:

```text
python
docker
postgresql
```

y el usuario posee:

```text
python
postgresql
```

entonces:

```text
matched = 2
required = 3

compatibility = (2 / 3) × 100

compatibility = 66.67 %
```

## Caso sin requisitos

Si `job_skills` está vacío, el resultado será:

```json
{
  "compatibility": 0,
  "matched_skills": [],
  "missing_skills": []
}
```

Esto evita una división por cero y expresa que no existe información suficiente para calcular una coincidencia significativa.

## Salida

El resultado del mecanismo contiene tres elementos principales:

```json
{
  "compatibility": 66.67,
  "matched_skills": [
    "postgresql",
    "python"
  ],
  "missing_skills": [
    "docker"
  ]
}
```

### `compatibility`

Porcentaje de coincidencia entre las habilidades del usuario y las requeridas por la oferta.

### `matched_skills`

Habilidades requeridas por la oferta que también posee el usuario.

### `missing_skills`

Habilidades requeridas por la oferta que no aparecen en el conjunto de habilidades del usuario.

## Explicabilidad

El mecanismo se considera explicable porque el porcentaje no se entrega de forma aislada.

El usuario puede conocer:

- qué habilidades coincidieron;
- qué habilidades faltan;
- cuántos requisitos se utilizaron en el cálculo;
- cómo se obtiene matemáticamente el porcentaje.

MagNet no debe presentar este resultado como una predicción de contratación.

El porcentaje representa únicamente correspondencia entre los requisitos considerados y los datos disponibles del usuario.

## Interpretación preliminar

Para facilitar la presentación al usuario se podrá utilizar una interpretación visual como referencia:

| Porcentaje | Interpretación |
|---|---|
| 0–39 % | Compatibilidad baja |
| 40–69 % | Compatibilidad media |
| 70–100 % | Compatibilidad alta |

Estos rangos son únicamente una regla inicial de presentación y no representan probabilidades reales de contratación.

## Decisión actual

Para EP2 se utiliza una estrategia basada en coincidencia explícita de habilidades porque:

- es simple de reproducir;
- es explicable;
- permite verificar fácilmente los resultados;
- no requiere entrenar modelos;
- evita resultados opacos;
- permite validar la arquitectura completa antes de incorporar mecanismos más sofisticados.

## Limitaciones

La versión actual presenta varias limitaciones.

### Todas las habilidades tienen el mismo peso

Actualmente:

```text
Python = Docker = Git = AWS
```

para efectos del cálculo.

No se distingue entre requisitos obligatorios, deseables o secundarios.

### No considera nivel de dominio

El sistema no diferencia actualmente entre:

```text
Python básico
Python intermedio
Python avanzado
```

### No considera experiencia

Los años de experiencia todavía no afectan el resultado.

### No considera preferencias

Elementos como:

- modalidad remota;
- ubicación;
- rango salarial;
- jornada;
- intereses;

todavía no forman parte de la fórmula.

### No reconoce equivalencias semánticas

Por ejemplo:

```text
Postgres
PostgreSQL
```

podrían interpretarse actualmente como habilidades diferentes si no existe una normalización específica.

### Las habilidades de la oferta todavía deben estar estructuradas

El mecanismo necesita `job_skills`.

La extracción automática de requisitos desde descripciones reales de ofertas corresponde a una etapa posterior del proyecto.

### No representa probabilidad de contratación

Un resultado de:

```text
80 %
```

no significa que exista un 80 % de probabilidad de obtener el empleo.

Solo indica que el usuario posee el 80 % de las habilidades utilizadas por el cálculo.

## Evolución prevista

El mecanismo podrá evolucionar incorporando progresivamente:

1. normalización de nombres y sinónimos;
2. extracción de habilidades desde descripciones reales;
3. ponderación de requisitos obligatorios y deseables;
4. nivel de experiencia;
5. años de experiencia;
6. modalidad laboral;
7. ubicación;
8. intereses y preferencias;
9. requisitos no técnicos;
10. explicación más detallada del resultado.

La evolución debe conservar la capacidad de explicar por qué una oferta obtiene determinada puntuación.

## Restricciones éticas

El sistema:

- no debe inventar habilidades del usuario;
- no debe inferir experiencia inexistente;
- no debe presentar el porcentaje como garantía de contratación;
- debe permitir al usuario comprender los factores utilizados;
- debe diferenciar datos de la oferta de resultados generados por MagNet.

## Implementación actual

El mecanismo preliminar se encuentra expuesto mediante:

```text
POST /compatibility
```

del servicio FastAPI.

El servicio recibe:

```json
{
  "user_skills": [],
  "job_skills": []
}
```

y devuelve:

```json
{
  "compatibility": 0,
  "matched_skills": [],
  "missing_skills": []
}
```

