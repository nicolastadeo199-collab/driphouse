# DripHouse — Frontend Architecture

Estado: v1 · Diagnóstico de la arquitectura actual + plan de reorganización para soportar el roadmap.

## 1. Arquitectura actual (diagnóstico)

**Stack:** Next.js 16 (App Router, Turbopack) + TypeScript + Tailwind v4 + Prisma/SQLite. Sin librería de estado global (no hace falta: todo el estado real vive en la base de datos, la UI es mayormente server-rendered).

**Estructura:**
```
src/app/
  (site)/            → sitio público (route group, sin URL propia)
  admin/(protected)/ → panel de administración (route group protegido por proxy.ts)
  admin/actions.ts   → TODAS las mutaciones (server actions) en un solo archivo
  uploads/[filename] → route handler que sirve imágenes subidas
src/components/       → UI del sitio público
src/components/admin/ → UI del panel
src/lib/               → prisma client, auth, upload, slug, whatsapp, format
```

**Fortalezas:**
- Separación limpia entre sitio público y admin (route groups con layouts propios) — el admin no carga el header/footer público, el público no carga nada del admin.
- Mutaciones centralizadas en `admin/actions.ts` vía Server Actions — cero API REST redundante, cero estado de loading manual (React `useFormStatus`/`useActionState` ya lo resuelven).
- Auth propia minimalista (JWT + cookie httpOnly vía `jose`), sin dependencia pesada, apropiada para un solo usuario admin.
- Subida de imágenes desacoplada del filesystem estático de Next (route handler propio) — portable entre hosting con disco persistente sin cambiar código de la app.
- Design tokens ya centralizados como CSS custom properties (`globals.css` `@theme inline`) — base correcta para el Design System formal.

**Debilidades / deuda técnica relevante para el roadmap:**
1. **No hay capa de componentes primitivos compartidos.** Botones (`ContactButtons`, `ProductForm` submit, `AdminNav` logout) repiten clases Tailwind ad-hoc en vez de un `<Button variant>` único → cualquier cambio de Design System (ej. nuevo `--accent-ink`) requiere tocar N archivos.
2. **`sizes` es un string libre separado por comas** (`Product.sizes: String`) — no hay forma de trackear stock por talle ni de validar qué se cargó. Bloquea directamente el requisito "stock individual por talle" del roadmap.
3. **No existe campo `brand` ni `color` ni `availability`** en el modelo `Product` — bloquea filtros por talle/color/precio reales y el indicador stock-inmediato-vs-encargo.
4. **El filtrado de catálogo es 100% server-side por reload** (`<form method=get>` → nueva request → nuevo render). Funciona pero no soporta "filtros instantáneos con contador en vivo" sin fricción — cada click de filtro hoy es una navegación completa.
5. **`admin/actions.ts` concentra demasiado** (~230 líneas y creciendo): con los campos nuevos (marca, disponibilidad, stock por talle) conviene partirlo por dominio antes de que se vuelva inmanejable.

## 2. Cambios de arquitectura para el roadmap

### 2.1 Modelo de datos (Prisma)

```prisma
model Product {
  // ...campos actuales...
  brand         String?          // nuevo — reseller de varias marcas
  availability  String  @default("IN_STOCK") // "IN_STOCK" | "MADE_TO_ORDER"
  leadTimeMinDays Int?           // solo relevante si availability = MADE_TO_ORDER
  leadTimeMaxDays Int?
  color         String?          // nuevo, texto libre (no se sobre-ingenieria con tabla de colores por ahora)
  sizeGuideNote String?          // texto libre, fallback simple antes de tabla de medidas completa
  variants      ProductVariant[] // reemplaza el campo `sizes` de texto libre
}

model ProductVariant {
  id        String  @id @default(cuid())
  size      String                    // "S", "M", "42", etc. — sigue siendo texto libre, cada categoría tiene su propia escala
  stock     Int     @default(0)
  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@unique([productId, size])
}
```

`sizes: String` se deprecia y se migra a `ProductVariant[]` con un script de migración de datos (parsear el string existente, crear variantes con stock por defecto a definir con el negocio — probablemente "999" o un valor alto para no bloquear ventas de productos que hoy no trackean stock real por talle, hasta que el admin cargue el stock real).

`Product` sin `availability`/`brand` no rompe nada retroactivamente (`@default` + `?` nullable) — migración no destructiva.

### 2.2 Filtrado client-side

El catálogo (20-100 productos) se sigue renderizando **server-side en el primer load** (SEO, LCP rápido, funciona sin JS). El *dataset completo ya filtrado por categoría de URL* se serializa y se hidrata en un componente cliente (`CatalogExplorer`) que aplica talle/precio/orden/búsqueda **en memoria**, sin nuevas requests al server. Esto es intencional y proporcional al tamaño real del catálogo: a 500 productos con imágenes ya usando `next/image` (que no se cargan todas de una, lazy por default), sigue siendo instantáneo. **No se introduce un backend de búsqueda (Algolia/Meilisearch, etc.) — sería sobre-ingeniería para este volumen.**

### 2.3 Capa de componentes primitivos

Nueva carpeta `src/components/ui/` (primitivos compartidos, sin lógica de negocio):
```
ui/Button.tsx    → variant: primary | ghost | danger, size: sm | md
ui/Badge.tsx     → variant: nuevo | ultimas-unidades | encargo | agotado
ui/Chip.tsx       → usado hoy ad-hoc en CatalogFilters, se extrae
ui/Modal.tsx      → base para Size Guide y futuros modales (usa <dialog> nativo)
ui/Skeleton.tsx
```
`ContactButtons`, `ProductForm`, `AdminNav`, `CatalogFilters` pasan a consumir estos primitivos en vez de reimplementar clases. Regla de `IMPLEMENTATION_RULES.md`: ningún componente nuevo define su propio botón con clases Tailwind sueltas si `ui/Button` ya cubre el caso.

### 2.4 `admin/actions.ts`

Se divide por dominio cuando se agreguen las mutaciones de variantes/marca/disponibilidad:
```
admin/actions/auth.ts       (login/logout)
admin/actions/products.ts   (CRUD producto + variantes)
admin/actions/categories.ts (CRUD categoría)
```
Sin cambio de comportamiento, solo organización — mismo patrón de Server Actions.

## 3. Rendimiento

- `next/image` ya hace lazy loading por default — el pedido del brief ya está cubierto, no requiere trabajo adicional (documentarlo evita que alguien lo "reimplemente").
- Nuevo: JSON-LD `Product` (SEO) se genera server-side en la PDP, cero costo de rendimiento en cliente.
- Filtrado client-side (§2.2) evita round-trips que hoy cuestan una navegación completa por click de filtro — es una mejora de rendimiento percibido, no solo de UX.

## 4. No-duplicación (regla de arquitectura)

Antes de escribir un componente o helper nuevo: buscar en `src/components/ui/`, `src/lib/`, y este documento. Si el caso de uso ya está cubierto por un primitivo existente con una prop nueva, se extiende el primitivo — no se crea un componente paralelo.
