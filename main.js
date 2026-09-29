/* =============================================================
   Cereal Food S.A. — main.js (IIFE vanilla, sin dependencias)
   ============================================================= */
(function () {
  "use strict";

  const $  = (s, sc) => (sc || document).querySelector(s);
  const $$ = (s, sc) => Array.from((sc || document).querySelectorAll(s));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fineHover = matchMedia("(hover: hover) and (pointer: fine)").matches;
  function safe(fn, name) { try { fn(); } catch (e) { console.warn("[" + name + "]", e); } }

  /* ---- Año dinámico ---- */
  function initYear() {
    $$("[data-year]").forEach(el => { el.textContent = new Date().getFullYear(); });
  }

  /* ---- Header solidifica al scrollear ---- */
  function initHeader() {
    const header = $(".site-header");
    if (!header) return;
    const onScroll = () => header.classList.toggle("is-stuck", window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- Nav móvil ---- */
  function initNav() {
    const nav = $(".nav");
    const toggle = $(".nav__toggle");
    if (!nav || !toggle) return;
    toggle.addEventListener("click", () => nav.classList.toggle("is-open"));
    $$(".nav__links a, .nav__side a").forEach(a =>
      a.addEventListener("click", () => nav.classList.remove("is-open"))
    );
  }

  /* ---- Smooth scroll anchors ---- */
  function initSmoothScroll() {
    document.addEventListener("click", e => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 80,
        behavior: reduced ? "auto" : "smooth",
      });
    });
  }

  /* ---- Reveal on scroll ---- */
  function initReveals() {
    const els = $$(".reveal");
    if (!els.length) return;
    // stagger index para hijos de .stagger
    $$(".stagger").forEach(g => {
      Array.from(g.children).forEach((c, i) => c.style.setProperty("--i", i));
    });
    if (!("IntersectionObserver" in window)) {
      els.forEach(el => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.04, rootMargin: "0px 0px -4% 0px" });
    els.forEach(el => io.observe(el));
    // safety: revela lo que siga oculto y ya esté en viewport
    setTimeout(() => {
      $$(".reveal:not(.is-visible)").forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-visible");
      });
    }, 6000);
  }

  /* ---- Contadores ---- */
  function initCounters() {
    const nums = $$("[data-count]");
    if (!nums.length || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target; io.unobserve(el);
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || "";
        const prefix = el.dataset.prefix || "";
        if (reduced) { el.textContent = prefix + target + suffix; return; }
        const dur = 1400; const t0 = performance.now();
        const tick = (now) => {
          const p = Math.min((now - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = prefix + Math.round(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });
    nums.forEach(n => io.observe(n));
  }

  /* ---- Tilt 3D en cards ---- */
  function initTilt() {
    if (!fineHover) return;
    $$("[data-tilt]").forEach(card => {
      const onMove = (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(800px) rotateX(${(-py * 5).toFixed(2)}deg) rotateY(${(px * 5).toFixed(2)}deg) translateY(-4px)`;
      };
      const reset = () => { card.style.transform = ""; };
      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", reset);
    });
  }

  /* ---- FAQ accordion ---- */
  function initFaq() {
    $$(".faq__item").forEach(item => {
      const q = $(".faq__q", item);
      const a = $(".faq__a", item);
      if (!q || !a) return;
      q.setAttribute("aria-expanded", "false");
      q.addEventListener("click", () => {
        const open = item.classList.toggle("is-open");
        q.setAttribute("aria-expanded", open ? "true" : "false");
        a.style.maxHeight = open ? a.scrollHeight + "px" : "0px";
      });
    });
  }

  /* ---- Etapas del proceso: desplegar detalle + imagen ---- */
  function initStages() {
    $$(".stage__toggle").forEach(btn => {
      const stage = btn.closest(".stage");
      if (!stage) return;
      btn.setAttribute("aria-expanded", "false");
      btn.addEventListener("click", () => {
        const open = stage.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
        const label = $(".stage__toggle-label", btn);
        if (label) label.textContent = open ? "Ver menos" : "Ver más";
      });
    });
  }

  /* ---- Flip cards (touch: tocar para dar vuelta) ---- */
  function initFlipcards() {
    const cards = $$(".flipcard");
    if (!cards.length) return;
    const touch = matchMedia("(hover: none)").matches;
    cards.forEach(card => {
      card.addEventListener("click", () => {
        if (touch) card.classList.toggle("is-flipped");
      });
    });
  }

  /* ---- Captura UTM / gclid en campos ocultos ---- */
  function initTracking() {
    const params = new URLSearchParams(location.search);
    const map = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid"];
    map.forEach(k => {
      const v = params.get(k);
      if (!v) return;
      try { sessionStorage.setItem(k, v); } catch (_) {}
    });
    $$("form[data-demo]").forEach(form => {
      map.forEach(k => {
        let v = params.get(k);
        try { v = v || sessionStorage.getItem(k); } catch (_) {}
        if (!v) return;
        let input = form.querySelector(`input[name="${k}"]`);
        if (!input) {
          input = document.createElement("input");
          input.type = "hidden"; input.name = k;
          form.appendChild(input);
        }
        input.value = v;
      });
    });
  }

  /* ---- Hero video: toggle de sonido ---- */
  function initHeroVideo() {
    const v = $(".hero-video__bg");
    const btn = $(".hero-video__sound");
    if (!v || !btn) return;
    v.muted = true;                       // autoplay requiere muted
    const p = v.play && v.play();
    if (p && p.catch) p.catch(() => {});
    btn.addEventListener("click", () => {
      v.muted = !v.muted;
      if (!v.muted) { v.volume = 1; const r = v.play(); if (r && r.catch) r.catch(() => {}); }
      btn.classList.toggle("is-on", !v.muted);
      btn.setAttribute("aria-pressed", String(!v.muted));
      btn.setAttribute("aria-label", v.muted ? "Activar sonido" : "Silenciar");
    });
  }

  /* ---- Hero slider: fotos históricas (auto + manual) ---- */
  function initHeroSlider() {
    const root = $("[data-slider]");
    if (!root) return;
    const slides = $$(".hero-slide", root);
    if (slides.length < 2) return;
    const prev = $(".hero-slider__arrow--prev", root);
    const next = $(".hero-slider__arrow--next", root);
    const dotsWrap = $(".hero-slider__dots", root);
    const DELAY = 6000;                    // 6 s por foto
    let i = Math.max(0, slides.findIndex(s => s.classList.contains("is-active")));
    let timer = null;

    const dots = slides.map((_, idx) => {
      if (!dotsWrap) return null;
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Ver foto " + (idx + 1));
      b.addEventListener("click", () => { go(idx); restart(); });
      dotsWrap.appendChild(b);
      return b;
    });

    function go(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, idx) => s.classList.toggle("is-active", idx === i));
      dots.forEach(d => d && d.classList.remove("is-active"));
      if (dots[i]) dots[i].classList.add("is-active");
    }
    function start() { if (reduced) return; stop(); timer = setInterval(() => go(i + 1), DELAY); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function restart() { stop(); start(); }

    if (next) next.addEventListener("click", () => { go(i + 1); restart(); });
    if (prev) prev.addEventListener("click", () => { go(i - 1); restart(); });
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    document.addEventListener("visibilitychange", () => { if (document.hidden) stop(); else start(); });

    let x0 = null;
    root.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, { passive: true });
    root.addEventListener("touchend", e => {
      if (x0 == null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) { go(i + (dx < 0 ? 1 : -1)); restart(); }
      x0 = null;
    }, { passive: true });

    go(i);
    start();
  }

  /* ---- Fix Safari: repinta el hero cuando la fuente termina de cargar ----
     Safari no repinta el texto sobre la capa acelerada del <video>, así que
     el h1 queda con la fuente de sistema. Forzamos un reflow al cargar. */
  function initFontRepaint() {
    if (!document.fonts || !document.fonts.ready) return;
    document.fonts.ready.then(() => {
      document.documentElement.classList.add("fonts-ready");
      // Repinta los títulos de hero (video y texto). Safari a veces no
      // sustituye la fuente ya pintada cuando Season termina de cargar.
      $$(".hero-video h1, .lead-hero h1, .page-hero h1, .hero h1").forEach(h => {
        const prev = h.style.display;
        h.style.display = "none";
        void h.offsetHeight;          // fuerza reflow
        h.style.display = prev;
      });
    }).catch(() => {});
  }

  /* ---- Formularios demo (sin backend) + conversión Google Ads ---- */
  function initForms() {
    $$("form[data-demo]").forEach(form => {
      form.addEventListener("submit", e => {
        e.preventDefault();
        if (!form.reportValidity()) return;
        form.classList.add("is-sent");
        // Conversión Google Ads / GA4 (los IDs reales se cargan en el <head>)
        if (typeof window.gtag === "function") {
          window.gtag("event", "generate_lead", {
            form_id: form.dataset.form || "form",
            // 'send_to': 'AW-XXXXXXXXXX/XXXXXXXX'  // <- pegar etiqueta de conversión real
          });
        }
        const ok = $(".form-success", form);
        if (ok) ok.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
      });
    });
  }

  /* ---- Formularios reales vía FormSubmit (AJAX, sin recarga) ---- */
  function initAjaxForms() {
    $$("form[data-ajax]").forEach(form => {
      const btn = $("button[type='submit']", form);
      const err = $(".form-error", form);
      form.addEventListener("submit", async e => {
        e.preventDefault();
        if (!form.reportValidity()) return;
        if (err) err.style.display = "none";
        const label = btn ? btn.textContent : "";
        if (btn) { btn.disabled = true; btn.textContent = "Enviando…"; }
        try {
          const res = await fetch(form.action, {
            method: "POST",
            headers: { "Accept": "application/json" },
            body: new FormData(form)
          });
          if (!res.ok) throw new Error("HTTP " + res.status);
          form.classList.add("is-sent");
          if (typeof window.gtag === "function") {
            window.gtag("event", "generate_lead", { form_id: form.dataset.form || "form" });
          }
          const ok = $(".form-success", form);
          if (ok) ok.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
        } catch (_) {
          if (btn) { btn.disabled = false; btn.textContent = label; }
          if (err) err.style.display = "block";
          else alert("No pudimos enviar tu consulta. Probá de nuevo o escribinos a info@cerealfood.com.ar");
        }
      });
    });
  }

  /* ---- Lightbox de la galería vintage ---- */
  function initLightbox() {
    const lb = $("[data-lightbox]");
    const gallery = $("[data-vint]");
    if (!lb || !gallery) return;
    const img = $(".lightbox__img", lb);
    const open = src => { img.src = src; lb.hidden = false; document.body.style.overflow = "hidden"; };
    const close = () => { lb.hidden = true; img.removeAttribute("src"); document.body.style.overflow = ""; };
    gallery.addEventListener("click", e => {
      const btn = e.target.closest(".vint-item"); if (!btn) return;
      const im = $("img", btn); if (im) open(im.currentSrc || im.src);
    });
    lb.addEventListener("click", close);
    document.addEventListener("keydown", e => { if (e.key === "Escape" && !lb.hidden) close(); });
  }

  function boot() {
    safe(initYear, "initYear");
    safe(initHeader, "initHeader");
    safe(initNav, "initNav");
    safe(initSmoothScroll, "initSmoothScroll");
    safe(initReveals, "initReveals");
    safe(initCounters, "initCounters");
    safe(initTilt, "initTilt");
    safe(initFaq, "initFaq");
    safe(initStages, "initStages");
    safe(initFlipcards, "initFlipcards");
    safe(initTracking, "initTracking");
    safe(initForms, "initForms");
    safe(initAjaxForms, "initAjaxForms");
    safe(initHeroVideo, "initHeroVideo");
    safe(initHeroSlider, "initHeroSlider");
    safe(initLightbox, "initLightbox");
    safe(initFontRepaint, "initFontRepaint");
    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
