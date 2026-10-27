# Cereal Food — Web · Pendientes para el lanzamiento

Guía para quien sube el sitio a producción (hosting + dominio). El diseño y el
contenido están completos; lo que sigue son **datos y activaciones** que hay que
configurar para que todo funcione al 100%.

---

## 1. Formulario de contacto → activar FormSubmit  ⚠️ IMPRESCINDIBLE

El formulario de **Contacto** (`cotizar.html`) envía las consultas a
`info@cerealfood.com.ar` a través del servicio gratuito **FormSubmit**.

**Paso único de activación:**
1. La **primera vez** que alguien envíe el formulario, FormSubmit manda un mail de
   activación a `info@cerealfood.com.ar` (asunto tipo *"Confirm your email"*).
2. Abrir ese mail y hacer clic en **"Activate Form"**.
3. Desde ese momento todas las consultas llegan a esa casilla.

> Hasta que no se haga ese clic, **los envíos NO llegan**. Es gratis, una sola vez.

- Dónde está: `cotizar.html`, en `<form ... action="https://formsubmit.co/ajax/info@cerealfood.com.ar">`.
- Para cambiar la casilla de destino: editar ese mail en el `action`.
- (Opcional, anti-spam) FormSubmit da un **alias aleatorio** para no exponer el mail;
  se puede reemplazar en el `action`.

---

## 2. Casillas de mail dedicadas → crearlas

El sitio ya enlaza (con `mailto:`) tres direcciones. Hay que **crear los buzones**
que todavía no existan para no perder consultas:

- `info@cerealfood.com.ar` — general / formulario (ya existe).
- `equipo@cerealfood.com.ar` — CV / "Súmate al equipo" (en `nosotros.html`).
- `cereanola@cerealfood.com.ar` — venta de Cereanola (en `cereanola.html`).

---

## 3. Google Ads + Google Analytics → IDs reales

Todas las páginas tienen el código de Google con **IDs de ejemplo**
(`AW-XXXXXXXXXX` y `G-XXXXXXXXXX`). No trackean nada hasta reemplazarlos.

- Reemplazar en el `<head>` de las **5 páginas** (`index`, `nosotros`,
  `fabricacion`, `cereanola`, `cotizar`).
- (Opcional) Etiqueta de conversión de Google Ads para el evento del formulario:
  `main.js`, función `initAjaxForms` (comentario `send_to`).

---

## 4. Catálogo descargable (PDF) — opcional

En la home (`index.html`) el botón **"Descargá el catálogo"** apunta a `#`.
Cuando exista el PDF, subirlo a `assets/` y poner su ruta en el `href`.

---

### Notas de hosting
- El **`.htaccess`** incluido es para servidores **Apache** (hosting compartido tipo
  cPanel). En Nginx habría que trasladar esa configuración.
- Subir **todo el contenido del zip a la raíz del dominio** (el `index.html` va en el root).

### Datos de contacto usados en el sitio (verificar que sean correctos)
- Email: `info@cerealfood.com.ar`
- Teléfono: `+54 11 4604-1757`
- WhatsApp: `+54 9 11 2351-9570`
- Dirección: Berón de Astrada 6730, CABA
- Horario: lunes a viernes, de 8 a 17 h

---

### Ya resuelto (referencia)
- Hero de "Quiénes somos" con las fotos históricas reales + galería vintage con lightbox.
- Cereanola: 8 variantes con los packshots finales de cada envoltorio.
- Favicon adaptativo (negro en claro / blanco en oscuro).
- Formulario cableado a FormSubmit; footer con WhatsApp, teléfono y mapa.
