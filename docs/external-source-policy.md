# Uso responsable de Get on Board en MagNet

## Objetivo

Este documento registra las restricciones legales, éticas, de privacidad y de operación consideradas por MagNet al utilizar Get on Board como fuente externa inicial de ofertas laborales.

La integración se limita a información pública de ofertas laborales obtenida mediante la API pública de Get on Board.

## Alcance de la integración

MagNet utiliza únicamente la API pública de Get on Board para recuperar información de ofertas laborales visibles públicamente.

La API pública no requiere autenticación ni acceso a una cuenta empresarial.

MagNet no utiliza la API privada de Get on Board.

La información recuperada se utiliza para:

- mostrar ofertas laborales dentro de MagNet;
- almacenar una representación normalizada de la oferta;
- identificar su procedencia;
- redirigir al usuario hacia la publicación original;
- utilizar información de la oferta como entrada para funciones propias de MagNet, como el análisis de compatibilidad.

## Información utilizada

MagNet puede almacenar exclusivamente información asociada a una oferta pública, por ejemplo:

- identificador externo;
- título;
- empresa;
- descripción;
- ubicación;
- modalidad;
- categoría;
- fecha de publicación;
- URL original;
- fuente;
- fecha en que MagNet recuperó la información.

El modelo interno conserva los campos `source`, `external_id`, `source_url` y `fetched_at` para mantener trazabilidad.

## Datos que MagNet no debe recuperar desde Get on Board

MagNet no necesita ni debe obtener desde Get on Board:

- perfiles privados de profesionales;
- postulaciones;
- currículums;
- direcciones de correo electrónico de postulantes;
- números telefónicos;
- mensajes privados;
- procesos internos de selección;
- datos de candidatos disponibles mediante servicios privados;
- información que requiera credenciales empresariales o API privada.

El proyecto se limita a ofertas laborales públicamente accesibles.

## Privacidad y minimización de datos

La integración aplica el principio de minimización de datos.

MagNet solo recupera y persiste aquellos atributos de una oferta necesarios para cumplir las funciones del sistema.

La existencia de otros datos dentro de Get on Board no implica autorización ni necesidad para incorporarlos a MagNet.

La información personal que los usuarios introduzcan directamente en MagNet se considera parte del dominio propio de MagNet y debe gestionarse independientemente de los datos obtenidos desde Get on Board.

## Procedencia y atribución

Toda oferta importada debe conservar:

```text
source = Get on Board
external_id = identificador original
source_url = enlace a la publicación original
```

Cuando un usuario quiera consultar la publicación completa o realizar una postulación, MagNet debe proporcionarle acceso al enlace original de Get on Board.

MagNet no debe presentar una oferta externa como si hubiese sido publicada originalmente por MagNet.

## Uso de la API pública

La documentación oficial de Get on Board indica que la API pública permite acceder a información que ya se encuentra públicamente disponible en la plataforma.

Entre los usos documentados por Get on Board se encuentra la visualización de ofertas publicadas en otros sitios y la creación de experiencias de búsqueda o job boards utilizando publicaciones públicas.

Por esta razón, MagNet utiliza la API pública en vez de realizar scraping directo del HTML del sitio.

## Frecuencia de consulta

La documentación y los términos consultados indican que Get on Board puede aplicar restricciones de uso, limitación o throttling sobre solicitudes a sus APIs.

No se ha identificado en las fuentes públicas consultadas un límite numérico concreto de solicitudes aplicable a la API pública.

Por lo tanto, MagNet no debe asumir ni documentar un número arbitrario de solicitudes por minuto.

La estrategia de actualización debe aplicar un comportamiento conservador:

- evitar consultas innecesariamente repetitivas;
- reutilizar ofertas ya persistidas;
- actualizar mediante procesos explícitos de importación;
- identificar ofertas utilizando `(source, external_id)`;
- manejar respuestas de error o indisponibilidad;
- permitir incorporar una frecuencia configurable en fases posteriores.

La frecuencia definitiva y el mecanismo de actualización se especificarán en **WEB-003**.

## Prohibición de extracción masiva indiscriminada

La existencia de una API pública no debe interpretarse como autorización para descargar indiscriminadamente todo el contenido disponible.

MagNet debe solicitar únicamente los datos necesarios para su funcionamiento y evitar patrones que produzcan carga excesiva sobre el servicio externo.

Si Get on Board introduce límites adicionales o modifica sus condiciones, la integración deberá adaptarse.

## Manejo de indisponibilidad

Get on Board es un servicio externo sobre el que MagNet no tiene control.

La indisponibilidad de la fuente no debe provocar una falla completa del sistema.

El comportamiento esperado es:

1. FastAPI intenta recuperar las ofertas.
2. Si la fuente externa falla, FastAPI informa el error.
3. NestJS transforma el fallo en una respuesta controlada.
4. Las ofertas previamente almacenadas continúan disponibles desde PostgreSQL.
5. El frontend recibe un error controlado cuando corresponda.

## Uso ético

MagNet utiliza los datos de ofertas para ayudar al usuario a encontrar oportunidades relevantes.

El sistema no debe:

- atribuir a una persona características que no haya proporcionado;
- fabricar requisitos que no estén presentes en una oferta;
- utilizar datos privados de candidatos de Get on Board;
- realizar postulaciones automáticas en nombre del usuario;
- ocultar el origen de las ofertas;
- presentar como propia información proveniente de una fuente externa.

Las recomendaciones o cálculos de compatibilidad de MagNet deben distinguirse de la información publicada originalmente por Get on Board.

## Compatibilidad y procesamiento derivado

MagNet podrá procesar el texto público de una oferta para producir información propia, como:

- habilidades detectadas;
- requisitos relevantes;
- puntuación de compatibilidad;
- requisitos faltantes;
- explicaciones asociadas al resultado.

Estos resultados corresponden al procesamiento de MagNet y no deben presentarse como evaluaciones realizadas por Get on Board.

## Cambios en las condiciones

Las condiciones de servicios externos pueden cambiar.

Por esta razón, antes de una entrega importante o de un despliegue público debe revisarse nuevamente:

- documentación de la API;
- términos y condiciones;
- política de privacidad;
- cualquier nueva restricción técnica publicada.

Una modificación relevante deberá reflejarse en este documento y, si afecta la decisión arquitectónica, también en `ADR-001`.

## Fuentes oficiales consultadas

A noviembre de 2026 se revisaron las siguientes fuentes oficiales de Get on Board:

- documentación general de la API;
- documentación de usos permitidos de la API;
- términos y condiciones;
- política de privacidad y protección de datos.

No se encontró en estas fuentes públicas un límite numérico concreto de solicitudes para la API pública, por lo que MagNet no establece uno de manera arbitraria.

## Relación con otras tareas

- **WEB-001:** selección de Get on Board como fuente inicial.
- **WEB-002:** este documento.
- **WEB-003:** definición de frecuencia y estrategia de actualización.
- **ADR-001:** decisión arquitectónica sobre la fuente inicial.
- **PY-001:** recuperación efectiva de ofertas.
- **DB-003:** persistencia y deduplicación.

## Conclusión

MagNet utiliza Get on Board de manera acotada a su información pública de ofertas laborales, mantiene la procedencia de cada registro, minimiza los datos recuperados y evita acceder a información privada de candidatos.

La integración debe mantenerse conservadora frente a frecuencia de solicitudes y adaptarse ante futuros cambios en las políticas o límites de Get on Board.