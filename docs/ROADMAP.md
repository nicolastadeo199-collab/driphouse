# DripHouse — Roadmap priorizado

Estado: v2 · Fases 0-5 implementadas y validadas en navegador. Prioriza impacto en UX/conversión sobre esfuerzo, pero respeta dependencias técnicas (no se puede especificar el selector de talle con stock si el modelo de datos no tiene stock por talle).

Cada fase se implementa y se valida en el navegador antes de pasar a la siguiente (`IMPLEMENTATION_RULES.md` §7). Este documento no incluye código — es la base para pedir "arrancá con la Fase 1" o similar.

---

## Fase 0 — Documentación base ✅ (esta entrega)

PRD, Brand Guidelines, Design System, UI Components Spec, Frontend Architecture, Implementation Rules. Sin cambios de código de producto.

---

## Fase 1 — Fundaciones ✅ implementado

**Por qué primero:** casi todos los requisitos funcionales del brief (filtro por talle real, badge de últimas unidades, indicador de encargo, guía de talles) dependen de datos que hoy no existen en el modelo (`brand`, `availability`, stock por talle). Sin esto, cualquier UI nueva sería cosmética sobre datos falsos.

- Extender schema de Prisma: `Product.brand`, `Product.availability`, `Product.leadTimeMinDays/MaxDays`, `Product.color`, `Product.sizeGuideNote`, nuevo modelo `ProductVariant` (talle + stock).
- Script de migración de datos: parsear el `sizes` string actual de los 8 productos de ejemplo (y de cualquier producto real ya cargado) a `ProductVariant[]`.
- Actualizar `ProductForm` del admin: input de marca, selector de disponibilidad (con campo de días condicional), tabla de talle+stock en vez del input de texto libre.
- Crear capa `src/components/ui/` (Button, Badge, Chip, Modal, Skeleton) — se necesita antes de que Fase 2 empiece a agregar badges/chips nuevos, para no duplicar.

**Impacto:** ninguno visible todavía para el comprador final (es la base de datos/admin). **Esfuerzo:** medio-alto (migración de datos + formulario admin más complejo). **Riesgo si se salta:** todo lo siguiente se construye sobre datos inventados y hay que rehacerlo.

---

## Fase 2 — Catálogo y descubrimiento ✅ implementado

**Por qué segundo:** es donde el 100% del tráfico entra (desde Instagram). Mejorar acá tiene el mayor volumen de impacto.

- Filtro instantáneo client-side: categoría + talle + rango de precio, con contador de resultados en vivo (`FRONTEND_ARCHITECTURE.md` §2.2).
- Buscador con autosugerencia (producto + categoría), debounce, sin recarga.
- Orden: novedad, precio ascendente/descendente. **"Más vendido" se excluye de esta fase** — no existe ningún dato de ventas en el sistema (no hay checkout que lo genere); implementarlo sería un orden falso. Se retoma si en el futuro se agrega un contador manual de "vendidos" cargado por el admin.
- Product Card: segunda foto en hover/swipe, badges (Nuevo/Últimas unidades/Encargo) usando los datos de Fase 1.

**Impacto:** alto (reduce fricción en el paso de mayor volumen del funnel). **Esfuerzo:** medio.

---

## Fase 3 — Página de producto (PDP) ✅ implementado

**Por qué tercero:** es donde se resuelve la decisión de contactar o no — el momento de mayor payoff por sesión, pero depende de Fase 1 (stock real) y se beneficia de Fase 2 (badges ya definidos, reutilizables acá).

- Selector de talle con estados reales (disponible/últimas unidades/sin stock, nunca oculto).
- Indicador de stock inmediato vs. a pedido + tiempo estimado.
- Guía de talles en modal (con el dato cargado en Fase 1, o nota de fallback si el admin todavía no lo cargó para ese producto).
- Zoom/lightbox simple en galería.
- CTA sticky en mobile.
- Mensaje de WhatsApp pre-armado incluye el talle seleccionado.

**Impacto:** alto (conversión directa). **Esfuerzo:** medio.

---

## Fase 4 — Confianza contextual ✅ implementado

- Componente reutilizable de info de envío/retiro/tiempos, insertado en `/info` (ya existe el contenido) y en la PDP de productos `MADE_TO_ORDER` (dato ya disponible desde Fase 1, solo falta la superficie visual).

**Impacto:** medio (reduce preguntas repetidas en el chat). **Esfuerzo:** bajo — es casi puro reuso de Fase 1 y contenido ya existente.

---

## Fase 5 — SEO, performance y accesibilidad (hardening) ✅ implementado (ver nota de medición real más abajo)

- JSON-LD `Product` por página de producto (precio, disponibilidad, marca) — impacto directo en indexación de Google y en cómo se ve el link al compartirse.
- Metadata Open Graph completa (título/imagen al compartir en WhatsApp/Instagram — actualmente básica).
- Auditoría de contraste y foco visible en todos los componentes nuevos de Fases 1-4.
- Medición real de Core Web Vitals (Lighthouse) una vez deployado, con el catálogo semi-poblado (no con 8 productos de prueba).

**Impacto:** medio-alto pero indirecto (tráfico orgánico, no fricción de conversión inmediata). **Esfuerzo:** bajo-medio. Se hace al final porque necesita que las páginas de Fases 1-4 ya estén en su forma final para auditar contra el objetivo real, no una versión intermedia.

---

## Explícitamente fuera de este roadmap

- Reviews (sin fuente de datos real — ver `UI_COMPONENTS.md`).
- Newsletter y programa de referidos (mencionados en `PRD.md` §10 como dirección futura, no priorizados).
- Cualquier variante de carrito/checkout de pago (fuera del modelo de negocio).

---

## Estado real vs. medición pendiente

Todo lo de arriba está implementado y probado en navegador (desktop y mobile) sobre datos de ejemplo. Lo que queda pendiente porque depende de tener el sitio deployado con tráfico real, no de código:

- Medición real de Core Web Vitals (Lighthouse) con el dominio productivo.
- Validación de JSON-LD/Open Graph con las herramientas de Google/Meta una vez que `NEXT_PUBLIC_SITE_URL` apunte al dominio real.
- Auditoría de contraste con el logo/fotos de producto reales (la evaluada hasta ahora es sobre placeholders).

## Próximos pasos posibles (no priorizados, a demanda)

- Stock por talle con alertas cuando se acerca a cero.
- Reviews, una vez exista un proceso real de recolección.
- Analítica de "búsquedas sin resultado" para detectar demanda no cubierta (ver `PRD.md` §9).
