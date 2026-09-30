/* =====================================================================
   Site interactions — no dependencies
   · sticky header, mobile nav
   · scroll progress bar, active section highlighting
   · reveal-on-scroll, animated stat counters (incl. decimals)
   · portfolio filtering, "How it works" slider
   · contact form validation (mail-app fallback), back-to-top, year
   ===================================================================== */
(() => {
  "use strict";

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduceMotion = typeof window.matchMedia === "function"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  /* ------------------------- 1. Sticky header ----------------------- */
  const header = $("#site-header");
  const toTop  = $("#to-top");
  const bar    = $("#progress");

  /* ---------------- 2. Mobile navigation --------------------------- */
  const nav    = $("#primary-nav");
  const toggle = $("#nav-toggle");

  function setNav(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("nav-open", open);
  }

  if (toggle) {
    toggle.addEventListener("click", () => setNav(!nav.classList.contains("is-open")));
  }
  $$(".nav a").forEach((link) => link.addEventListener("click", () => setNav(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setNav(false);
  });
  document.addEventListener("click", (e) => {
    if (!nav || !nav.classList.contains("is-open")) return;
    if (nav.contains(e.target) || (toggle && toggle.contains(e.target))) return;
    setNav(false);
  });

  /* ------------- 3. Scroll progress + sticky state ------------------ */
  let scrollQueued = false;

  function onScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;

    if (bar) bar.style.transform = `scaleX(${ratio})`;
    if (header) header.classList.toggle("is-stuck", window.scrollY > 24);
    if (toTop) toTop.classList.toggle("is-visible", window.scrollY > 520);
    scrollQueued = false;
  }

  window.addEventListener("scroll", () => {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(onScroll);
  }, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ---------------- 4. Active nav link ----------------------------- */
  /* Position-based scroll spy. Every nav item points at its real target —
     a section, or the contact panel that lives inside the services block —
     and the item whose top has passed the 30% mark of the viewport wins.
     Ties (the side-by-side services/contact panels share a top) fall to the
     later item, and at the very bottom of the page the last item takes over. */
  const navLinks = $$(".nav a");
  const navTargets = navLinks
    .map((link) => ({
      link,
      href: link.getAttribute("href"),
      el: document.getElementById((link.getAttribute("href") || "").slice(1))
    }))
    .filter((t) => t.el);

  let activeHref = null;

  function setActive(href) {
    if (href === activeHref) return;
    activeHref = href;
    navTargets.forEach(({ link, href: h }) => link.classList.toggle("is-active", h === href));
  }

  function syncActiveNav() {
    if (!navTargets.length) return;

    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll > 0 && window.scrollY >= maxScroll - 2) {
      setActive(navTargets[navTargets.length - 1].href);   // page end → Contact
      return;
    }

    const line = window.scrollY + window.innerHeight * 0.3;
    let current = navTargets[0].href;
    navTargets.forEach(({ href, el }) => {
      if (el.getBoundingClientRect().top + window.scrollY <= line) current = href;
    });
    setActive(current);
  }

  let navQueued = false;
  function requestNavSync() {
    if (navQueued) return;
    navQueued = true;
    requestAnimationFrame(() => { navQueued = false; syncActiveNav(); });
  }

  window.addEventListener("scroll", requestNavSync, { passive: true });
  window.addEventListener("resize", requestNavSync, { passive: true });
  navTargets.forEach(({ link, href }) => {
    link.addEventListener("click", () => setActive(href));   // instant feedback
  });
  syncActiveNav();

  /* ---------------- 5. Reveal on scroll ---------------------------- */
  const revealables = $$(".reveal");

  if (!("IntersectionObserver" in window) || reduceMotion) {
    revealables.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        window.setTimeout(() => el.classList.add("is-visible"), i * 70);
        obs.unobserve(el);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

    revealables.forEach((el) => io.observe(el));
  }

  /* ---------------- 6. Animated stat counters ---------------------- */
  const counters = $$("[data-count]");

  function runCounter(el) {
    const end      = Number(el.dataset.count) || 0;
    const suffix   = el.dataset.suffix || "";
    const decimals = Number(el.dataset.decimals) || 0;
    const render   = (value) => value.toFixed(decimals) + suffix;

    if (reduceMotion) { el.textContent = render(end); return; }

    const duration = 1400;
    let startTime  = 0;

    function step(now) {
      if (!startTime) startTime = now;
      const p = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);           // ease-out cubic
      el.textContent = render(end * eased);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if (counters.length) {
    if (!("IntersectionObserver" in window)) {
      counters.forEach(runCounter);
    } else {
      const cio = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          runCounter(entry.target);
          obs.unobserve(entry.target);
        });
      }, { threshold: 0.4 });
      counters.forEach((el) => {
        const decimals = Number(el.dataset.decimals) || 0;
        el.textContent = (0).toFixed(decimals) + (el.dataset.suffix || "");
        cio.observe(el);
      });
    }
  }

  /* ---------------- 7. Portfolio filtering ------------------------- */
  const filterBtns = $$(".filter");
  const cards      = $$(".project");

  function applyFilter(value) {
    cards.forEach((card, i) => {
      const show = value === "all" || card.dataset.cat === value;
      card.classList.toggle("is-out", !show);
      card.classList.remove("is-in");
      if (show && !reduceMotion) {
        void card.offsetWidth;                       // restart the animation
        card.style.animationDelay = (i % 6) * 45 + "ms";
        card.classList.add("is-in");
      }
    });
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => {
        const on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
      applyFilter(btn.dataset.filter || "all");
    });
  });

  /* ---------------- 8. "How it works" slider ----------------------- */
  const track = $("#quote-track");

  if (track) {
    const slides = $$(".quote", track);
    const dots   = $("#quote-dots");
    let index    = 0;
    let timer    = null;

    if (dots) {
      slides.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "quotes__dot" + (i === 0 ? " is-active" : "");
        dot.setAttribute("aria-label", "Go to note " + (i + 1));
        dot.addEventListener("click", () => go(i, true));
        dots.appendChild(dot);
      });
    }

    function go(next, userDriven) {
      index = (next + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      $$(".quotes__dot", dots || document).forEach((dot, i) => {
        dot.classList.toggle("is-active", i === index);
      });
      if (userDriven) restart();
    }

    function restart() {
      if (reduceMotion) return;
      window.clearInterval(timer);
      timer = window.setInterval(() => go(index + 1), 6500);
    }

    const prev = $("#quote-prev");
    const next = $("#quote-next");
    if (prev) prev.addEventListener("click", () => go(index - 1, true));
    if (next) next.addEventListener("click", () => go(index + 1, true));

    const quotes = $("#quotes");
    if (quotes) {
      quotes.addEventListener("mouseenter", () => window.clearInterval(timer));
      quotes.addEventListener("mouseleave", restart);
      quotes.addEventListener("focusin", () => window.clearInterval(timer));
    }

    // Touch swipe
    let startX = null;
    track.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener("touchend", (e) => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 45) go(index + (dx < 0 ? 1 : -1), true);
      startX = null;
    }, { passive: true });

    restart();
  }

  /* ---------------- 9. Contact form -------------------------------- */
  const form = $("#contact-form");

  if (form) {
    const status = $("#form-status");
    const EMAIL  = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

    function setStatus(message, ok) {
      if (!status) return;
      status.textContent = message;
      status.className = "form__status is-on " +
        (ok ? "form__status--ok" : "form__status--err");
    }

    function validateField(input) {
      const field = input.closest(".field");
      const error = $(".field__error", field);
      let message = "";

      if (!input.value.trim()) {
        message = "This field is required.";
      } else if (input.type === "email" && !EMAIL.test(input.value.trim())) {
        message = "Please enter a valid email address.";
      } else if (input.id === "message" && input.value.trim().length < 10) {
        message = "Please add a little more detail (10+ characters).";
      }

      if (error) error.textContent = message;
      field.classList.toggle("is-invalid", Boolean(message));
      return !message;
    }

    const inputs = $$("input, textarea", form);

    inputs.forEach((input) => {
      input.addEventListener("blur", () => validateField(input));
      input.addEventListener("input", () => {
        if (input.closest(".field").classList.contains("is-invalid")) validateField(input);
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const invalid = inputs.filter((input) => !validateField(input));

      if (invalid.length) {
        setStatus("Please fix the highlighted fields and try again.", false);
        invalid[0].focus();
        return;
      }

      const button = $("button[type='submit']", form);
      const labelNode = button ? $(".btn__label", button) : null;
      const label = labelNode ? labelNode.textContent : "Send Message";
      // The button carries a hidden copy of its own content (the radial-reveal
      // face), so swap the label text in both — never the button's innerHTML.
      const setLabel = (text) => {
        if (!button) return;
        $$(".btn__label", button).forEach((el) => { el.textContent = text; });
      };
      if (button) { button.disabled = true; setLabel("Sending…"); }

      const endpoint = form.dataset.endpoint;
      const done = (ok, options) => {
        const opts = options || {};
        if (button) { button.disabled = false; setLabel(label); }
        if (ok) {
          setStatus(opts.message ||
            "Thanks! Your message has been received — I'll reply within 24 hours.", true);
          if (opts.keepValues !== true) form.reset();
        } else {
          setStatus("Something went wrong. Please email me directly instead.", false);
        }
      };

      if (!endpoint) {
        // No backend wired up: hand the message to the visitor's mail client
        // pre-filled (mailto) rather than pretending it was delivered.
        const data    = Object.fromEntries(new FormData(form));
        const to      = form.dataset.mailto || "gursingh301999@gmail.com";
        const subject = encodeURIComponent(data.subject || "Portfolio enquiry");
        const body    = encodeURIComponent(
          `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`
        );

        window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
        done(true, {
          message: `Opening your mail app — if nothing happens, write to ${to}.`,
          keepValues: true
        });
        return;
      }

      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form)))
      })
        .then((res) => done(res.ok))
        .catch(() => done(false));
    });
  }

  /* ---------------- 10. Dynamic footer year ------------------------ */
  $$("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* ---------------- 11. Radial reveal on every button --------------- */
  /* Vanilla port of the Originkit "Radial Reveal Button". A clipped copy of
     the button's own content sits on top; a circle that grows from the
     pointer uncovers it, so both faces read the same. framer-motion's
     numeric tween (animate(from → to, onUpdate)) becomes a small rAF lerp
     with the same 0.45s easeInOut, and clip-path does the masking. */
  const REVEAL_DURATION = 450;
  const canHover = typeof window.matchMedia !== "function"
    || window.matchMedia("(hover: hover)").matches;
  // Touch: the reveal would fire on tap and stick open, so build no faces.
  const revealTargets = canHover
    ? $$(".btn, .filter, .quotes__arrow, .to-top, .nav-toggle")
    : [];

  revealTargets.forEach((btn) => {
    if ($(".btn__reveal", btn)) return;                       // already set up

    const face = document.createElement("span");
    face.className = "btn__reveal";
    face.setAttribute("aria-hidden", "true");
    face.innerHTML = btn.innerHTML;                           // identical second face
    btn.appendChild(face);

    const clip = { r: 0, x: 100, y: 100, max: 160 };
    let rafId = 0;

    function applyClip() {
      const value = "circle(" + clip.r + "% at " + clip.x + "% " + clip.y + "%)";
      face.style.clipPath = value;
      face.style.webkitClipPath = value;
    }

    function anchorTo(event) {
      const rect = face.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const px = event.clientX - rect.left;
      const py = event.clientY - rect.top;
      const unit = Math.hypot(rect.width, rect.height) / Math.SQRT2;
      const far = Math.max(
        Math.hypot(px, py),
        Math.hypot(rect.width - px, py),
        Math.hypot(px, rect.height - py),
        Math.hypot(rect.width - px, rect.height - py)
      );
      clip.x = (px / rect.width) * 100;
      clip.y = (py / rect.height) * 100;
      clip.max = (far / unit) * 100 + 2;                      // 2% overshoot for the corners
    }

    function growTo(to) {
      if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
      if (reduceMotion) { clip.r = to; applyClip(); return; }

      const from = clip.r;
      const started = performance.now();

      function step(now) {
        const p = Math.min((now - started) / REVEAL_DURATION, 1);
        const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;   // easeInOut
        clip.r = from + (to - from) * eased;
        applyClip();
        rafId = p < 1 ? requestAnimationFrame(step) : 0;
      }
      rafId = requestAnimationFrame(step);
    }

    btn.addEventListener("pointerenter", (event) => {
      anchorTo(event);
      applyClip();
      growTo(clip.max);
    });

    btn.addEventListener("pointerleave", (event) => {
      if (clip.r >= clip.max - 0.5) {                         // already open: collapse from here
        anchorTo(event);
        clip.r = clip.max;
        applyClip();
      }
      growTo(0);
    });
  });

  /* ---------------- 12. Name colour sweep (portrait) --------------- */
  /* Vanilla port of the framer-motion "Text Colour Sweep": every character
     of [data-sweep] starts in the wave colour and settles into its own
     colour, staggered left-to-right. Web Animations API replaces useAnimate
     + stagger(), so the site stays dependency-free.
     Tuning (all optional, set on the element):
       data-sweep-wave      start colour, default #ffa04d
       data-sweep-stagger   seconds between characters, default 0.04
       data-sweep-duration  seconds per character,   default 0.6
       data-sweep-y         start offset in em,       default 0.3
       data-sweep-spread    % of characters in the coloured band, default 100
  ------------------------------------------------------------------ */
  $$("[data-sweep]").forEach((root) => {
    const source = $(".sweep-text", root) || root;
    const num = (v, fallback) => (v === undefined || v === "" ? fallback : parseFloat(v));

    const cfg = {
      wave:     root.dataset.sweepWave || "#ffa04d",
      stagger:  num(root.dataset.sweepStagger, 0.04) * 1000,
      duration: num(root.dataset.sweepDuration, 0.6) * 1000,
      rise:     num(root.dataset.sweepY, 0.3),
      spread:   Math.max(0, Math.min(100, num(root.dataset.sweepSpread, 100)))
    };

    /* 1 · split every text node into .char spans, remembering the colour
           each character has to end on (white for the first name, the
           accent for the surname) */
    const chars = [];
    (function split(node) {
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === 3) {
          if (!child.nodeValue) return;
          const finalColor = getComputedStyle(node).color || "currentColor";
          const frag = document.createDocumentFragment();
          Array.from(child.nodeValue).forEach((ch) => {
            const span = document.createElement("span");
            span.className = "char";
            span.setAttribute("aria-hidden", "true");   // the sr-only text carries the name
            span.textContent = ch === " " ? "\u00A0" : ch;
            span.dataset.color = finalColor;
            frag.appendChild(span);
            chars.push(span);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1) {
          split(child);
        }
      });
    })(source);

    if (!chars.length) return;

    /* No Web Animations (or reduced motion) → leave the name as plain text */
    if (reduceMotion || typeof source.animate !== "function") return;

    /* 2 · hidden start state, mirroring the component's resetToHidden() */
    const total = chars.length;
    const affected = Math.round(total * (cfg.spread / 100));
    const middle = (total - 1) / 2;
    const halfBand = (Math.max(affected, 1) - 1) / 2;
    const fromColors = chars.map((c, i) =>
      (affected > 0 && Math.abs(i - middle) <= halfBand) ? cfg.wave : c.dataset.color);

    chars.forEach((c, i) => {
      c.style.opacity = "0";
      c.style.transform = "translateY(" + cfg.rise + "em)";
      c.style.color = fromColors[i];
    });

    /* 3 · play once, when the portrait comes into view */
    let played = false;
    function play() {
      if (played) return;
      played = true;
      chars.forEach((c, i) => {
        const anim = c.animate(
          [
            { opacity: 0, transform: "translateY(" + cfg.rise + "em)", color: fromColors[i] },
            { opacity: 1, transform: "translateY(0)", color: c.dataset.color }
          ],
          {
            duration: cfg.duration,
            delay: i * cfg.stagger,
            easing: "cubic-bezier(0.42, 0, 0.58, 1)",   // easeInOut, as the preset
            fill: "backwards"
          }
        );
        anim.addEventListener("finish", () => {
          anim.cancel();                               // hand styling back to CSS
          c.style.opacity = "";
          c.style.transform = "";
          c.style.color = "";
        });
      });
    }

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          io.disconnect();
          play();
        });
      }, { threshold: 0.2 });
      io.observe(root);
    } else {
      play();
    }
  });


})();
