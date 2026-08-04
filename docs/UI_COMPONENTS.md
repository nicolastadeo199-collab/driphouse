# DripHouse — UI Components Specification

Estado: v1 · Fuente de verdad de propósito/variantes/estados por componente. "Existe" = ya implementado en `src/components/`; "Nuevo" = a construir según `ROADMAP.md`.

Regla de fondo (de `IMPLEMENTATION_RULES.md`): antes de crear un componente nuevo, verificar si ya hay uno reutilizable. Este documento es el índice para esa verificación.

## Header — Existe, a extender

**Propósito:** navegación primaria + acceso inmediato a búsqueda y contacto.
**Archivo:** `src/components/Header.tsx` + `MobileNav.tsx`.
**Variantes:** desktop (nav horizontal), mobile (hamburguesa + panel).
**Estados:** link activo (`text-accent`), hover.
**Cambios del roadmap:** incorporar `SearchAutosuggest` (nuevo, ver abajo) entre logo y nav en desktop; en mobile, ícono de lupa que expande el mismo componente.

### Sobre "Mega Menu" (pedido en el brief)

**No se especifica un Mega Menu.** Un mega menú se justifica con catálogos de decenas de subcategorías (moda de gran superficie tipo Zara/Uniqlo). DripHouse tiene 4-6 categorías planas. Un mega menú ahí agrega complejidad de mantenimiento (el admin tendría que gestionar jerarquías) y un click extra sin beneficio de UX medible. La nav plana actual + chips de filtro en el catálogo ya cubre el caso de uso. **Revisar esta decisión si el catálogo supera ~10 categorías o aparecen subcategorías reales** (ej. Remeras → Oversize/Fit).

## SearchAutosuggest — Nuevo

**Propósito:** encontrar un producto o categoría sin salir de la página, con feedback instantáneo.
**Ubicación:** Header (desktop inline, mobile como overlay).
**Comportamiento:** input con debounce ~200ms sobre el dataset de productos ya cargado client-side (ver `FRONTEND_ARCHITECTURE.md` — no requiere endpoint nuevo, el catálogo es chico). Dropdown con hasta 5 productos (foto + nombre + precio) y hasta 3 categorías coincidentes. Enter o click en "Buscar" navega al catálogo filtrado (comportamiento actual, se mantiene como fallback sin JS).
**Estados:** vacío (placeholder), escribiendo (skeleton de 2-3 filas), con resultados, sin resultados ("No encontramos nada con «x»" + sugerencia de ver el catálogo completo).
**Accesibilidad:** `role="combobox"` + navegación por flechas/Enter/Escape.

## Product Card — Existe, a extender

**Archivo:** `src/components/ProductCard.tsx`.
**Estados actuales:** default, hover (escala de imagen + borde), agotado (badge + imagen atenuada).
**Cambios del roadmap:**
- Segunda imagen en hover (desktop) / swipe horizontal (mobile, solo si hay ≥2 fotos).
- Badges nuevos (ver `Badge` abajo): "Nuevo" (producto creado hace ≤14 días), "Últimas unidades" (stock total por talle ≤3), "Encargo" (`availability = ORDER`). Un producto muestra **como máximo un badge** (prioridad: Últimas unidades > Nuevo > Encargo) para no saturar la card.

## Badge — Nuevo

**Propósito:** comunicar estado de stock/novedad de un vistazo, sin abrir el producto.
**Variantes:** `nuevo` (`--info`), `ultimas-unidades` (`--warning`), `encargo` (`--warning`, ícono de reloj), `agotado` (`--muted` sobre fondo oscuro, ya existe como caso especial en Product Card).
**Regla:** color semántico, nunca `--accent` (ver Design System §1).

## Product Grid + Filtros — Existe (server-rendered), a rearquitecturar

**Archivos actuales:** `src/app/(site)/page.tsx`, `CatalogFilters.tsx`.
**Cambio de fondo:** de filtro server-side por reload (`<form method=get>`) a **filtro instantáneo client-side** sobre el dataset ya traído (categoría + talle + rango de precio), con contador de resultados en vivo. El fetch inicial a Prisma se mantiene server-side (SSR del primer render, bueno para SEO); el filtrado interactivo posterior es client-side — no hay ida y vuelta al server por cada click de filtro.
**Nuevos controles:** chip de talle (multi-select), slider/inputs de rango de precio, select de orden (novedad/precio asc/precio desc).
**Estado vacío:** ya existe ("No encontramos productos con esos filtros"), se mantiene.

## Skeleton Loader — Nuevo

**Propósito:** placeholder durante el filtrado/búsqueda client-side (que ahora no recarga la página, así que necesita su propio feedback de "cargando").
**Variantes:** `card-skeleton` (grid), `row-skeleton` (autosugerencia).
**Regla:** nunca más de 400ms visible en catálogos de este tamaño (dataset ya en memoria) — si tarda más, es un bug, no un caso normal a diseñar.

## Product Gallery — Existe, a extender

**Archivo:** `src/components/ProductGallery.tsx`.
**Actual:** imagen principal + thumbnails clickeables.
**Cambios:** zoom on click/tap (lightbox simple, no librería pesada — `<dialog>` nativo con la imagen a mayor resolución), swipe entre fotos en mobile.

## Size Selector — Nuevo

**Propósito:** elegir talle en PDP mostrando stock real, no solo la lista de talles.
**Estados por talle:** disponible (normal, seleccionable), últimas unidades (borde `--warning`), sin stock (texto tachado + `--muted`, **nunca oculto** — ver brief: ocultar un talle agotado hace parecer que el producto tiene menos variantes de las que realmente maneja la marca, y rompe la comparación entre productos).
**Interacción:** al seleccionar un talle, el mensaje de WhatsApp pre-armado lo incluye (`ContactButtons` recibe el talle seleccionado como prop opcional).

## Size Guide Modal — Nuevo

**Propósito:** sacar la duda de talle sin necesitar preguntar por chat.
**Contenido:** tabla de medidas reales por talle (largo, ancho pecho, etc. — **dato a cargar por el administrador**, varía por tipo de prenda; no se puede inferir, así que el modelo de datos debe permitirlo por producto o por categoría como fallback).
**Patrón:** `<dialog>` nativo, atrapa foco, cierra con `Escape`/click afuera/botón X.

## Stock/Disponibilidad Indicator — Nuevo

**Propósito:** decir la verdad sobre cuándo llega el producto, antes de que el cliente pregunte.
**Variantes:** "Stock inmediato" (`--accent`, es la mejor noticia posible, se gana el uso del verde acá) / "A pedido · llega en {min}-{max} días" (`--warning`).
**Ubicación:** PDP (debajo del precio, alta jerarquía) y como `Badge` en Product Card.

## Sticky Contact Bar (mobile) — Nuevo

**Propósito:** que el CTA de contacto esté siempre a un pulgar de distancia en PDP, sin tener que scrollear de vuelta arriba.
**Comportamiento:** en `<768px`, `ContactButtons` se fija al fondo del viewport tras hacer scroll más allá del primer CTA inline (evita el botón duplicado visible al mismo tiempo). En desktop no cambia (inline, como hoy).

## Combina Con / Relacionados — Existe

**Archivo:** ya implementado en `src/app/(site)/producto/[slug]/page.tsx` ("También te puede interesar", productos de la misma categoría). Cumple el pedido del brief — no requiere trabajo nuevo, solo eventualmente mejorar el criterio de selección (hoy es "misma categoría, más reciente"; podría subir a "misma categoría + mismo rango de precio" cuando haya más catálogo).

## Contact Buttons (WhatsApp/Instagram) — Existe, ajuste de peso visual

**Archivo:** `src/components/ContactButtons.tsx`.
**Cambio del roadmap:** el brief pide "mismo peso visual, verde neón ambos". Se evalúa en `ROADMAP.md` — jerarquía actual (WhatsApp sólido, Instagram outline) es una decisión de conversión deliberada (WhatsApp es el canal de cierre real, Instagram es secundario) y no un descuido. Se documenta la tensión y se deja a decisión del negocio, no se cambia por default.

## Formularios de Admin (ProductForm, ImageDropzone) — Existe, a extender

**Archivos:** `src/components/admin/ProductForm.tsx`, `ImageDropzone.tsx`.
**Cambios del roadmap:** campo `marca` (texto), selector `disponibilidad` (stock inmediato / a pedido + input de días estimados condicional), tabla de talles con stock individual (reemplaza el input de texto libre "S, M, L, XL" actual) — ver `FRONTEND_ARCHITECTURE.md` para el cambio de modelo de datos que esto requiere.

## Toasts / Mensajes de confirmación — Existe (patrón simple), no se sobre-ingenieriza

**Actual:** confirmación vía query param (`?creado=slug`) renderizada como banner inline en la tabla de admin. Cumple el caso de uso (una sola persona administrando, sin necesidad de notificaciones flotantes). **No se reemplaza por un sistema de toasts** salvo que el admin reporte que no lo nota — es una mejora sin justificación de UX clara para este volumen de uso (regla de `IMPLEMENTATION_RULES.md`: no cambiar algo que funciona solo porque hay un patrón "más común").

## Reviews — Fuera de alcance v1

Pedido en el brief como componente mínimo, pero DripHouse no tiene hoy ningún mecanismo de recolección de reviews reales. Specear el componente sin la fuente de datos generaría presión para poblarlo con contenido falso, lo cual viola los valores de marca (`BRAND_GUIDELINES.md` §7, Originalidad/Transparencia). Se retoma cuando exista un proceso real de recolección (ej. pedir reseña por WhatsApp post-venta).
