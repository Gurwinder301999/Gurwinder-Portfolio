(() => {
  "use strict";

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduceMotion = typeof window.matchMedia === "function"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  const header = $("#site-header");
  const toTop  = $("#to-top");
  const bar    = $("#progress");

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
  // Click-away only matters while the menu is open, so bail before testing
  // containment on every click that lands on the page.
  document.addEventListener("click", (e) => {
    if (!nav || !nav.classList.contains("is-open")) return;
    if (nav.contains(e.target) || (toggle && toggle.contains(e.target))) return;
    setNav(false);
  });

  let scrollQueued = false;

  function onScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;

    if (bar) bar.style.transform = `scaleX(${ratio})`;
    if (header) header.classList.toggle("is-stuck", window.scrollY > 24);
    if (toTop) toTop.classList.toggle("is-visible", window.scrollY > 520);
    scrollQueued = false;
  }

  // The progress bar and header state read layout, so they run at most once
  // per frame no matter how fast the wheel events arrive.
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

  // Scroll spy. Anchors are matched to their sections once here, so a tick
  // only reads getBoundingClientRect instead of re-querying the DOM.
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
      setActive(navTargets[navTargets.length - 1].href);
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
    link.addEventListener("click", () => setActive(href));
  });
  syncActiveNav();

  // Fade sections in as they arrive. Unobserving each one matters: without
  // it every scroll re-fires the callback for the whole page.
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

  // Count-up on first view. Under reduced motion the final value is written
  // straight out, since animating a number is exactly the kind of motion
  // that setting is asking us not to do.
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
      const eased = 1 - Math.pow(1 - p, 3);
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

  // Category filter. The staggered animationDelay is what keeps the cards
  // from appearing all at once.
  const filterBtns = $$(".filter");
  const cards      = $$(".project");

  function applyFilter(value) {
    cards.forEach((card, i) => {
      const show = value === "all" || card.dataset.cat === value;
      card.classList.toggle("is-out", !show);
      card.classList.remove("is-in");
      if (show && !reduceMotion) {
        void card.offsetWidth;
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

  // Rotating notes. The dots are built in JS because they are pure
  // decoration and the markup stays free of them.
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

  // Validates locally, then hands off. There is no backend, so a valid
  // submission opens the visitor's mail app with the message prefilled.
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

  $$("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });

  // Hover reveal. Touch devices get none of it: the pointer position that
  // drives the circle does not exist there, and a tap-triggered wipe is
  // just a flicker.
  const REVEAL_DURATION = 450;
  const canHover = typeof window.matchMedia !== "function"
    || window.matchMedia("(hover: hover)").matches;

  const revealTargets = canHover
    ? $$(".btn, .filter, .quotes__arrow, .to-top, .nav-toggle")
    : [];

  revealTargets.forEach((btn) => {
    if ($(".btn__reveal", btn)) return;

    const face = document.createElement("span");
    face.className = "btn__reveal";
    face.setAttribute("aria-hidden", "true");
    // Cloned nodes rather than assigned to innerHTML: assigning re-parses the
    // markup, which is a needless parse on every button and the one sink on the
    // page where injected markup would execute. cloneNode never re-parses.
    Array.from(btn.childNodes).forEach((node) => face.appendChild(node.cloneNode(true)));
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
      clip.max = (far / unit) * 100 + 2;
    }

    function growTo(to) {
      if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
      if (reduceMotion) { clip.r = to; applyClip(); return; }

      const from = clip.r;
      const started = performance.now();

      function step(now) {
        const p = Math.min((now - started) / REVEAL_DURATION, 1);
        const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
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
      if (clip.r >= clip.max - 0.5) {
        anchorTo(event);
        clip.r = clip.max;
        applyClip();
      }
      growTo(0);
    });
  });

  // Name colour sweep. Each character is wrapped so it can be animated on
  // its own; the resolved colour is stashed and handed back to CSS when the
  // animation finishes, so the element goes back to inheriting.
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
            span.setAttribute("aria-hidden", "true");
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

    if (reduceMotion || typeof source.animate !== "function") return;

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
            easing: "cubic-bezier(0.42, 0, 0.58, 1)",
            fill: "backwards"
          }
        );
        anim.addEventListener("finish", () => {
          anim.cancel();
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
