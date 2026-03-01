## SonarTrack

SonarTrack es un dashboard minimalista en modo oscuro construido con **Next.js 13+ (App Router)**, **TypeScript**, **Tailwind CSS** y **NextAuth**, que se conecta a **Spotify** para mostrar:

- Tus **top tracks**
- Tus **top artistas**
- Tus **canciones reproducidas recientemente**

La interfaz soporta **inglés y español**, conmutables por el usuario.

---

### 1. Requisitos previos

- Node.js 18 o superior
- Cuenta de Spotify y acceso a [Spotify for Developers](https://developer.spotify.com/dashboard)
- Cuenta en [Vercel](https://vercel.com) si quieres desplegar el proyecto

---

### 2. Configurar la app de Spotify

1. Entra en el [Dashboard de Spotify for Developers](https://developer.spotify.com/dashboard).
2. Crea una nueva aplicación.
3. Copia el **Client ID** y el **Client Secret**.
4. En **Redirect URIs**, añade la URL:

   - En desarrollo local:
     - `http://localhost:3000/api/auth/callback/spotify`
   - En producción (Vercel):
     - `https://TU_DOMINIO/api/auth/callback/spotify`

5. Guarda los cambios.

Scopes utilizados:

```text
user-read-private,user-read-email,user-read-recently-played,user-top-read
```

---

### 3. Variables de entorno

En la raíz del proyecto encontrarás un fichero `.env.local` de ejemplo (solo comentarios y claves vacías).

Rellena los valores:

```bash
SPOTIFY_CLIENT_ID=TU_CLIENT_ID_DE_SPOTIFY
SPOTIFY_CLIENT_SECRET=TU_CLIENT_SECRET_DE_SPOTIFY
NEXTAUTH_SECRET=UNA_CLAVE_SECRETA_LARGA
NEXTAUTH_URL=http://localhost:3000
```

- Para generar `NEXTAUTH_SECRET` puedes usar:

  ```bash
  npx auth secret
  ```

- En producción (Vercel), `NEXTAUTH_URL` debe ser la URL del despliegue, por ejemplo:

  ```bash
  NEXTAUTH_URL=https://sonartrack.vercel.app
  ```

> **Importante**: `.env.local` ya está ignorado en `.gitignore`. No lo subas nunca a repositorios públicos.

---

### 4. Instalación y ejecución local

Instala las dependencias:

```bash
npm install
```

Lanza el servidor de desarrollo:

```bash
npm run dev
```

Abre `http://localhost:3000` en tu navegador.

---

### 5. Autenticación con Spotify (NextAuth)

La configuración de NextAuth está en:

- `src/app/api/auth/[...nextauth]/route.ts`

Características:

- Proveedor `SpotifyProvider` con scopes:

  ```text
  user-read-private,user-read-email,user-read-recently-played,user-top-read
  ```

- Uso de variables de entorno:
  - `SPOTIFY_CLIENT_ID`
  - `SPOTIFY_CLIENT_SECRET`
  - `NEXTAUTH_SECRET`
  - `NEXTAUTH_URL`
- Lógica de **refresh de tokens** para renovar el `access_token` de Spotify.

---

### 6. Dashboard e i18n

La página principal del dashboard está en:

- `src/app/page.tsx`

Comportamiento:

- Si el usuario **no está autenticado**:
  - Pantalla de bienvenida en modo oscuro.
  - Botón de **login con Spotify**.
  - Textos en inglés y español, conmutables.

- Si el usuario **está autenticado**:
  - Saludo con nombre y foto de perfil.
  - Botón de **cerrar sesión**.
  - Secciones:
    - **Top tracks** (hasta 10)
    - **Top artists** (hasta 6)
    - **Recently played** (hasta 6)

Internacionalización sencilla:

- `src/contexts/language-context.tsx`: contexto de idioma (`en` | `es`) con persistencia en `localStorage`.
- `src/i18n/messages.ts`: diccionario de textos en ambos idiomas.
- `src/components/ui/LanguageToggle.tsx`: selector visual EN/ES en el header.

---

### 7. Rutas API de Spotify

Las rutas de la API (App Router) que consumen los datos de Spotify usando el token de la sesión son:

- `src/app/api/spotify/top-tracks/route.ts`
- `src/app/api/spotify/top-artists/route.ts`
- `src/app/api/spotify/recently-played/route.ts`

Lógica compartida:

- `src/lib/spotify.ts`: helpers para llamar a la API de Spotify (`/me/top/tracks`, `/me/top/artists`, `/me/player/recently-played`).
- `src/types/spotify.ts`: tipos TypeScript para respuestas de Spotify.

---

### 8. Estilos y Tailwind

El proyecto usa:

- **Tailwind CSS 4** con:
  - `postcss.config.mjs` usando `@tailwindcss/postcss`.
  - Estilos globales en `src/app/globals.css`.
  - Configuración básica en `tailwind.config.ts`.

La interfaz está diseñada en **modo oscuro** por defecto, con un estilo minimalista y legible.

---

### 9. Listo para Vercel

Para desplegar en Vercel:

1. Crea un nuevo proyecto en Vercel apuntando a este repositorio/carpeta.
2. En la sección **Environment Variables**, añade:

   - `SPOTIFY_CLIENT_ID`
   - `SPOTIFY_CLIENT_SECRET`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (igual al dominio de Vercel, por ejemplo `https://sonartrack.vercel.app`)

3. Despliega el proyecto.

Vercel ejecutará automáticamente:

- `npm install`
- `npm run build`
- `npm start` (para producción)

---

### 10. Cómo extender el dashboard

Algunas ideas para extender SonarTrack:

- Añadir:
  - Más rangos de tiempo (`short_term`, `long_term`) para top tracks y artistas.
  - Gráficas (ej. con una librería como `recharts` o `chart.js`).
  - Filtros por periodo o por tipo de contenido.
- Crear nuevas rutas API en `src/app/api/spotify/...` y consumirlas desde `src/app/page.tsx`.
- Personalizar todavía más el diseño con nuevos componentes en `src/components`.

Toda la lógica de autenticación y consumo de la API de Spotify ya está preparada, por lo que puedes centrarte en la visualización y nuevas funcionalidades.

