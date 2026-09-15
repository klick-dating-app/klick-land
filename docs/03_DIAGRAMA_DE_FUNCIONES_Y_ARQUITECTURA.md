# 📊 KLICK! — Diagramas de Funciones, Flujos y Arquitectura

Este documento consolida todos los diagramas técnicos y funcionales de **KLICK!**, estructurados con sintaxis [Mermaid](https://mermaid.js.org/) para su renderizado nativo en Markdown y herramientas visuales.

---

## 1. Diagrama General de Módulos Funcionales (00 a 10)

```mermaid
flowchart TD
    subgraph M00["00. Arquitectura & Reglas Maestras"]
        CoreRule["Regla Crítica: 60% + Seguridad + Requisitos Indispensables"]
    end

    subgraph M01["01 & 02. Registro, KYC & Preferencias"]
        REG["02. Registro & Inscripción (REG-001..017)"]
        KYC["06. Identidad & Edad (SEC-01)"]
        FILT["01. Filtros de Búsqueda (F-001..031)"]
        REG --> KYC --> FILT
    end

    subgraph M03["03 & 04. Motor de Matching & Compatibilidad"]
        GATE1["Hard Safety Filters (Bloqueos/Restricciones)"]
        GATE2["Hard Compatibility Filters (Indispensables)"]
        SCORE["Cálculo de Score Ponderado (0-100%)"]
        GATE60["Regla del Umbral 60%"]
        CG["Common Ground (3 a 7 Coincidencias)"]
        
        FILT --> GATE1 --> GATE2 --> SCORE --> GATE60 --> CG
    end

    subgraph M05["05. Suscripciones & Control de Acceso"]
        Entitlements["Entitlements Server-Side"]
        WomenFree["Mujeres: 100% Gratis"]
        MenTiers["Hombres: Free vs Premium (Stripe/Solana)"]
        Entitlements --> WomenFree
        Entitlements --> MenTiers
    end

    subgraph M08["08. Conexión & Safe First Date"]
        ChatModule["Chat Seguro & Notificaciones Push"]
        DatePlan["Safe First Date (Lugares Públicos + Check-in)"]
        CG --> ChatModule --> DatePlan
    end

    subgraph M06_07["06 & 07. Seguridad, Moderación & IA"]
        Moderation["Vertex AI + Moderación Humana (SEC-06)"]
        BlockReport["Sistema de Bloqueo & Reportes (SEC-03/04)"]
        AICoach["07. IA Compatibility & Relationship Education (AI-01..05)"]
    end

    subgraph M09_10["09 & 10. Roadmap & Pruebas"]
        MVP["09. MVP Web2 → Fase 2 Web3"]
        Tests["10. Acceptance Tests Automatizados (AT-001..016)"]
    end

    M03 -.-> M05
    M05 -.-> M08
    M08 -.-> M06_07
    M06_07 -.-> M09_10
```

---

## 2. Flujo Completo del Motor de Matching (Pipeline de 6 Pasos)

```mermaid
sequenceDiagram
    autonumber
    actor UsuarioA as Usuario A
    participant Engine as Motor de Matching (Cloud Functions)
    participant DB as Firestore / Cloud SQL
    actor UsuarioB as Candidato B

    UsuarioA->>Engine: Solicitar candidatos compatibles
    Engine->>DB: Obtener perfiles disponibles según radio geográfico
    
    rect rgb(255, 230, 230)
        Note over Engine: PASO 1: Hard Safety Gate
        Engine->>Engine: ¿Está verificado? ¿Hay bloqueo mutuo o sanción?
        alt Falla Seguridad
            Engine-->>UsuarioA: Excluir candidato (No mostrar)
        end
    end

    rect rgb(255, 245, 220)
        Note over Engine: PASO 2: Hard Compatibility Gate
        Engine->>Engine: Evaluar campos marcados como 'Indispensable' (Fe, Hijos, etc.)
        alt No coincide algún 'Indispensable'
            Engine-->>UsuarioA: Excluir candidato (No mostrar)
        end
    end

    rect rgb(230, 245, 255)
        Note over Engine: PASO 3: Cálculo Multidimensional (0 - 100%)
        Engine->>Engine: Sumar categorías ponderadas (Fe:5, Matrimonio:5, Familia:5, etc.)
        Engine->>Engine: Normalizar Score Final (0 a 100%)
    end

    rect rgb(230, 255, 230)
        Note over Engine: PASO 4: Regla del Umbral 60%
        alt Score < 60.0%
            Engine-->>UsuarioA: Bloquear conexión / No elegible para match
        else Score >= 60.0%
            Note over Engine: PASO 5: Extracción de Common Ground
            Engine->>Engine: Identificar 3 a 7 coincidencias reales autorizadas
            Note over Engine: PASO 6: Habilitar Conexión
            Engine-->>UsuarioA: Mostrar perfil + Score + Puntos de Encuentro
        end
    end
```

---

## 3. Protocolo "Safe First Date" (Primera Cita Segura)

```mermaid
stateDiagram-v2
    [*] --> MatchConfirmado: Match Autorizado (Score >= 60% + Puntos Comunes)
    MatchConfirmado --> PropuestaCita: Usuario A o B propone encuentro
    
    state PropuestaCita {
        [*] --> SeleccionarLugarPublico: Catálogo de lugares públicos / diurnos
        SeleccionarLugarPublico --> DefinirHorario: Horario seguro
        DefinirHorario --> RegistrarContactoEmergencia: Contacto de confianza privado
    }

    PropuestaCita --> AceptacionMutua: Ambos confirman plan
    AceptacionMutua --> RecordatorioPrevio: Notificación FCM 2h antes
    RecordatorioPrevio --> CitaEnCurso: Llegada al lugar
    
    state CitaEnCurso {
        [*] --> CheckInLlegada: Botón "Llegué seguro/a"
        CheckInLlegada --> BotonEmergencia: Alerta / Bloqueo rápido disponible
    }

    CitaEnCurso --> PostCita: Finalización del encuentro
    state PostCita {
        [*] --> CheckInRetorno: Confirmar regreso seguro
        CheckInRetorno --> FeedbackPrivado: Evaluación de respeto y seguridad
        FeedbackPrivado --> ReporteIncidente: (Opcional) Denunciar comportamiento
    }

    PostCita --> [*]
```

---

## 4. Arquitectura de Transición: Fase 1 (Web2) vs Fase 2 (Web3 Solana)

```mermaid
flowchart TB
    subgraph ClientLayer["Capa de Cliente Unificada (Next.js + Tailwind + Capacitor)"]
        UI["Interfaz KLICK! (PWA Web + iOS + Android)"]
        Screens["Descubrir | Matches | Chats | Fe LDS | Safe First Date | Mi Perfil"]
        UI --- Screens
    end

    subgraph Web2Backend["Fase 1: Backend Google Cloud / Firebase (Off-Chain)"]
        Auth2["Firebase Authentication (Email, Apple, Google, SMS)"]
        Firestore["Cloud Firestore (Perfiles, Matches, Score, Chats)"]
        Storage["Cloud Storage (Fotos Privadas / KYC cifrado)"]
        Functions["Cloud Functions / Cloud Run (Match Engine & Moderación)"]
        Stripe["Stripe Payments (Suscripciones FIAT)"]
        Vertex["Vertex AI (Moderación y Asistente Educativo)"]
    end

    subgraph Web3Solana["Fase 2: Capa de Identidad & Valor en Solana (On-Chain)"]
        Wallet["Solana Wallet Adapter (Phantom, Solflare)"]
        AnchorProg["Programa Anchor KLICK! en Solana"]
        PDA["User PDAs (ID, Verificación On-Chain, Reputación)"]
        DecentStorage["Arweave / IPFS (Metadata Pública Descentralizada)"]
        USDC["USDC Payments & Solana Pay"]
        Helius["Helius / Triton RPC Nodes"]
    end

    ClientLayer --> Web2Backend
    ClientLayer -.->|Activación Fase 2| Web3Solana
    Web3Solana <-->|Sincronización de Identidad| Web2Backend
```

---

## 5. Matriz de Acceso y Entitlements de Usuario

```mermaid
classDiagram
    class PerfilUsuario {
        +String nombreMostrado
        +String fotoPrincipal
        +Number compatibilidadScore
        +List commonGroundBasico
        +Enum estadoVerificacion
    }

    class HombreGratis {
        +Ver perfiles recomendados()
        +Ver Score de compatibilidad()
        +Ver 3 puntos de Common Ground()
        -Iniciar conversaciones() [BLOQUEADO]
        -Ver detalles fe/hobbies/matrimonio() [BLOQUEADO]
    }

    class HombrePremium {
        +Todas las funciones gratis()
        +Iniciar conversaciones de chat()
        +Ver detalles completos (fe, educación, metas)()
        +Filtros avanzados ilimitados()
        +Coordinar Safe First Date()
    }

    class MujerGratis {
        +Acceso 100% Completo y Gratuito()
        +Iniciar y responder chats()
        +Ver detalles completos autorizados()
        +Coordinar Safe First Date()
        +Filtros avanzados completos()
    }

    PerfilUsuario <|-- HombreGratis
    PerfilUsuario <|-- HombrePremium
    PerfilUsuario <|-- MujerGratis
```
