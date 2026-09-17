# 🐧 LinuxKit

### Plataforma práctica e interactiva de comandos Linux orientada a ciberseguridad y redes

**LinuxKit** es una herramienta web educativa para aprender, consultar y practicar comandos Linux. Combina un glosario de comandos con casos de uso guiados, un generador de comandos personalizado y un flujo de propuestas moderado por un administrador, pensado para estudiantes, administradores de sistemas, desarrolladores y cualquier persona que empiece a trabajar con Linux, servidores, VPS y ciberseguridad.

🔗 **Demo:** [linux-lexicon.vercel.app](https://linux-lexicon.vercel.app)

---

## 🚀 Características

### 📚 Glosario de comandos
- Más de 30 comandos organizados en categorías (Sistema, Archivos, Procesos, Servicios, Redes, Seguridad, Auditoría, Permisos, Incidentes, Paquetes, Almacenamiento, Contenedores, Git).
- Cada comando incluye descripción, sintaxis, ejemplo práctico, nivel (Básico / Intermedio / Avanzado) y etiquetas.
- Búsqueda y filtrado por categoría.
- Botón de copiado rápido al portapapeles.

### 📖 Biblioteca ampliada
- Colección de comandos agrupados por tema, combinando contenido estático con comandos aprobados dinámicamente desde Firestore.

### 🧩 Casos de uso guiados
- Escenarios reales paso a paso (por ejemplo, *"Servidor bajo ataque"*, *"Endurecer SSH"*) que guían al usuario por un flujo de diagnóstico y respuesta.

### 🛡️ Sección de seguridad
- Buenas prácticas y reglas de uso ético/autorizado antes de ejecutar cualquier prueba.
- Generador de comandos `nmap` con campos rellenables (`{{objetivo}}`, `{{cantidad}}`, etc.).

### 🧪 Laboratorio de comandos
- Generador de comandos personalizado a partir de plantillas ("flows") con campos configurables.
- Permite guardar y reutilizar comandos propios dentro de la sesión.

### 🎯 Ataques controlados
- Ejercicios de detección (escaneos, rate limiting, reglas IDS/IPS) diseñados para practicarse sobre logs y entornos propios, sin generar tráfico ofensivo.

### 📝 Propuesta de comandos
- Cualquier persona puede sugerir un nuevo comando desde `/proponer-comando`, sin necesidad de crear cuenta.
- Cada propuesta queda en estado `pending` hasta ser revisada.

### 🔐 Panel de administración
- Ruta `/admin/comandos` protegida con Firebase Auth.
- Permite aprobar o rechazar propuestas; al aprobarlas se publican automáticamente en el glosario público.

---

## 🛠️ Tecnologías utilizadas

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4** + **shadcn/ui**
- **Firebase** (Authentication + Firestore) como backend
- **Vercel Analytics**
- **lucide-react** para iconografía
- Gestor de paquetes: **pnpm**

---

## 📂 Estructura del proyecto

```
LinuxKit/
├── app/
│   ├── page.tsx                  # Glosario principal
│   ├── layout.tsx
│   ├── admin/comandos/           # Panel de administración (login + moderación)
│   ├── ataques-controlados/      # Ejercicios de detección
│   ├── biblioteca/               # Biblioteca ampliada de comandos
│   ├── casos/                    # Casos de uso guiados
│   ├── laboratorio/              # Generador de comandos personalizado
│   ├── proponer-comando/         # Formulario público de propuestas
│   └── seguridad/                # Buenas prácticas + generador nmap
├── components/ui/                # Componentes shadcn/ui
├── lib/
│   ├── firebase.ts               # Configuración e inicialización de Firebase
│   └── utils.ts
├── public/                       # Íconos y estáticos
├── firestore.rules               # Reglas de seguridad de Firestore
├── package.json
└── README.md
```

---

## 💻 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/jess300605/LinuxKit.git
cd LinuxKit
```

### 2. Instalar dependencias

```bash
pnpm install
# o
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz con tus credenciales de Firebase (necesarias para el glosario dinámico, las propuestas y el panel de administración):

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

> Si no se configuran estas variables, la app sigue funcionando: el glosario estático se muestra igual, pero las funciones que dependen de Firestore (biblioteca dinámica, propuestas, panel admin) quedan deshabilitadas.

### 4. Ejecutar en modo desarrollo

```bash
pnpm dev
# o
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### 5. Generar una versión de producción

```bash
pnpm build
pnpm start
```

---

## 🔥 Configuración de Firebase

El proyecto usa dos colecciones principales en Firestore:

- **`commands`** — comandos aprobados y publicados (lectura pública, escritura solo admin).
- **`commandProposals`** — propuestas enviadas desde `/proponer-comando`, en estado `pending` / `approved` / `rejected`.

Las reglas de seguridad (`firestore.rules`) definen que solo un usuario administrador —identificado por su UID o presente en la colección `admins/`— puede revisar, aprobar o rechazar propuestas. Antes de desplegar tu propia instancia, revisa y adapta `firestore.rules` a tu proyecto de Firebase, y considera añadir **Firebase App Check** al formulario público para prevenir spam automatizado.

---

## 🎯 Objetivo del proyecto

LinuxKit nace como un proyecto educativo para reunir en una sola herramienta el aprendizaje de comandos Linux con práctica guiada de ciberseguridad. El objetivo es que el usuario no solo copie un comando, sino que comprenda:

- Qué hace.
- Cómo funciona.
- Cuándo utilizarlo.
- Qué parámetros acepta.
- Qué resultado puede esperar.
- En qué escenario real (caso de uso) se aplicaría.

---

## ⚠️ Uso responsable

Algunos comandos Linux —y en particular los relacionados con escaneo de redes, auditoría o pruebas de seguridad— pueden modificar archivos, permisos, usuarios, procesos o configuraciones del sistema, o ser interpretados como actividad ofensiva si se usan sin autorización.

- Utiliza estos comandos solo en sistemas y redes que administras o para los que tienes autorización explícita.
- Los ejercicios de la sección "Ataques controlados" están diseñados para practicarse sobre entornos propios (laboratorio, VPS personal), nunca contra terceros.
- LinuxKit tiene fines **educativos, administrativos y de aprendizaje** — no sustituye el criterio profesional ni la normativa legal aplicable.

---

## 🤝 Contribuir

¿Tienes un comando útil que no está en el glosario? Puedes proponerlo directamente desde la app en [`/proponer-comando`](https://linux-lexicon.vercel.app/proponer-comando) — quedará pendiente de revisión antes de publicarse.

Para contribuir al código, puedes abrir un *issue* o un *pull request* en este repositorio.

---

## 👨‍💻 Autor

**Jesús Sanabria**

Proyecto desarrollado como iniciativa personal enfocada en el aprendizaje de:

- Linux y administración de sistemas
- Servidores y VPS
- Ciberseguridad
- Desarrollo web

- GitHub: [github.com/jess300605](https://github.com/jess300605)
- Proyecto: [github.com/jess300605/LinuxKit](https://github.com/jess300605/LinuxKit)

---

## 📄 Licencia

Este proyecto puede utilizarse como material educativo. Si deseas reutilizar o modificar el proyecto, se recomienda mantener la atribución correspondiente al autor original.

---

**🐧 LinuxKit — Aprende Linux. Comprende los comandos. Practica con criterio.**
