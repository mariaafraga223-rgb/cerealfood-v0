# Revisión de la web — Cereal Food S.A. (`web-v3`)

_Revisión técnica y de contenido · 15/09/2026_

Sitio estático (HTML/CSS/JS vanilla, sin dependencias) de 5 páginas: `index`, `fabricacion`, `cereanola`, `nosotros`, `cotizar`. Está **bien construido**: código limpio, tokens de diseño coherentes, header/footer idénticos entre páginas, buena base de accesibilidad y animaciones cuidadas con respeto a `prefers-reduced-motion`. Lo que falta es sobre todo **contenido real y configuración previa al lanzamiento**, no arreglos estructurales.

Semáforo general: 🟢 código · 🟡 contenido · 🔴 no lanzar sin resolver los bloqueantes.

---

## 🔴 Bloqueantes antes de publicar

| # | Tema | Detalle | Dónde |
|---|------|---------|-------|
| 1 | **IDs de Google sin reemplazar** | `AW-XXXXXXXXXX` y `G-XXXXXXXXXX` están como placeholder en las 5 páginas. Sin los IDs reales no hay tracking de Ads ni GA4, y la conversión `generate_lead` no dispara. | `<head>` de todas las páginas + `main.js:172` |
| 2 | **Formularios sin backend** | Los formularios son demo (`data-demo`): muestran el mensaje de éxito pero **no envían nada a ningún lado**. Un lead que complete el form hoy se pierde. Hay que conectarlos a un servicio de email/CRM (Formspree, Web3Forms, un endpoint propio, etc.). | `main.js:163` `initForms`, `cotizar.html`, `index.html` |
| 3 | **Datos de contacto falsos** | Teléfono, WhatsApp (`549XXXXXXXXXX`), dirección y mapa siguen como `[Teléfono]` / `[Dirección de la planta]`. El botón flotante de WhatsApp y los links no funcionan. | Footer y `.wa-float` de todas las páginas; `cotizar.html:158-161` |

---

## 🟡 Contenido pendiente (placeholders `[...]`)

Copy de relleno todavía visible para el usuario final:

- **Fabricación:** tiempos de cada paso (`⏱ [tiempo estimado]`), gramajes, vida útil, mínimo de producción, lead time, capacidad mensual (`[XX] unidades`).
- **Cereanola:** historia de la marca, target, descripciones e info nutricional de las 6 variantes, packshots (hoy son placeholders `📷`), y las cadenas donde se consigue.
- **Nosotros:** historia de la empresa.
- **Cotizar:** rangos de volumen (`Menos de [X] unidades`, etc.) en el desplegable.

> Recomendación: hacer una búsqueda de `[` en los HTML antes de publicar — cada corchete es contenido a completar.

---

## 🟢 SEO / metadatos (mejoras recomendadas)

Lo básico está: `<title>` y `meta description` únicos por página, `lang="es"`, alt text descriptivo. Falta lo que espera un sitio profesional:

- **Sin favicon** — ninguna página declara `<link rel="icon">`. El logo SVG ya existe inline; conviene exportarlo a favicon.
- **Sin Open Graph / Twitter Cards** — al compartir en WhatsApp/redes no habrá previsualización (imagen/título/descripción).
- **Sin `canonical`**, **sin `robots.txt`** ni **`sitemap.xml`**.
- **Sin datos estructurados** (JSON-LD `Organization` / `LocalBusiness`) — útil para búsquedas locales y el panel de Google.

---

## ♿ Accesibilidad (detalles menores)

Base sólida (skip-link, `:focus-visible`, `aria-hidden` en SVG decorativos, alt correctos). A pulir:

- **Menú móvil:** el botón `.nav__toggle` no actualiza `aria-expanded` al abrir/cerrar; un lector de pantalla no sabe si el menú está abierto. (`main.js:28` `initNav`)
- **Acordeón FAQ:** los `<button class="faq__q">` no llevan `type="button"`. Funciona, pero conviene declararlo explícitamente.

---

## 🖼️ Rendimiento e imágenes

- **17 MB solo en `assets/img`**, todo en `.jpg`. Varias superan 500 KB (`silos-fachada.jpg` = 848 KB). El `.htaccess` ya está preparado para servir **WebP/AVIF**, pero **no hay ni un solo archivo webp/avif**. Convertir las imágenes reduciría el peso ~60-70% sin pérdida visible → mejora directa de LCP y Core Web Vitals.
- **37 de 58 imágenes no se usan** en ninguna página (ver lista abajo). Son ~10 MB que se subirían al hosting sin necesidad. Conviene mover el banco de fotos no usadas fuera de la carpeta de deploy.
- No hay referencias de imagen rotas ✅ (todo lo que el HTML pide, existe).

<details>
<summary>Imágenes sin usar (37)</summary>

`packaging-caja` · `almendras-ingredientes` · `barra-detalle` · `planta-fachada` · `equipo-cereal-food` · `planta-linea-produccion` · `equipo-planta` · `barras-formado` · `mezcla-granola` · `pallets` · `deposito` · `proceso-jarabe` · `hall-envasado` · `silos-autoelevador` · `packs-terminados` · `oficina` · `hero-barras` · `logo-cereanola` · `barra-cinta-detalle` · `producto-envasado` · `equipo-grupal` · `equipo-frente-planta` · `operario-cajas` · `equipo-comedor` · `fachada-silos` · `control-calidad` · `proceso-cereal-cinta` · `inspeccion` · `cereal-colores` · `barra-linea` · `flowpack` · `almendras-textura` · `corte-barras` · `producto-barras` · `planta-ladrillo` · `hero-opt-linea` · `producto-cereanola`

</details>

---

## 🧹 Limpieza de código

- **`styles-dark.css.bak` (28 KB)** — backup de la versión oscura anterior. No se enlaza en ningún lado; borrar antes de subir.
- **CSS muerto** — hay reglas sin marcado que las use: `.trust-strip`, `.hero__badge`, `.hero__trust`, `.brands-static`, `.hero__grain` (`display:none`). No molestan, pero se pueden podar.
- **`data-marquee`** (en `nosotros.html:151`) no tiene handler en JS — la cinta funciona 100% por CSS, así que el atributo es inofensivo pero innecesario.
- **Cache-busting redundante** — `styles.css?v=20260708` / `main.js?v=20260706`: el `.htaccess` ya fuerza `no-cache` en CSS/JS, así que el `?v=` no hace falta (tampoco molesta). Nota: las dos fechas no coinciden entre sí.

---

## ✅ Lo que está muy bien

- Arquitectura CSS con tokens (`:root`) coherente y bien comentada.
- JS defensivo: cada init va envuelto en `safe()`, con fallbacks para `IntersectionObserver` y `prefers-reduced-motion`.
- Header/footer/nav consistentes y con estado `is-active` correcto por página.
- Captura de UTM/`gclid` en `sessionStorage` e inyección en formularios (`main.js:138`) — muy bien pensado para campañas de Ads.
- Responsive con breakpoints razonables y menú móvil completo.
- `.htaccess` con caché, compresión y headers de seguridad ya resuelto.

---

## Orden sugerido

1. Conectar formularios a un backend real (bloqueante #2).
2. Cargar IDs de Google reales (#1) + datos de contacto/WhatsApp (#3).
3. Completar todos los `[placeholders]` de copy y las fotos de producto de Cereanola.
4. Favicon + Open Graph (compartir se ve roto sin esto).
5. Convertir imágenes a WebP y quitar las 37 no usadas + el `.bak`.
6. Extras SEO: `robots.txt`, `sitemap.xml`, JSON-LD.
