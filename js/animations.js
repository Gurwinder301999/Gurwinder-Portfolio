// Gurwinder Portfolio — Premium Animation Layer
// No dependencies. Respects prefers-reduced-motion & hover capabilities.
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = typeof window.matchMedia !== "function" || window.matchMedia("(hover: hover)").matches;
  const isTouch = typeof window.matchMedia === "function" && window.matchMedia("(pointer: coarse)").matches;

  /* ────────────────────────────────────────────────
     1) NETWORK MESH CANVAS
     ──────────────────────────────────────────────── */
  (() => {
    const canvas = $("#network-canvas");
    if (!canvas) return;
    if (reduceMotion) { canvas.style.display = "none"; return; }
    const ctx = canvas.getContext("2d", { alpha: true });
    let w = 0, h = 0, dpr = 1, nodes = [], raf = 0, t = 0;
    const COUNT_DESKTOP = 52;
    const COUNT_MOBILE = 24;
    const LINK_DIST = 150;
    const LINK_DIST2 = LINK_DIST * LINK_DIST;

    function count() { return window.innerWidth < 700 ? COUNT_MOBILE : COUNT_DESKTOP; }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.8);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function makeNodes() {
      const n = count();
      nodes = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 1.1 + Math.random() * 1.4,
        pulse: Math.random() * Math.PI * 2,
      }));
    }

    function step() {
      t += 0.016;
      ctx.clearRect(0, 0, w, h);

      // move
      for (const p of nodes) {
        p.x += p.vx + Math.cos(t * 0.3 + p.pulse) * 0.06;
        p.y += p.vy + Math.sin(t * 0.25 + p.pulse) * 0.06;
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;
      }

      // links
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > LINK_DIST2) continue;
          const d = Math.sqrt(d2);
          const alpha = (1 - d / LINK_DIST) * 0.22;
          // data-flow shimmer: dash offset
          ctx.beginPath();
          ctx.strokeStyle = `rgba(59,130,246,${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // nodes
      for (const p of nodes) {
        const glow = 0.55 + Math.sin(t * 1.2 + p.pulse) * 0.22;
        ctx.beginPath();
        ctx.fillStyle = `rgba(147,197,251,${glow})`;
        ctx.shadowColor = "rgba(59,130,246,0.8)";
        ctx.shadowBlur = 6;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // inner bright dot
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${0.55 + Math.sin(t * 0.9 + p.pulse) * 0.2})`;
        ctx.arc(p.x, p.y, 0.7, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(step);
    }

    function start() {
      resize();
      makeNodes();
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(step);
    }

    let resizeT = 0;
    window.addEventListener("resize", () => {
      clearTimeout(resizeT);
      resizeT = setTimeout(start, 120);
    }, { passive: true });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
      else if (!raf) raf = requestAnimationFrame(step);
    });

    // fade intensity with scroll: stronger at top, subtler mid-page
    let scrollY = 0;
    window.addEventListener("scroll", () => {
      scrollY = window.scrollY;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p = Math.min(1, scrollY / max);
      // 0 at top -> 0.38 opacity, mid -> 0.16, end -> 0.08
      const op = 0.38 - p * 0.28;
      canvas.style.opacity = String(Math.max(0.06, op));
    }, { passive: true });

    start();
  })();

  /* ────────────────────────────────────────────────
     2) HERO ROLE TYPEWRITER
     ──────────────────────────────────────────────── */
  (() => {
    const el = $(".hero__role");
    if (!el) return;
    const phrases = [
      "& Network Engineer · VoIP Telephony · Windows & Linux Systems",
      "Desktop Support · Network Administration · VoIP Deployment",
      "Windows Server · Rocky Linux · Asterisk IP-PBX",
      "LAN / WAN · DHCP · DNS · VLAN · Enterprise Wi-Fi",
      "IP CCTV · Biometric Access · Ticketing & SLA",
    ];
    if (reduceMotion) return;

    // preserve SEO: keep original text for screen readers
    const original = el.textContent.trim();
    el.setAttribute("aria-label", original);
    // build typed structure without innerHTML
    el.textContent = "";
    const typed = document.createElement("span");
    typed.className = "typed";
    const caret = document.createElement("span");
    caret.className = "caret";
    caret.setAttribute("aria-hidden", "true");
    el.appendChild(typed);
    el.appendChild(caret);

    let pi = 0, ci = 0, deleting = false, hold = 0;
    const TYPE_SPEED = 38;
    const DELETE_SPEED = 22;
    const HOLD_FULL = 2200;
    const HOLD_EMPTY = 420;

    const HIGHLIGHT_RE = /(VoIP|Windows|Linux|Asterisk|CCTV|Wi-Fi|SLA|LAN|WAN|DHCP|DNS|VLAN)/gi;
    function renderTyped(text) {
      // clear and rebuild with safe DOM nodes (no innerHTML)
      typed.textContent = "";
      let lastIndex = 0;
      let m;
      // reset regex
      HIGHLIGHT_RE.lastIndex = 0;
      while ((m = HIGHLIGHT_RE.exec(text)) !== null) {
        if (m.index > lastIndex) {
          typed.appendChild(document.createTextNode(text.slice(lastIndex, m.index)));
        }
        const em = document.createElement("em");
        em.textContent = m[0];
        typed.appendChild(em);
        lastIndex = m.index + m[0].length;
      }
      if (lastIndex < text.length) {
        typed.appendChild(document.createTextNode(text.slice(lastIndex)));
      }
      if (!text.length) typed.textContent = "";
    }

    function tick() {
      const full = phrases[pi];
      if (!deleting) {
        ci++;
        renderTyped(full.slice(0, ci));
        if (ci >= full.length) {
          deleting = false;
          hold = HOLD_FULL;
          setTimeout(() => { deleting = true; tick(); }, hold);
          return;
        }
        // natural pause on "·"
        const delay = full[ci - 1] === "·" ? TYPE_SPEED * 3 : TYPE_SPEED + (Math.random() * 18);
        setTimeout(tick, delay);
      } else {
        ci--;
        renderTyped(full.slice(0, Math.max(0, ci)));
        if (ci <= 0) {
          deleting = false;
          pi = (pi + 1) % phrases.length;
          setTimeout(tick, HOLD_EMPTY);
          return;
        }
        setTimeout(tick, DELETE_SPEED);
      }
    }
    // start after hero reveal
    setTimeout(tick, 900);
  })();

  /* ────────────────────────────────────────────────
     3) SPOTLIGHT CARDS (mouse-following glow)
     ──────────────────────────────────────────────── */
  (() => {
    if (!canHover || reduceMotion) return;
    const targets = $$(".panel, .project, .feature, .service, .stat, .hero-tool, .exp__row");
    targets.forEach(el => el.classList.add("spotlight"));
    targets.forEach(el => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * 100;
        const y = ((e.clientY - r.top) / r.height) * 100;
        el.style.setProperty("--mx", x + "%");
        el.style.setProperty("--my", y + "%");
      });
    });
  })();

  /* ────────────────────────────────────────────────
     4) 3D TILT FOR PROJECT CARDS
     ──────────────────────────────────────────────── */
  (() => {
    if (!canHover || reduceMotion) return;
    const cards = $$(".project");
    cards.forEach(card => {
      card.classList.add("tilt");
      // ensure glare element exists
      if (!$(".project__glare", card)) {
        const g = document.createElement("span");
        g.className = "project__glare";
        g.setAttribute("aria-hidden", "true");
        const thumb = $(".project__thumb", card);
        if (thumb) thumb.appendChild(g);
        else card.appendChild(g);
      }
      let rafId = 0;
      let mx = 50, my = 50, rx = 0, ry = 0;
      function apply() {
        rafId = 0;
        const max = 7;
        const rotY = (mx - 50) / 50 * max;
        const rotX = -(my - 50) / 50 * max;
        card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(0) translateY(-6px)`;
        card.style.setProperty("--mx", mx + "%");
        card.style.setProperty("--my", my + "%");
      }
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        mx = ((e.clientX - r.left) / r.width) * 100;
        my = ((e.clientY - r.top) / r.height) * 100;
        if (!rafId) rafId = requestAnimationFrame(apply);
      });
      card.addEventListener("pointerleave", () => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = 0;
        card.style.transform = "";
      });
      card.addEventListener("pointerenter", () => {
        card.style.transition = "transform 0.18s ease-out";
      });
    });
  })();

  /* ────────────────────────────────────────────────
     5) CURSOR AURA
     ──────────────────────────────────────────────── */
  (() => {
    if (isTouch || reduceMotion || !canHover) return;
    const aura = $(".cursor-aura");
    if (!aura) return;
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let ax = mx, ay = my, raf = 0, visible = false;
    function loop() {
      ax += (mx - ax) * 0.08;
      ay += (my - ay) * 0.08;
      aura.style.transform = `translate3d(${ax}px, ${ay}px, 0)`;
      raf = requestAnimationFrame(loop);
    }
    window.addEventListener("pointermove", (e) => {
      mx = e.clientX; my = e.clientY;
      if (!visible) {
        visible = true;
        aura.classList.add("is-visible");
        if (!raf) raf = requestAnimationFrame(loop);
      }
    }, { passive: true });
    window.addEventListener("pointerleave", () => {
      visible = false;
      aura.classList.remove("is-visible");
    });
    // enlarge over interactive elements
    $$("a, button, .project, .panel").forEach(el => {
      el.addEventListener("pointerenter", () => aura.classList.add("is-hovering"));
      el.addEventListener("pointerleave", () => aura.classList.remove("is-hovering"));
    });
    // hide if mouse hasn't moved after load (e.g. keyboard nav)
    setTimeout(() => {
      if (!visible) aura.style.display = "none";
    }, 1200);
    loop();
  })();

  /* ────────────────────────────────────────────────
     6) SCROLL PARALLAX (hero & portrait)
     ──────────────────────────────────────────────── */
  (() => {
    if (reduceMotion) return;
    const copy = $(".hero__copy");
    const portrait = $(".portrait");
    const hero = $(".hero");
    if (!hero || (!copy && !portrait)) return;
    let ticking = false;
    function onScroll() {
      const rect = hero.getBoundingClientRect();
      const vh = window.innerHeight;
      // only when hero is in viewport
      if (rect.bottom < -200 || rect.top > vh) { ticking = false; return; }
      const progress = Math.min(1, Math.max(0, -rect.top / (rect.height || 1)));
      const y1 = progress * 28;
      const y2 = progress * -18;
      const scale = 1 - progress * 0.02;
      if (copy) copy.style.transform = `translate3d(0, ${y1}px, 0)`;
      if (portrait) portrait.style.transform = `translate3d(0, ${y2}px, 0) scale(${scale})`;
      ticking = false;
    }
    window.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(onScroll);
    }, { passive: true });
    // parallax portrait also reacts to mouse
    if (canHover && portrait) {
      const ring = $(".portrait__ring", portrait) || portrait;
      portrait.addEventListener("pointermove", (e) => {
        const r = portrait.getBoundingClientRect();
        const nx = (e.clientX - r.left - r.width / 2) / r.width;
        const ny = (e.clientY - r.top - r.height / 2) / r.height;
        ring.style.transform = `translate3d(${nx * 10}px, ${ny * 10}px, 0)`;
      });
      portrait.addEventListener("pointerleave", () => {
        ring.style.transform = "";
      });
    }
  })();

  /* ────────────────────────────────────────────────
     7) SKILLS STAGGER REVEAL + STAT PULSE
     ──────────────────────────────────────────────── */
  (() => {
    const skillList = $(".skill-list");
    const tools = $(".tools");
    const targets = [skillList, tools].filter(Boolean);
    if (!targets.length) return;
    if (reduceMotion) {
      targets.forEach(el => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    }, { threshold: 0.18 });
    targets.forEach(el => io.observe(el));

    // stat pulse after count
    const stats = $$(".stat");
    const sio = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        setTimeout(() => entry.target.classList.add("is-counted"), 1600);
        sio.unobserve(entry.target);
      });
    }, { threshold: 0.3 });
    stats.forEach(s => sio.observe(s));
  })();

  /* ────────────────────────────────────────────────
     8) HERO TOOLS & SERVICES ICON FLOAT LOOP
     ──────────────────────────────────────────────── */
  (() => {
    if (reduceMotion) return;
    const tools = $$(".hero-tool");
    tools.forEach((el, i) => {
      el.style.animation = `hero-tool-float ${3.2 + (i % 3) * 0.4}s ease-in-out ${i * 0.18}s infinite`;
    });
    // inject keyframes if not present
    if (!$("#anim-float-kf")) {
      const s = document.createElement("style");
      s.id = "anim-float-kf";
      s.textContent = `@keyframes hero-tool-float{
        0%,100%{ transform: translateY(0); }
        50%{ transform: translateY(-3px); }
      }`;
      document.head.appendChild(s);
    }
  })();

  /* ────────────────────────────────────────────────
     9) PORTFOLIO FILTERS: add subtle exit/enter stagger
     ──────────────────────────────────────────────── */
  (() => {
    // enhance existing filter with exit animation
    const btns = $$(".filter");
    const cards = $$(".project");
    if (!btns.length || reduceMotion) return;
    btns.forEach(btn => {
      btn.addEventListener("click", () => {
        const v = btn.dataset.filter || "all";
        cards.forEach((c, i) => {
          const show = v === "all" || c.dataset.cat === v;
          if (!show) {
            c.style.transition = `opacity 0.28s var(--ease) ${i * 18}ms, transform 0.28s var(--ease) ${i * 18}ms`;
            c.style.opacity = "0";
            c.style.transform = "scale(0.96) translateY(8px)";
            setTimeout(() => { c.classList.add("is-out"); c.style.opacity = ""; c.style.transform = ""; c.style.transition = ""; }, 320);
          }
        });
      });
    });
  })();

  /* ────────────────────────────────────────────────
     10) REDUCED-MOTION TOGGLE (keyboard: Alt+M) for QA
     ──────────────────────────────────────────────── */
  (() => {
    window.addEventListener("keydown", (e) => {
      if (e.altKey && e.key.toLowerCase() === "m") {
        document.documentElement.classList.toggle("force-reduced");
        const on = document.documentElement.classList.contains("force-reduced");
        // inject override
        let s = $("#force-reduced-override");
        if (on && !s) {
          s = document.createElement("style");
          s.id = "force-reduced-override";
          s.textContent = "*{animation:none!important;transition:none!important} #network-canvas,.cursor-aura{display:none!important}";
          document.head.appendChild(s);
        } else if (!on && s) s.remove();
        // eslint-disable-next-line no-console
        console.log("Reduced motion:", on ? "forced" : "auto");
      }
    });
  })();

})();
