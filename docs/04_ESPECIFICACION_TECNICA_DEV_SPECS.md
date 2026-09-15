# 🛠️ KLICK! — Especificación Técnica de Desarrollo (Developer Specs)

> **Documento Base:** Consolidación de `KLICK_Search_Match_Developer_Spec-2.xlsx` (Hojas 00 a 10).  
> **Destinatarios:** Ingenieros de Software, QA, Arquitectos y Auditores de Seguridad.  

---

## 📌 00. Principios del Sistema y Reglas Críticas

1. **Pipeline de Conexión Klick Determinista:**
   $$\text{Safety Gate} \longrightarrow \text{Hard Compatibility} \longrightarrow \text{Weighted Score} \longrightarrow \text{60\% Threshold} \longrightarrow \text{Common Ground} \longrightarrow \text{Connection}$$
2. **Regla de Oro:** Un score del $85\%$ o superior **nunca anula** una falla en los filtros de seguridad o en un requisito marcado como *Indispensable*.
3. **Escala de Compatibilidad:**
   - `0% - 59.99%`: Incompatible / Conexión Bloqueada.
   - `60% - 69.99%`: Compatible (Apto para match y Common Ground).
   - `70% - 84.99%`: Alta Compatibilidad.
   - `85% - 100%`: Excelente Compatibilidad.
4. **Common Ground:** Selección de **3 a 7 coincidencias reales** entre perfiles basadas exclusivamente en datos autorizados por ambos usuarios.
5. **Guardrails de Inteligencia Artificial:** La IA asiste en la explicación del score y en educación relacional; **tiene prohibido emitir diagnósticos clínicos, inventar datos o formular acusaciones automáticas**.

---

## 🔍 01. Catálogo de Filtros de Búsqueda (F-001 a F-031)

| ID | Categoría | Campo / Pregunta | Tipo de Dato | Opciones / Valores | Match | Peso | ¿Puede ser Indispensable? | Nivel de Acceso | Notas Técnicas |
| :--- | :--- | :--- | :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| **F-001** | Fe | Fe / Valores | Enum | `LDS`, `Christian`, `Other`, `Prefer not` | Sí | 5 | Sí | Básico | Dato autorizado. |
| **F-002** | Fe | Importancia de la fe | Enum | `Very important`, `Important`, `Flexible` | Sí | 5 | Sí | Básico | Puede actuar como hard filter. |
| **F-003** | Fe | Temple Recommend actual | Enum | `Sí`, `No`, `Prefiero no indicar` | Sí | 5 | Sí | Premium | No revelar sin autorización explícita. |
| **F-004** | Fe | Requisito Temple Recommend | Enum | `Indispensable`, `Preferred`, `No importa` | Sí | 5 | N/A | Premium | *Indispensable* excluye antes de calcular el score. |
| **F-005** | Idioma | Idioma principal | Multi-select | `English`, `Spanish`, `Other` | Sí | 4 | Sí | Básico | Normalizar códigos ISO. |
| **F-006** | Idioma | Idioma deseado en pareja | Multi-select | `English`, `Spanish`, `Other` | Sí | 4 | Sí | Básico | *Indispensable* puede excluir perfiles. |
| **F-007** | Seguridad | Identidad verificada | Status | `Verified`, `Pending`, `Failed` | Sí | 6 | Sí | Básico | Puerta de seguridad crítica. |
| **F-008** | Seguridad | Bloqueo mutuo | Boolean | `true` / `false` | No | 0 | Sí | Básico | Excluir siempre de consultas. |
| **F-009** | Seguridad | Restricción activa | Status | `None`, `Review`, `Restricted` | Sí | 6 | Sí | Básico | Prioridad Trust & Safety. |
| **F-010** | Familia | Tiene hijos | Enum | `Sí`, `No` | Sí | 5 | Sí | Premium | Control estricto de privacidad. |
| **F-011** | Familia | Desea hijos | Enum | `Sí`, `No`, `No seguro` | Sí | 5 | Sí | Premium | Comparación directa de preferencias. |
| **F-012** | Familia | Acepta pareja con hijos | Enum | `Sí`, `No`, `Flexible` | Sí | 5 | Sí | Premium | Hard filter si es indispensable. |
| **F-013** | Matrimonio | Estado civil | Enum | `Soltero`, `Divorciado`, `Viudo`, `Otro` | Sí | 5 | Sí | Premium | Dato declarado (no inferir). |
| **F-014** | Matrimonio | Número de divorcios | Integer | `0+` | Sí | 5 | Sí | Premium | Declaración de usuario. |
| **F-015** | Matrimonio | Busca matrimonio | Enum | `Sí`, `No`, `Maybe` | Sí | 5 | Sí | Premium | Puede ser indispensable. |
| **F-016** | Matrimonio | Plazo deseado | Enum | `<1 año`, `1–2 años`, `2+ años`, `Flexible` | Sí | 5 | No | Premium | Alineación de objetivos de vida. |
| **F-017** | Distancia | Distancia máxima | Number | Millas (ej. `25`, `50`, `100`) | Sí | 4 | Sí | Básico | Cálculo con coordenadas aproximadas. |
| **F-018** | Distancia | Disposición a mudarse | Enum | `Sí`, `No`, `Maybe` | Sí | 4 | No | Premium | Factor de compatibilidad geográfica. |
| **F-019** | Lifestyle | Rutina de vida | Multi-select | `Activo`, `Tranquilo`, `Social`, `Hogareño` | Sí | 4 | No | Premium | Normalizado en catálogo. |
| **F-020** | Lifestyle | Trabajo / Ocupación | String/Cat | Categorías normalizadas | Sí | 4 | No | Premium | Sin discriminación indebida. |
| **F-021** | Lifestyle | Estudia actualmente | Boolean | `true` / `false` | Sí | 4 | No | Premium | Utilizable en Common Ground. |
| **F-022** | Compatibilidad | Estilo de comunicación | Multi-select | `Directo`, `Tranquilo`, `Social`, `Reservado` | Sí | 4 | No | Premium | Sin diagnósticos psicológicos. |
| **F-023** | Compatibilidad | Metas corto plazo | Multi/Text | `Familia`, `Carrera`, `Educación`, `Fe` | Sí | 4 | No | Premium | Comparación semántica y de coincidencia. |
| **F-024** | Compatibilidad | Metas largo plazo | Multi/Text | `Familia`, `Matrimonio`, `Emprendimiento` | Sí | 4 | No | Premium | Comparación de visión de vida. |
| **F-025** | Hobbies | Pasatiempos | Multi-select | `Senderismo`, `Lectura`, `Música`, `Cocina` | Sí | 3 | No | Premium | Fuente para Common Ground. |
| **F-026** | Hobbies | Deportes | Multi-select | `Pickleball`, `Running`, `Gym`, `Escalada` | Sí | 3 | No | Premium | Fuente para Common Ground. |
| **F-027** | Hobbies | Culinaria | Multi-select | Categorías gastronómicas preferidas | Sí | 3 | No | Premium | No inferir alergias. |
| **F-028** | Hobbies | Cultura / Lectura | Multi-select | `Libros`, `Cine`, `Arte`, `Viajes` | Sí | 3 | No | Premium | Temas de conversación inicial. |
| **F-029** | Primera Cita | Tipo de cita preferida | Multi-select | `Café`, `Caminata`, `Restaurante`, `Actividad` | Sí | 3 | No | Premium | Base para *Safe First Date*. |
| **F-030** | Primera Cita | Preferencias de seguridad | Multi-select | `Lugar público`, `Diurno`, `Check-in` | Sí | 3 | Sí | Básico | **Obligatorio y no ignorar**. |
| **F-031** | IA | Consentimiento uso IA | Boolean | `true` / `false` | Sí | 0 | Sí | Básico | Solo procesar datos con consentimiento. |

---

## 📝 02. Registro e Inscripción (REG-001 a REG-017)

| ID | Sección | Campo | Tipo | Requerido | Nivel de Privacidad | Usado en Match | Visibilidad |
| :--- | :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| **REG-001** | Cuenta | Correo Electrónico | Email | Sí | Privado | No | Servidor / Auth |
| **REG-002** | Cuenta | Número Telefónico | Phone | Sí | Privado | No | OTP / Servidor |
| **REG-003** | Identidad | Fecha de Nacimiento | Date | Sí | Privado | Sí | Se calcula y muestra solo edad en años |
| **REG-004** | Identidad | Verificación KYC / Liveness | KYC Doc | Sí | Privado | Sí | Insignia `Verified` en perfil |
| **REG-005** | Perfil | Nombre Mostrado | String | Sí | Público | No | Visible para todos |
| **REG-006** | Perfil | Fotografías | Media[] | Sí | Público | No | Moderadas con IA antes de publicar |
| **REG-007** | Ubicación | Ciudad / Área | Geo | Sí | Aproximado | Sí | Ciudad/Estado (nunca coordenadas GPS) |
| **REG-008** | Relación | Objetivo de relación | Enum | Sí | Controlado | Sí | Público / Básico |
| **REG-009** | Fe | Fe / Temple Recommend | Enum | Config | Controlado | Sí | Premium / Consentimiento |
| **REG-010** | Familia | Situación y planes de hijos | Enum | Sí | Controlado | Sí | Premium |
| **REG-011** | Matrimonio | Estado civil y visión | Enum | Sí | Controlado | Sí | Premium |
| **REG-012** | Lifestyle | Ocupación y rutina | Mixed | Sí | Controlado | Sí | Premium |
| **REG-013** | Intereses | Hobbies y deportes | Multi | Sí | Controlado | Sí | Premium |
| **REG-014** | Metas | Metas personales | Multi | Sí | Controlado | Sí | Premium |
| **REG-015** | Seguridad | Preferencias Safe First Date | Multi | Sí | Controlado | Sí | Básico |
| **REG-016** | Preferencias | Rango edad y distancia | Range | Sí | Privado | Sí | Configuración interna de búsqueda |
| **REG-017** | Preferencias | Requisitos indispensables | Enum[] | Sí | Privado | Sí | Configuración interna de filtros |

---

## ⚖️ 03. Reglas y Ponderación del Motor de Compatibilidad (M-001 a M-010)

### Ponderación Oficial de Categorías

$$\text{Peso Total} = 6 + 5 + 5 + 5 + 4 + 4 + 4 + 4 + 3 + 3 = 43$$

| Categoría | Peso Asignado | Impacto en el Cálculo |
| :--- | :---: | :--- |
| **1. Seguridad & Confianza** | **6** | Verificación de identidad, historial libre de sanciones. |
| **2. Fe y Valores LDS** | **5** | Afinidad religiosa, asistencia a la Iglesia, Temple Recommend. |
| **3. Matrimonio & Objetivos** | **5** | Deseo de matrimonio en el templo, plazos coincidentes. |
| **4. Familia & Hijos** | **5** | Compatibilidad en tener/criar hijos y aceptar hijos previos. |
| **5. Idioma & Cultura** | **4** | Coincidencia en idiomas principales y secundarios. |
| **6. Distancia Geográfica** | **4** | Proximidad aproximada y flexibilidad de traslado. |
| **7. Estilo de Vida & Rutina** | **4** | Nivel de actividad, compatibilidad horaria y ocupación. |
| **8. Personalidad & Metas** | **4** | Estilo de comunicación y coincidencia en metas de vida. |
| **9. Hobbies e Intereses** | **3** | Actividades recreativas, deportes, cocina y cultura. |
| **10. Safe First Date** | **3** | Alineación en tipos de citas seguras preferidas. |

### Reglas de Ejecución

- **M-001 (Safety Gate):** Perfiles en estado `Restricted`, `Review` o con bloqueo mutuo activo reciben resultado inmediato `EXCLUDE`.
- **M-002 (Hard Compatibility Gate):** Si un usuario marcó un atributo como `Indispensable` y el candidato no coincide exactamente, el resultado es `EXCLUDE`.
- **M-003 (Distance Gate):** Si la distancia aproximada supera el radio máximo definido, el resultado es `EXCLUDE`.
- **M-004 / M-005 (Score Ponderado):** Cálculo determinista normalizado de 0 a 100%.
- **M-006 / M-009 (Umbral 60%):** Score $\ge 60.0\%$ $\rightarrow$ `PASS`; Score $< 60.0\%$ $\rightarrow$ `BLOCK` (no apto para conexión).
- **M-007 (Common Ground):** Identificación algorítmica de 3 a 7 coincidencias exactas entre atributos autorizados.
- **M-010 (Explicabilidad IA):** Generación de explicaciones de compatibilidad basadas exclusivamente en las coincidencias verificables.

---

## 💻 04. Módulos de Desarrollo para Ingenieros (DEV-001 a DEV-020)

| ID | Módulo | Entradas | Regla / Lógica Principal | Salida Esperada | Prioridad |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **DEV-001** | Onboarding & Profile | Datos `REG-001..017` | Validación de esquema Zod, almacenamiento seguro en Firestore. | Perfil creado | **P0** |
| **DEV-002** | Identity KYC | Documento + Selfie | Integración con proveedor KYC seguro, actualización de status `Verified`. | Status KYC | **P0** |
| **DEV-003** | Privacy Engine | Perfil + Rol de usuario | Filtrado server-side de campos sensibles según plan de suscripción. | Perfil Sanitizado | **P0** |
| **DEV-004** | Search Engine | Preferencias de usuario | Query combinada con filtros básicos de radio, edad y género. | Lista Candidatos | **P0** |
| **DEV-005** | Safety Gate | Bloqueos / Restricciones | Evaluación de listas de exclusión previas al matching. | `PASS` / `EXCLUDE` | **P0** |
| **DEV-006** | Hard Compatibility | Requisitos `Indispensable` | Evaluación booleana estricta de requisitos excluyentes. | `PASS` / `EXCLUDE` | **P0** |
| **DEV-007** | Klick Engine | Perfiles A y B | Algoritmo de 10 categorías ponderadas y normalización. | Score (0–100%) | **P0** |
| **DEV-008** | Threshold Evaluator | Score numérico | Regla de corte en $60.00\%$. | `PASS` / `BLOCK` | **P0** |
| **DEV-009** | Common Ground | Datos autorizados A y B | Extracción de 3 a 7 elementos coincidentes. | Array Coincidencias | **P0** |
| **DEV-010** | Connection Manager | Estado de Gates y Score | Habilitación de interacción y creación de hilo de chat. | `ALLOW` / `DENY` | **P0** |
| **DEV-011** | Premium Entitlements | UID + Plan | Verificación server-side en Firebase / Stripe antes de permitir chat. | `ALLOW` / `DENY` | **P0** |
| **DEV-012** | Women Free Engine | UID + Género verificado | Asignación automática de entitlements completos a mujeres. | Acceso Gratuito | **P0** |
| **DEV-013** | Block & Report | UID Emisor + Receptor + Motivo | Bloqueo bidireccional instantáneo y creación de ticket de reporte. | Caso de Seguridad | **P0** |
| **DEV-014** | Safe First Date | Match ID + Propuesta de Cita | Registro de plan seguro, lugar público, horario y check-in. | Plan Cita Segura | **P0** |
| **DEV-015** | AI Compatibility Coach | Score + Common Ground | Explicación en lenguaje natural de la compatibilidad real. | Texto explicativo | **P1** |
| **DEV-016** | AI Relationship Education | Consulta del usuario | Respuestas educativas con guardrails (sin diagnósticos). | Contenido Educativo | **P1** |
| **DEV-017** | Content Moderation | Imágenes y texto | Análisis automático con Vertex AI + cola para moderadores. | `ALLOW` / `REMOVE` | **P0** |
| **DEV-018** | Admin Dashboard | Credenciales Admin | Panel interno con RBAC, MFA obligatorio y logs de auditoría. | Panel Seguro | **P0** |
| **DEV-019** | Product Analytics | Eventos de usuario | Telemetría anonimizada de funnels (Onboarding $\rightarrow$ Date). | Métricas BigQuery | **P1** |
| **DEV-020** | Automated Test Suite | Casos de Prueba | Suite de pruebas unitarias, de integración y E2E para gates. | Test Report | **P0** |

---

## 🛡️ 06. Controles de Seguridad (SEC-01 a SEC-10)

- **SEC-01 (Identidad y Edad):** Verificación KYC con retención mínima de PII.
- **SEC-02 (Geolocalización Difusa):** Visualización únicamente de ciudad o código postal aproximado; **nunca coordenadas exactas**.
- **SEC-03 (Bloqueo Instantáneo):** Bloqueo bidireccional que elimina toda visibilidad mutua en tiempo real.
- **SEC-04 (Trazabilidad de Reportes):** Todo reporte genera un ticket auditable con motivo, categoría y evidencia.
- **SEC-05 / SEC-07 (Anti-Scam y Anti-Spam):** Rate limits estrictos en envío de mensajes, detección de enlaces maliciosos y solicitudes financieras.
- **SEC-06 (Moderación de Contenido):** Filtrado de imágenes explícitas antes de su almacenamiento definitivo.
- **SEC-08 (Seguridad Administrativa):** MFA obligatorio y principio de menor privilegio (Least Privilege) para el equipo de operaciones.
- **SEC-09 (Cifrado Integral):** Cifrado en tránsito (TLS 1.3) y en reposo (AES-256) en Firestore y Cloud Storage.
- **SEC-10 (Auditoría Inmutable):** Registro de logs de acciones críticas para investigaciones de seguridad.

---

## 🤖 07. Asistente IA Responsable (AI-01 a AI-05)

| ID | Nombre de Función | Entradas Permitidas | Lo que HACE | Lo que NO HACE (Límites Estrictos) |
| :--- | :--- | :--- | :--- | :--- |
| **AI-01** | **Compatibility Coach** | Datos autorizados + Score | Explica las áreas de afinidad y sugiere preguntas para romper el hielo. | No inventa intereses ni fuerza compatibilidades artificiales. |
| **AI-02** | **Date Coach** | Common Ground + Preferencias | Recomienda ideas de citas públicas, actividades diurnas y seguras. | No sugiere ubicaciones privadas ni comparte datos de contacto sin permiso. |
| **AI-03** | **Relationship Education** | Preguntas educativas del usuario | Ofrece guías sobre comunicación, respeto, resolución de conflictos y límites saludables. | **No realiza diagnósticos psicológicos ni reemplaza asesoría profesional o legal.** |
| **AI-04** | **Safety Assistant** | Políticas de seguridad + Duda del usuario | Explica cómo reportar, bloquear o activar el protocolo de *Safe First Date*. | No emite juicios acusatorios automáticos sin revisión. |
| **AI-05** | **AI Explanation Engine** | Score + Pesos de categorías | Desglosa los factores reales que componen la puntuación. | No expone datos marcados como privados por el otro usuario. |

---

## 🧪 10. Pruebas de Aceptación Obligatorias (AT-001 a AT-015)

| Test ID | Escenario de Prueba | Datos de Entrada | Resultado Esperado | Prioridad |
| :--- | :--- | :--- | :--- | :---: |
| **AT-001** | Puntaje menor al umbral | Score = $59.99\%$; todos los demás gates aprobados. | Conexión **BLOQUEADA**; no se habilita match ni chat. | **P0** |
| **AT-002** | Puntaje en el umbral exacto | Score = $60.00\%$; todos los demás gates aprobados. | Conexión **AUTORIZADA**; se presenta Common Ground y opción de match. | **P0** |
| **AT-003** | Requisito Indispensable insatisfecho | Score = $88.00\%$; un requisito *Indispensable* no coincide. | Perfil **EXCLUIDO** completamente de los resultados. | **P0** |
| **AT-004** | Usuario bloqueado | Usuario A tiene bloqueado a Usuario B. | Ninguno puede ver el perfil ni comunicarse con el otro. | **P0** |
| **AT-005** | Usuario restringido | Usuario B tiene estado `Restricted` por seguridad. | Excluido de todo el motor de conexión Klick. | **P0** |
| **AT-006** | Usuario no verificado | Usuario B tiene estado KYC `Pending` o `Failed`. | Restricciones de interacción aplicadas según política. | **P0** |
| **AT-007** | Distancia excedida | Distancia aproximada = 45 mi; límite de búsqueda = 30 mi. | Perfil **EXCLUIDO** de los resultados de búsqueda. | **P0** |
| **AT-008** | Extracción de Common Ground | Usuarios coinciden en Senderismo, Español y Matrimonio. | Se muestran exactamente las 3 coincidencias reales autorizadas. | **P0** |
| **AT-009** | Protección de datos Premium | Usuario Hombre Gratis solicita campo detallado de fe/matrimonio. | El servidor **rechaza** la solicitud con error 403 Forbidden. | **P0** |
| **AT-010** | Suscripción Mujer Gratuita | Mujer verificada crea cuenta e interactúa. | Acceso completo concedido sin cargos de suscripción. | **P0** |
| **AT-011** | Explicabilidad IA | Consulta sobre por qué hubo 75% de compatibilidad. | La IA enumera las categorías de coincidencia sin inventar datos. | **P1** |
| **AT-012** | Consulta educativa sensible | Pregunta sobre resolución de infidelidad o pornografía. | Respuesta reflexiva y educativa recomendando ayuda profesional si aplica. | **P1** |
| **AT-013** | Coordinación Safe First Date | Match confirmado solicita plan de primera cita. | Generación de plan con lugar público, hora y check-in activo. | **P0** |
| **AT-014** | Intento de acceso no autorizado a Admin | Usuario sin rol Admin intenta invocar endpoint `/api/admin/*`. | Denegación inmediata con código 403 y registro en log de auditoría. | **P0** |
| **AT-015** | Auditoría de acciones críticas | Bloqueo, reporte o cambio de estado de usuario ejecutado. | Registro inmutable generado con timestamp, UID y tipo de evento. | **P0** |
