# Runvato

Web estática (HTML + Tailwind por CDN) para una app de running para principiantes basada en intervalos caminar/correr. Sin build step, sin framework, sin gestor de paquetes. Idioma: **español**.

## Estructura

```
/
├── index.html                  ← landing pública (raíz del sitio)
├── app/
│   ├── index.html              ← splash / entrada a la app
│   ├── app.html                ← app de entrenamiento (intervalos, audio, guardado)
│   ├── area-usuario.html       ← historial, perfil, login Supabase
│   ├── audio/                  ← mp3 de avisos y música
│   └── img/
├── blog/
│   ├── grid-blog.html          ← índice del blog
│   ├── {slug}.html             ← un archivo por post
│   └── src/                    ← imágenes destacadas
├── train/
│   └── index.html              ← plan de entrenamiento (Reto 2026, sesiones, progreso)
├── web/
│   ├── privacidad.html
│   ├── cookies.html            ← usa widget de Cookiebot (no tabla manual)
│   └── src/
└── .github/workflows/deploy.yml
```

## Stack y convenciones

- **HTML estático puro** servido por hosting OVH. Tailwind se carga por CDN (`cdn.tailwindcss.com`) en cada página.
- **Tipografía**: Lexend (Google Fonts). Iconos: Material Symbols Outlined.
- **Color primario**: `#D1FF00` (lima). Fondo: `#000`. Tema oscuro por defecto.
- **Clase utilitaria**: `.runvato-font` (Lexend 800 italic, letter-spacing -0.05em, uppercase para títulos/logo).
- **Contenedor**: `.site-container` (max-width 1440px, padding responsive).
- **Backend**: Supabase (`criayuvoihnadarffnvk.supabase.co`) cargado por CDN UMD. Tablas conocidas: `settings`, `workouts`. Storage bucket: `avatars`. La anon key vive en el HTML del cliente — no es secreto.
- **Analytics**: Google Tag Manager (`GTM-KDDHTXZL`) + Cookiebot (`d5f6aaab-22c4-4aa7-8ff2-6700cc74d784`) presentes en páginas públicas. Cookiebot va con `data-blockingmode="auto"` y Tailwind con `data-cookieconsent="ignore"`.

## Despliegue

`.github/workflows/deploy.yml` sube todo el repo por SFTP a OVH (`ftp.cluster121.hosting.ovh.net`, usuario `runvatv`, destino `www/`) en cada push a `main`. Se ignoran `.git`, `.github` y `**/.DS_Store`. **Cualquier merge a `main` se publica en producción** — confirmar con el usuario antes de pushear.

Secret necesario: `FTP_PASSWORD` (configurado en GitHub Actions).

## Reglas operativas

- **No introducir build steps, bundlers, ni frameworks.** Es web estática a propósito.
- **No tocar `.DS_Store`** en commits salvo limpieza explícita.
- **Edits HTML**: respetar la mezcla de Tailwind + estilos inline existente; no “limpiar” a una sola convención sin pedirlo.
- **Antes de hacer push o merge a `main`**, avisar al usuario: dispara deploy a producción.

## Publicar un post de blog

Tres sitios a tocar **siempre**, y en este orden:

1. Crear `blog/{slug}.html` (copiar la estructura de un post existente, p. ej. `el-calentamiento.html`).
2. Añadir tarjeta en `blog/grid-blog.html` en **primera posición** del grid.
3. Actualizar la sección "Del blog" de `index.html` añadiendo el nuevo post en **primera posición** y desplazando los anteriores (mantener 3 visibles).

Imagen destacada en `blog/src/featured_{slug}.webp` (o numerada).

Rutas relativas:
- Desde `blog/{post}.html` → home `../index.html`, app `../app/index.html`, privacidad `../web/privacidad.html`, cookies `../web/cookies.html`, imagen `src/...`.
- Desde `index.html` → post `blog/{slug}.html`, imagen `blog/src/...`.
- Desde `blog/grid-blog.html` → post `{slug}.html`, imagen `src/...`.

## Sección de Entrenamiento (`train/index.html`)

**"Reto 2026"** es un plan de entrenamiento estructurado en semanas y sesiones. Características:

- **Tema claro** (no oscuro): paleta de azul (`#2952f0`) y grises. Inter font para UI limpia.
- **Estructura de datos**: JavaScript inline genera dinámicamente el plan, sesiones, progreso y estadísticas.
- **Componentes principales**:
  - Tarjeta de "Próxima sesión" (hero) con botón "Empezar"
  - Estadísticas: semanas completadas, sesiones, tiempo total, calorías
  - Calendario visual de sesiones por semana (completadas, próximas, skipped)
  - Gráficos de evolución (Chart.js)
  - Acceso rápido a nutrición/referencias
- **Sin Supabase en lectura** (datos hardcodeados en JS por ahora); guarda progreso en localStorage
- **Rutas internas**: `goSession(weekIdx, sessionIdx)` navega dentro del plan

> **Importante**: Las etiquetas de estado (PRÓXIMA, DELOAD, TAPERING, OBJETIVO) se renderizan como `<div class="tag">` en la tarjeta hero. Pueden ocultar contenido en móvil.

## Backup local

Backup manual del usuario en `/Users/miguelgarciarodriguez/Dropbox/Claude/runvato backup last/`. Para actualizarlo, copiar desde la raíz del proyecto: `app.html`, `area-usuario.html`, `index.html`, `audio/`, `img/`.

> Nota: las rutas del backup reflejan la estructura previa (con `app.html` en raíz). La estructura actual ya tiene `app.html` dentro de `app/`. Verificar con el usuario antes de copiar si esto importa.
