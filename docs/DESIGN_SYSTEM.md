# DripHouse — Design System

Estado: v1 · Fuente de verdad para tokens visuales. Implementado en `src/app/globals.css` (`@theme inline`) — este documento describe el sistema completo; cuando se agregue un token acá, se agrega también ahí.

## 1. Color

Tokens actuales (`src/app/globals.css`) + extensiones necesarias para los nuevos componentes:

| Token | Valor | Uso |
|---|---|---|
| `--background` | `#0a0a0a` | Fondo de página |
| `--background-elevated` | `#131313` | Cards, inputs, header/footer |
| `--foreground` | `#f2f2f2` | Texto principal |
| `--muted` | `#9a9a9a` | Texto secundario, labels |
| `--border` | `#262626` | Bordes de cards/inputs |
| `--accent` | `#39ff6a` | CTA, precio, estados activos, wordmark |
| `--accent-dim` | `#1f8f3f` | Hover/estados secundarios del acento |

**Nuevos tokens requeridos por el roadmap:**

| Token | Valor propuesto | Uso |
|---|---|---|
| `--accent-ink` | `#04140a` | Texto sobre fondo `--accent` (mejor contraste que negro puro sobre verde neón) |
| `--danger` | `#ff5470` | Agotado, error de formulario, stock cero |
| `--warning` | `#ffb020` | "Últimas unidades", encargo/lead time |
| `--info` | `#39c2ff` | "Nuevo" (deliberadamente distinto del acento para no competir con los CTA) |

Regla: el **acento verde neón se reserva para interactividad y precio** — nunca se usa como color de estado semántico (nuevo/agotado/etc). Por eso los estados usan su propia paleta (`--danger`, `--warning`, `--info`), evitando que "todo sea verde" y pierda jerarquía.

Contraste verificado para WCAG AA (texto normal, mínimo 4.5:1):
- `--foreground` sobre `--background`: ✅ ~18:1
- `--muted` sobre `--background`: ⚠️ revisar — `#9a9a9a` sobre `#0a0a0a` da ~7.6:1 (ok para texto normal, ok para AA)
- `--accent-ink` sobre `--accent`: ✅ diseñado para >8:1 (reemplaza el negro puro actual sobre verde en botones)

## 2. Tipografía

- **Display/branding** (`--font-graffiti`): Rubik Wet Paint. Uso exclusivo: wordmark del logo y `<h1>` de página. Nunca en tamaños menores a 28px (ilegible por debajo).
- **Cuerpo/UI** (`--font-sans`): Inter. Todo el resto: nav, botones, precios, descripciones, formularios del admin.

**Escala tipográfica** (8 pasos, `rem` sobre base 16px):

| Paso | Tamaño | Uso |
|---|---|---|
| xs | 0.75rem (12px) | Badges, labels uppercase, captions |
| sm | 0.8125rem (13px) | Texto secundario, meta info |
| base | 0.875rem (14px) | Cuerpo por defecto (UI densa) |
| md | 1rem (16px) | Cuerpo destacado, inputs |
| lg | 1.125rem (18px) | Subtítulos, nombre de producto en PDP |
| xl | 1.5rem (24px) | Precio en PDP, H2 |
| 2xl | clamp(1.75rem, 4vw, 2rem) | H1 de sección (sans, ej. admin) |
| display | clamp(2.125rem, 6vw, 2.875rem) | H1 graffiti (Catálogo, Info, logo grande) |

Pesos: 400 (texto), 500 (labels/nav), 600 (botones/precio), 700 (nombres de producto, headings sans).

## 3. Espaciado y grid

Escala base 4px (Tailwind default, se mantiene): `1 2 3 4 5 6 8 10 12 16 20 24 32`.

- **Contenedor máximo:** 1120px (`max-w-6xl` actual), padding lateral 20px mobile / 20px desktop (el contenido respira igual, el grid crece).
- **Grid de catálogo:** 2 columnas mobile (`<640px`), 3 columnas tablet (`640-960px`), 4 columnas desktop (`>960px`). Gap 16px fijo en todos los breakpoints (consistencia > densidad).
- **Breakpoints:** `sm` 640px, `md` 768px, `lg` 960px, `xl` 1120px (alineado a Tailwind v4 defaults, sin breakpoints custom salvo que un componente lo justifique).

## 4. Iconografía

Lineal, `stroke`/`fill` heredando `currentColor` (nunca color hardcodeado dentro del SVG), tamaño base 20-24px en UI, 18px en botones inline. Un solo peso de línea en todo el set — no mezclar íconos outline con íconos filled.

## 5. Elevación y sombras

Sin sombras tradicionales tipo "drop shadow gris" (no encaja con fondo oscuro). En su lugar:
- **Elevación = cambio de superficie**, no de sombra: `--background` → `--background-elevated` indica "esto es una card/panel".
- **Glow de acento** (`text-glow`, ya implementado) reemplaza la sombra en elementos que necesitan destacar (H1, botón flotante WhatsApp): `text-shadow`/`box-shadow` con `rgba(57,255,106, .5-.6)`, nunca gris.
- **Borde en hover** (`border-color: var(--border) → var(--accent)`) es el feedback de interactividad por defecto en cards, no una sombra.

## 6. Border radius

| Token | Valor | Uso |
|---|---|---|
| `sm` | 6px | Inputs, chips pequeños, botones |
| `md` | 8px | Botones grandes, badges |
| `lg` | 10px | Cards de producto, paneles |
| `full` | 999px | Chips de categoría/talle, botón flotante WhatsApp |

## 7. Componentes: estados

Todo componente interactivo define explícitamente: `default`, `hover`, `focus-visible`, `active/selected`, `disabled`. Mínimo no negociable (WCAG AA): **`focus-visible` con outline de 2px en `--accent`, offset 2px** — ya definido globalmente en `globals.css`, cada componente nuevo debe heredarlo, nunca `outline: none` sin reemplazo.

## 8. Animación y microinteracciones

- **Duración:** 150-250ms para hover/estado (`transition-colors`, `transition-transform`), nunca más de 300ms salvo transición de página completa.
- **Easing:** `ease` por defecto; `ease-out` en elementos que entran (modales, dropdown de autosugerencia).
- **Qué SÍ anima:** color de borde en hover, escala sutil (1.02-1.06) en botones/CTA flotante, aparición de dropdown/modal (opacity + translateY 4px).
- **Qué NO anima:** el grid de productos al filtrar (reflow instantáneo, no reordenar con animación — en catálogos de 20-100 ítems la animación de reflow agrega lag percibido sin beneficio), fondos, scroll.
- **`prefers-reduced-motion: reduce`:** todas las transiciones se anulan (`transition: none`) — no negociable.

## 9. Responsive

Mobile-first estricto: cada componente se diseña primero para 375-390px de ancho (el tráfico real de Instagram) y se expande con `min-width`, nunca al revés. CTA de contacto en PDP: **sticky bottom bar solo en mobile** (`<768px`); en desktop vive inline donde está hoy.

## 10. Accesibilidad (criterio de aceptación, no checklist opcional)

- Contraste AA en todo texto (ver tabla de color).
- Todo elemento clickeable es un `<button>` o `<a>` real (ya es el patrón actual — mantener, nunca `<div onClick>`).
- Imágenes de producto: `alt` descriptivo real (nombre de producto + categoría), nunca `alt=""` salvo decorativas.
- Modales (guía de talles) atrapan el foco y cierran con `Escape`.
- Formularios del admin: todo `<input>` con `<label>` asociado (ya es el patrón actual).
