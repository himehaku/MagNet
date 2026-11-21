# ADR-002 — Separación de responsabilidades entre NestJS y FastAPI

## Estado

Aceptada.

## Contexto

MagNet utiliza dos servicios backend con responsabilidades distintas:

- **NestJS**, como backend principal del sistema.
- **FastAPI**, como servicio especializado en procesamiento con Python.

Durante el desarrollo inicial era necesario definir explícitamente por qué existen ambos servicios y evitar duplicar responsabilidades entre ellos.

La arquitectura debe garantizar que el frontend disponga de una única API principal y que las funciones especializadas en Python puedan evolucionar sin convertir FastAPI en un segundo backend independiente.

## Decisión

Se establece que **NestJS será la API principal de MagNet y el responsable de la lógica de aplicación y persistencia**, mientras que **FastAPI será un servicio interno especializado en tareas de procesamiento adecuadas para Python**.

El frontend Angular/Ionic se comunica únicamente con NestJS.

La comunicación principal queda definida de la siguiente manera:

```text
Angular/Ionic
      ↓
    NestJS
   ↙      ↘
PostgreSQL FastAPI
              ↓
        Fuentes externas
```

## Responsabilidades de NestJS

NestJS mantiene las responsabilidades centrales del sistema.

Entre ellas se encuentran:

- exponer la API REST consumida por Angular/Ionic;
- autenticación;
- autorización;
- gestión de usuarios;
- lógica de aplicación;
- validación de solicitudes del frontend;
- coordinación de llamadas a servicios internos;
- persistencia;
- acceso a PostgreSQL;
- manejo de errores hacia el cliente;
- exposición de ofertas persistidas.

NestJS es, por tanto, la frontera principal entre el frontend y el backend.

## Responsabilidades de FastAPI

FastAPI se utiliza para procesamiento especializado que se beneficia del ecosistema de Python.

Sus responsabilidades incluyen:

- consumir fuentes externas de ofertas;
- transformar respuestas externas;
- normalizar ofertas;
- realizar procesamiento de texto;
- implementar posteriormente mecanismos de compatibilidad laboral;
- exponer operaciones especializadas para que NestJS pueda utilizarlas.

FastAPI no administra directamente la experiencia del usuario.

## Persistencia

PostgreSQL es gestionado desde NestJS mediante TypeORM.

FastAPI no es responsable de crear, actualizar ni consultar directamente las tablas principales de MagNet.

El flujo normal de importación es:

```text
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

De esta manera, NestJS conserva el control sobre la persistencia y las reglas asociadas al dominio.

## Comunicación con el frontend

Angular/Ionic no debe realizar llamadas directas a FastAPI.

El flujo permitido es:

```text
Angular/Ionic → NestJS → FastAPI
```

y no:

```text
Angular/Ionic → FastAPI
```

Esta decisión evita que el frontend dependa de múltiples APIs backend y mantiene una frontera clara de responsabilidades.

## Motivos de la decisión

### API principal única

Mantener NestJS como API principal simplifica:

- autenticación;
- autorización;
- manejo de errores;
- documentación de endpoints;
- versionado;
- integración frontend-backend.

### Especialización tecnológica

Python dispone de herramientas especialmente adecuadas para:

- procesamiento de lenguaje natural;
- análisis de texto;
- extracción de características;
- algoritmos de ranking;
- experimentación con modelos de compatibilidad.

FastAPI permite utilizar estas capacidades sin trasladar todo el backend a Python.

### Separación de responsabilidades

La división evita que ambos servicios implementen las mismas reglas de negocio o manipulen independientemente la misma base de datos.

### Evolución independiente

El procesamiento especializado puede cambiar sin modificar significativamente la API expuesta al frontend.

Por ejemplo, la implementación interna de compatibilidad podría evolucionar desde reglas simples hacia técnicas más avanzadas manteniendo estable el contrato NestJS–FastAPI.

## Manejo de errores

NestJS debe controlar las llamadas hacia FastAPI.

Si FastAPI está indisponible o devuelve un error:

1. NestJS detecta el fallo.
2. NestJS genera una respuesta controlada.
3. El frontend no recibe directamente errores internos de FastAPI.
4. Las funcionalidades que utilizan exclusivamente información ya almacenada pueden seguir funcionando.

Para evitar llamadas indefinidas, la comunicación NestJS–FastAPI debe utilizar tiempos de espera definidos.

## Contratos

La comunicación entre NestJS y FastAPI debe utilizar contratos explícitos.

FastAPI debe validar sus estructuras mediante modelos Pydantic.

NestJS debe transformar o validar las respuestas antes de incorporarlas al dominio o persistirlas.

Esto reduce el acoplamiento respecto a implementaciones internas.

## Alternativas consideradas

### Implementar todo el backend en NestJS

Se podría realizar también la recuperación y procesamiento especializado dentro de NestJS.

**Descartada**, porque el proyecto requiere un servicio Python no trivial y porque Python resulta adecuado para las futuras funciones adaptativas y de procesamiento de texto.

### Implementar todo el backend en FastAPI

Se podría reemplazar NestJS y utilizar únicamente Python.

**Descartada**, porque la arquitectura del proyecto contempla NestJS como backend principal y porque ya concentra autenticación, lógica de aplicación y persistencia.

### Permitir acceso directo del frontend a ambos servicios

Angular/Ionic podría decidir qué backend consultar según la funcionalidad.

**Descartada**, porque aumentaría el acoplamiento del frontend, duplicaría políticas de seguridad y haría más complejo mantener contratos consistentes.

### Permitir que ambos servicios accedan directamente a PostgreSQL

FastAPI y NestJS podrían compartir acceso a la misma base de datos.

**Descartada para la arquitectura actual**, porque generaría dos responsables sobre el mismo modelo persistente y aumentaría el riesgo de reglas inconsistentes.

## Consecuencias positivas

- Existe una API principal claramente definida.
- La persistencia tiene un único responsable.
- Python puede especializarse en procesamiento.
- El frontend queda desacoplado de FastAPI.
- Se facilita el reemplazo o evolución de algoritmos internos.
- Los errores de servicios internos pueden encapsularse en NestJS.

## Consecuencias negativas

- Existe una comunicación adicional entre servicios.
- Algunas operaciones requieren una llamada HTTP interna.
- Deben mantenerse contratos entre NestJS y FastAPI.
- Es necesario manejar timeouts e indisponibilidad del servicio Python.
- El despliegue incluye un servicio adicional.

## Reglas arquitectónicas resultantes

1. Angular/Ionic consume únicamente NestJS.
2. NestJS es la API pública principal de MagNet.
3. NestJS administra PostgreSQL.
4. FastAPI se considera un servicio interno especializado.
5. FastAPI no debe convertirse en una API alternativa para el frontend.
6. Los contratos NestJS–FastAPI deben ser explícitos y validados.
7. Los errores de FastAPI deben ser traducidos por NestJS.
8. Las tareas de procesamiento especializadas pueden evolucionar internamente sin alterar la interfaz principal de MagNet.

## Evidencia actual

La arquitectura implementada ya respeta esta decisión en el flujo de ofertas:

```text
Get on Board
    ↓
FastAPI
    ↓
NestJS
    ↓
PostgreSQL
    ↓
NestJS
    ↓
Angular/Ionic
```

Además, se ha comprobado que NestJS puede manejar de forma controlada la indisponibilidad de FastAPI.

## Resultado

MagNet adopta una arquitectura en la que **NestJS constituye el backend principal y propietario de la persistencia**, mientras **FastAPI proporciona capacidades especializadas de procesamiento en Python**.

Esta separación se considera una regla arquitectónica del proyecto.