# DripHouse — Implementation Rules

Estado: v1 · Reglas obligatorias para cualquier cambio de código en el proyecto (humano o Claude Code).

## 1. Antes de crear algo nuevo

1. Buscar en `src/components/ui/` un primitivo que ya resuelva el caso (Button, Badge, Chip, Modal, Skeleton).
2. Buscar en `src/lib/` un helper que ya resuelva la lógica (formato de precio, slugs, whatsapp link, etc.).
3. Si no existe, evaluar si el caso de uso es realmente distinto o es una variante — una variante se agrega como prop al primitivo existente, no como componente nuevo.
4. Recién ahí, crear.

## 2. Nunca duplicar

- Lógica de negocio (cálculo de badge, formato de precio, armado de link de WhatsApp) vive **una sola vez** en `src/lib/`, se importa donde haga falta.
- Estilos: si dos componentes comparten más de 3 clases Tailwind idénticas con función idéntica (ej. "botón CTA verde"), eso es un primitivo compartido, no una coincidencia.

## 3. Consistencia con el Design System

- Todo color nuevo sale de los tokens definidos en `DESIGN_SYSTEM.md`/`globals.css` — nunca un hex hardcodeado en un componente.
- Toda animación respeta duración (150-250ms) y easing definidos — nunca un valor inventado por componente.
- Todo texto de UI sigue el tono definido en `BRAND_GUIDELINES.md` (directo, voseo, sin relleno corporativo).

## 4. Justificación obligatoria de cada cambio

Todo cambio visual o funcional se justifica desde **al menos uno** de estos criterios, explícitamente, antes de implementarse:
- UX (reduce fricción o pasos para llegar al contacto)
- Conversión (aumenta probabilidad de click en WhatsApp/Instagram calificado)
- Accesibilidad (acerca al criterio WCAG AA)
- Rendimiento (mejora Core Web Vitals medibles)
- Arquitectura (reduce duplicación, mejora mantenibilidad)

"Se ve distinto" o "es más moderno" **no son justificación válida por sí solas**. Si un cambio no puede justificarse con al menos uno de los criterios de arriba, no se implementa — se documenta como descartado y por qué (ver ejemplos ya aplicados: Mega Menu en `UI_COMPONENTS.md`, Reviews fuera de alcance).

## 5. Consistencia absoluta entre pantallas

- Un mismo tipo de dato se presenta igual en todos lados: precio siempre `formatPrice()`, talle siempre el mismo componente `SizePill`/`SizeSelector` según contexto (display vs. interactivo), badges siempre el mismo componente `Badge`.
- Si el catálogo dice "Agotado" en algún lugar, la PDP no puede decir "Sin stock" para el mismo estado — un solo término por estado, definido en `BRAND_GUIDELINES.md` §6.

## 6. Migraciones de datos

- Todo cambio de schema de Prisma que afecte datos existentes (ej. `sizes` string → `ProductVariant[]`) incluye un script de migración de datos, no solo de schema — nunca se asume que el admin va a recargar todo el catálogo a mano.
- Los cambios de schema son no-destructivos por default (`nullable`/`@default`) salvo que se confirme explícitamente con el negocio que un campo viejo se puede perder.

## 7. Validación incremental

Cada fase del `ROADMAP.md` se implementa, se prueba en el navegador (no solo `npm run build`/lint — interacción real, según la skill de verificación de UI), y se valida contra estos documentos **antes** de pasar a la fase siguiente. No se acumulan fases sin validar.

## 8. Performance/accesibilidad como gate, no como pulido final

Un componente nuevo no se da por terminado si:
- No tiene estado de foco visible.
- Rompe el contraste AA definido en `DESIGN_SYSTEM.md`.
- Agrega una imagen sin lazy loading (si aplica) o sin `alt` real.
- Introduce una animación que no respeta `prefers-reduced-motion`.

## 9. Alcance del modelo de negocio

- Nunca implementar carrito, checkout, pasarela de pago o "agregar al carrito" — el modelo de negocio de DripHouse es catálogo + contacto directo. Cualquier pedido futuro en esa dirección requiere confirmación explícita del negocio, no se asume por benchmark de otras marcas.
- Cualquier práctica de benchmark (Halara, Nike, etc.) que dependa de un flujo de pago propio se traduce al equivalente de "contacto calificado" (ver `PRD.md` §1) antes de implementarse — nunca se copia literal.
