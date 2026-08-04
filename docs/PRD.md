# DripHouse — Product Requirements Document (PRD)

Estado: v1 · Fuente de verdad para prioridades de producto.

## 1. Visión

DripHouse es el reseller de streetwear #1 US-AR (@driphouse_store_): stock, encargos y trends, artículos 100% originales. El objetivo del producto digital no es vender online (no hay carrito ni checkout) — es **acelerar y calificar el contacto por WhatsApp/Instagram**, de la misma forma en que un ecommerce tradicional acelera el checkout. El "conversion funnel" de DripHouse termina en un mensaje de WhatsApp con toda la información que la marca necesita para cerrar la venta manualmente (producto, talle, variante), no en un pago.

Analogía rectora: **el catálogo es la vidriera y el vendedor a la vez.** Tiene que hacer en la pantalla el trabajo que haría un buen vendedor en el local — mostrar stock real, talles disponibles, tiempos de encargo honestos — para que cuando el cliente escribe, ya esté listo para comprar y no dude ni pregunte lo obvio.

## 2. Objetivos de negocio

1. Maximizar la tasa de "click en WhatsApp/Instagram" por sesión (proxy de conversión, medible sin backend de pagos).
2. Reducir fricción y preguntas repetidas en el chat (talle, stock, tiempos de entrega) resolviéndolas en la página antes del contacto.
3. Sostener percepción de marca premium/original — el sitio debe verse tan cuidado como el producto que vende, no como un catálogo genérico.
4. Escalar de 20-100 productos actuales sin fricción operativa para quien carga el catálogo (dueño de la marca, sin conocimientos técnicos).
5. Indexar en Google por nombre de producto/marca para tráfico orgánico complementario al de Instagram.

## 3. Público objetivo

- **Primario:** compradores de streetwear 16-30 años, Argentina, que llegan desde Instagram (@driphouse_store_) vía stories/posts/bio link. Mayormente mobile, conexión variable (WiFi/4G).
- **Secundario:** clientes recurrentes que vuelven directo al sitio (guardado, WhatsApp) a buscar drops nuevos.
- **Operador interno:** una persona no técnica (el dueño/administrador de DripHouse) que carga productos, fotos y gestiona stock desde `/admin`.

## 4. Posicionamiento

"El reseller de streetwear más confiable de Argentina, con la info clara antes de escribir." Se diferencia de un perfil de Instagram genérico por: catálogo navegable y filtrable, información de stock/talle explícita, y una identidad visual (negro + verde neón + graffiti) que no se ve en ningún otro reseller local.

## 5. Customer journey

1. **Descubrimiento** — Instagram (post/story/bio) → landing en producto o catálogo.
2. **Exploración** — filtra por categoría/talle/precio, compara 2-3 productos, entra al detalle.
3. **Resolución de dudas** — talle disponible, stock inmediato vs. encargo, tiempo de entrega, cómo se paga/retira (Info).
4. **Contacto calificado** — WhatsApp con mensaje prellenado (producto + talle si aplica) o Instagram DM.
5. **Cierre** — fuera del sitio, por chat directo con la marca.
6. **Retorno** — el sitio queda como catálogo de referencia para volver a mirar drops nuevos.

La página de producto es el punto de mayor fricción/mayor payoff: cada dato que falta ahí (talle real, stock, tiempo de encargo) es una pregunta más en el chat y una chance más de que el usuario abandone antes de escribir.

## 6. Arquitectura de información

Barra de beneficios + Header (sticky, ambos) en todas las páginas del sitio público.

```
Barra de beneficios (envíos, originalidad, horarios)
Header: Logo · Buscador · Home · Catálogo · Categorías (mega menu) · Info · WhatsApp
├─ Home (/)                         → hero de marca + categorías destacadas + tendencias/
│                                      curaduría + Club DripHouse + destacados (sin filtros,
│                                      es portada — el catálogo completo vive en /catalogo)
├─ Catálogo (/catalogo)             → mega menú, buscador, sidebar de filtros
│                                      (categoría/color/talle/precio), grid + orden
│   └─ Producto (/producto/[slug])  → galería + info + contacto + relacionados
├─ Info (/info)                     → horarios, envío/retiro, contacto
└─ Admin (/admin, protegido)
    ├─ Productos (alta/edición/baja, stock por talle, marca, disponibilidad)
    └─ Categorías (alta/baja)
Footer: marca, navegación (Catálogo/Categorías/Info), contacto, horarios
```

**Nota de cambio (v2):** la v1 de este documento tenía el catálogo completo viviendo en `/`. Se separó en una Home de marca (`/`) + Catálogo (`/catalogo`) siguiendo la jerarquía de información de Halara (barra de beneficios → hero → categorías → curaduría → comunidad → catálogo), adaptada al modelo sin carrito/checkout de DripHouse — sin copiar mecánicas de cupón/descuento que no aplican al negocio.

## 7. Requisitos funcionales (resumen — detalle en UI_COMPONENTS.md)

Ver `ROADMAP.md` para priorización. Lista completa de requisitos funcionales nuevos:

- Buscador con autosugerencia instantánea (producto + categoría), sin recarga.
- Filtros instantáneos: categoría, talle, precio (rango). Contador de resultados en vivo.
- Grid 2 col mobile / 3-4 col desktop, segunda foto al hover/swipe.
- Badges de estado: Nuevo, Últimas unidades, Encargo.
- Orden: novedad, precio.
- PDP: galería con zoom, selector de talle con stock real por talle, guía de talles en modal, indicador de stock inmediato vs. a pedido con tiempo estimado, botones de contacto con mismo peso visual y sticky en mobile, relacionados ("También te puede interesar" — ya existe).
- Info de envío/retiro/tiempos visible en Info **y** contextualmente en la PDP de productos a pedido.
- Admin: campo marca, disponibilidad (stock inmediato / a pedido + días estimados), stock individual por talle.

## 8. Requisitos no funcionales

- **Rendimiento:** Core Web Vitals como criterio de aceptación (LCP < 2.5s, CLS < 0.1, INP < 200ms) en conexión 4G simulada.
- **Accesibilidad:** WCAG AA — contraste mínimo 4.5:1 en texto, foco visible en todo elemento interactivo, navegación completa por teclado, alt text real en imágenes de producto.
- **SEO:** URLs limpias ya implementadas (`/producto/slug`); falta metadata Open Graph completa y JSON-LD `Product` por página de producto.
- **Escalabilidad de catálogo:** el modelo de datos y los filtros deben seguir funcionando bien hasta ~300-500 productos sin rediseño (más que suficiente para el horizonte de negocio actual).
- **Operable sin developer:** cualquier cambio de catálogo (producto, stock, precio, foto) se hace 100% desde `/admin`, cero deploys.

## 9. Objetivos de conversión (proxies medibles sin backend de analytics propio)

- Click-through a WhatsApp/Instagram por sesión de producto.
- Tasa de abandono en PDP sin llegar a hacer click en un botón de contacto (indicador indirecto de que falta información en la página).
- Búsquedas sin resultados (`q` sin productos) — señal de demanda no cubierta por el catálogo actual.

## 10. Estrategia de crecimiento (fuera de alcance inmediato, dirección futura)

- Newsletter/lista de espera por WhatsApp para avisos de drop (ya hay overlap conceptual con "Nuevo" badge).
- Reviews/testimonios (mencionado en el pedido de componentes; **no se prioriza en el roadmap inicial** — DripHouse no tiene aún mecanismo de recolección de reviews y fabricar reviews falsas está descartado por principio).
- Programa de referidos vía Instagram.

## 11. Nota sobre benchmark de referencia

Este documento fue redactado sin acceso al análisis de Halara mencionado en el brief (pertenece a una conversación previa no disponible en esta sesión). El benchmarking se hizo con principios generales de UX/conversión de ecommerce de moda (Nike, Gymshark, Alo Yoga, Zara, Uniqlo) adaptados al modelo sin-checkout de DripHouse. Si se comparte el análisis de Halara, este PRD se debe revisar contra esos hallazgos puntuales.
