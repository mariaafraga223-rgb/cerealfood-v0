# Cereal Food — Web · Pendientes para activar

Lista de cosas que **el cliente debe completar o confirmar** para que el sitio quede
100% funcional en producción. Ninguna es urgente para ver el diseño; son datos y
activaciones que solo el cliente puede proveer.

---

## 1. Formulario de contacto → activar FormSubmit  ⚠️ IMPRESCINDIBLE

El formulario de **Contacto** (`cotizar.html`) envía las consultas a
`info@cerealfood.com.ar` a través del servicio gratuito **FormSubmit**.

**Paso único de activación:**
1. La **primera vez** que alguien envíe el formulario, FormSubmit manda un mail de
   activación a `info@cerealfood.com.ar` (asunto tipo *"Confirm your email"*).
2. Abrir ese mail y hacer clic en **"Activate Form"**.
3. Listo: desde ese momento todas las consultas llegan a esa casilla.

> Hasta que no se haga ese clic, **los envíos NO llegan**. Es gratis y se hace una sola vez.

**Opcional (recomendado):** para no exponer el mail a robots de spam, FormSubmit da un
**alias aleatorio** (ej. `https://formsubmit.co/ajax/a1b2c3d4…`). Si lo querés usar,
pasámelo y lo reemplazo en el `action` del formulario.

- Archivo: `cotizar.html` (línea del `<form ... action="https://formsubmit.co/ajax/info@cerealfood.com.ar">`)
- Para cambiar la casilla de destino: editar ese mail en el `action`.

---

## 2. Google Ads + Google Analytics → IDs reales

Todas las páginas tienen el código de seguimiento de Google con **IDs de ejemplo**
(`AW-XXXXXXXXXX` y `G-XXXXXXXXXX`). No trackean nada hasta reemplazarlos.

**Qué hace falta del cliente:**
- ID de **Google Ads** (`AW-XXXXXXXXXX`)
- ID de **Google Analytics 4** (`G-XXXXXXXXXX`)
- (Opcional) La **etiqueta de conversión** de Google Ads para el evento del formulario.

**Dónde reemplazar:** en el `<head>` de las **5 páginas**
(`index.html`, `nosotros.html`, `fabricacion.html`, `cereanola.html`, `cotizar.html`)
y la etiqueta de conversión en `main.js` (función `initAjaxForms`, comentario `send_to`).

---

## 3. Imágenes pendientes

| Dónde | Qué falta |
|---|---|
| **Quiénes somos** (`nosotros.html`) — hero | 6 **fotos históricas** de los comienzos (hoy hay placeholders). Reemplazar cada `<div class="img-ph--slide">` por `<img src="…" alt="…">`. |
| **Nuestra marca** (`cereanola.html`) — 6 variantes | **Packshots** de cada sabor tras la sesión de fotos de producto. Reemplazar cada `<div class="variant__img img-ph">`. |

---

## 4. Catálogo descargable (PDF)

En la home (`index.html`) el botón **"Descargá el catálogo"** apunta a `#`.
Cuando exista el PDF, subirlo a `assets/` y poner su ruta en el `href`.

---

## 5. (A confirmar) "Dónde se consigue Cereanola"

Se sacó la sección de puntos de venta por falta de datos. Si el cliente confirma
**en qué cadenas/comercios se vende hoy**, se puede reponer como prueba de que la
marca está en góndola. Si no hay data concreta, mejor dejarla afuera.

---

### Datos de contacto usados en el sitio (verificar que sean correctos)
- Email: `info@cerealfood.com.ar`
- Teléfono: `+54 11 4604-1757`
- WhatsApp: `+54 9 11 2351-9570`
- Dirección: Berón de Astrada 6730, CABA
- Horario: lunes a viernes, de 8 a 17 h
