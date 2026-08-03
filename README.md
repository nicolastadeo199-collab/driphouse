# DripHouse

Sitio web para **DripHouse**, reseller de streetwear (stock, encargos y trends). Catálogo público sin pasarela de pago (la compra se resuelve por WhatsApp/Instagram) + panel de administración privado para cargar productos sin tocar código.

## Stack

- **Next.js 16 (App Router) + TypeScript + Tailwind CSS v4**
- **Prisma + SQLite** como base de datos (un solo archivo, sin servicios externos)
- **Sesión de admin propia** con cookie firmada (JWT vía `jose`), sin librerías de auth pesadas — alcanza con un solo usuario admin
- Imágenes de producto guardadas en disco y servidas por una ruta propia (`/uploads/...`), pensado para funcionar igual en local y en un hosting con disco persistente

## Estructura de carpetas

```
prisma/
  schema.prisma        # modelos: Category, Product, ProductImage
  seed.ts               # datos de ejemplo (categorías + productos placeholder)
src/
  app/
    layout.tsx           # shell HTML + fuentes
    (site)/               # sitio público (catálogo, producto, info)
      page.tsx
      producto/[slug]/
      info/
    admin/
      login/              # login del panel
      actions.ts          # todas las acciones del admin (crear/editar/borrar)
      (protected)/         # rutas que requieren sesión (productos, categorías)
    uploads/[filename]/    # sirve las imágenes subidas desde el admin
  components/             # UI del sitio público
  components/admin/       # UI del panel (formularios, tabla, dropzone)
  lib/                    # prisma client, auth, upload, helpers
  proxy.ts                 # protege /admin y /api/admin (antes "middleware")
```

## Cómo correrlo local

1. Instalá las dependencias:
   ```bash
   npm install
   ```
2. Copiá el archivo de variables de entorno y completalo:
   ```bash
   cp .env.example .env
   ```
   Variables importantes:
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD`: usuario y contraseña para entrar a `/admin`. Podés dejar la contraseña en texto plano para arrancar, pero para producción es mejor generarla como hash bcrypt (ver más abajo).
   - `AUTH_SECRET`: cualquier texto largo y random. Generalo con `openssl rand -base64 32`.
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`: tu número real en formato internacional sin signos (ej `5491122334455`).
   - `NEXT_PUBLIC_INSTAGRAM_USER`: tu usuario de Instagram sin `@` (ya viene con `driphouse_store_`).
3. Creá la base de datos y cargá los productos de ejemplo:
   ```bash
   npx prisma migrate dev
   npm run db:seed
   ```
4. Corré el servidor:
   ```bash
   npm run dev
   ```
5. Abrí [http://localhost:3000](http://localhost:3000) para el catálogo, y [http://localhost:3000/admin](http://localhost:3000/admin) para el panel (con el usuario/contraseña que pusiste en `.env`).

## Usar el panel de administración

- **Productos** (`/admin/productos`): tabla con todos los productos, ordenable por nombre, categoría, precio, estado o fecha de carga (click en cada columna). Desde ahí editás, borrás o cargás uno nuevo.
- **Nuevo producto / Editar producto**: formulario con nombre, precio, categoría, talles (opcional, separados por coma), estado (disponible/agotado), descripción y fotos. Las fotos se cargan arrastrándolas al recuadro punteado o haciendo click para elegirlas desde la compu o el celu. En edición podés sacar fotos existentes con la ✕ y agregar nuevas.
- **Categorías** (`/admin/categorias`): son 100% editables — agregás las que necesites (Remeras, Buzos, Pantalones, Accesorios, etc.) y las que tengan productos cargados no se pueden borrar hasta mover o eliminar esos productos primero.

Todo se refleja al instante en el catálogo público, no hace falta ningún redeploy para cargar productos nuevos.

## El logo real

Mientras no subas el logo definitivo, el header y el favicon usan un logo de texto ("DripHouse") con la tipografía **Rubik Wet Paint** (efecto goteo) en verde neón, que ya reproduce la estética pedida. Cuando tengas el archivo del logo:

1. Reemplazá `src/app/favicon.ico` por tu ícono.
2. En `src/components/Logo.tsx`, cambiá el texto por un `<Image src="/logo.png" ... />` apuntando al archivo que subas a `public/`.

## Deploy

Para que las fotos subidas desde el admin y la base SQLite **persistan entre despliegues**, este proyecto necesita un hosting con disco persistente — Vercel no sirve para esto porque su filesystem es efímero (se resetea en cada request/deploy). Las opciones recomendadas, con plan gratis o muy barato:

### Opción recomendada: Railway o Render

1. Subí el repo a GitHub (ya lo tenés) y creá un proyecto nuevo en [Railway](https://railway.app) o [Render](https://render.com) apuntando a este repo.
2. Agregá un **volumen persistente** (ambos servicios lo ofrecen gratis en su plan inicial), montado por ejemplo en `/data`.
3. Configurá las variables de entorno (las mismas del `.env.example`), con dos cambios para producción:
   - `DATABASE_URL="file:/data/prod.db"` (apunta al volumen persistente)
   - `UPLOAD_DIR="/data/uploads"` (idem, para que las fotos no se pierdan)
4. Build command: `npm install && npx prisma migrate deploy && npm run build`
5. Start command: `npm run start`
6. La primera vez, corré `npm run db:seed` una vez desde la consola del servicio si querés los productos de ejemplo (podés borrarlos después desde el panel).

Con esto tenés dominio gratuito del proveedor (podés apuntar tu propio dominio después) y el sitio queda andando 24/7 por unos pocos dólares por mes (o gratis en los planes free, según cuánto tráfico tengan).

### Alternativa: Vercel + Turso/Cloudinary

Si preferís Vercel igual, hay que separar la base de datos y las imágenes de su filesystem:
- Base de datos: migrar de SQLite a [Turso](https://turso.tech) (compatible con SQLite, tiene capa gratuita).
- Imágenes: usar un bucket como Cloudinary o Vercel Blob en vez de `UPLOAD_DIR`.

Esto requiere tocar `src/lib/upload.ts` y el datasource de Prisma, así que si arrancás simple, Railway/Render es el camino más directo.

## Generar un hash de contraseña para producción (opcional pero recomendado)

En vez de guardar `ADMIN_PASSWORD` en texto plano, podés generar un hash bcrypt:

```bash
node -e "console.log(require('bcryptjs').hashSync('tu-clave-super-segura', 10))"
```

Y pegar el resultado (empieza con `$2a$` o `$2b$`) como valor de `ADMIN_PASSWORD` — el sistema detecta automáticamente si es texto plano o hash.
