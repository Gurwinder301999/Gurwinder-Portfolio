(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = typeof window.matchMedia !== "function" || window.matchMedia("(hover: hover)").matches;
  const isTouch = typeof window.matchMedia === "function" && window.matchMedia("(pointer: coarse)").matches;

  const conn = typeof navigator !== "undefined" ? navigator.connection : null;
  const saveData = conn && (conn.saveData || /2g/.test(conn.effectiveType || ""));
  const isPhone = window.innerWidth < 768 || window.matchMedia("(pointer: coarse)").matches;
  const lowEnd = saveData || (typeof navigator !== "undefined" && navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) || isPhone;

  (() => {
    const canvas = $("#network-canvas");
    if (!canvas) return;
    if (reduceMotion) { canvas.style.display = "none"; return; }
    if (isPhone) { canvas.style.display = "none"; return; }
    const isMobile = window.innerWidth < 900 || isTouch;
    if (lowEnd && isMobile) { canvas.style.display = "none"; return; }
    if (new URLSearchParams(window.location.search).get("perf") === "low") { canvas.style.display = "none"; return; }

    const ctx = canvas.getContext("2d", { alpha: true });
    let w = 0, h = 0, dpr = 1, nodes = [], raf = 0, t = 0;
    let lastDraw = 0;
    let paused = false;
    const COUNT_DESKTOP = lowEnd ? 22 : 28;
    const COUNT_MOBILE = 14;
    const LINK_DIST = lowEnd ? 110 : 135;
    const LINK_DIST2 = LINK_DIST * LINK_DIST;
    const FPS = lowEnd ? 22 : 30;
    const FRAME_MS = 1000 / FPS;

    function count() { return window.innerWidth < 900 ? COUNT_MOBILE : COUNT_DESKTOP; }

    function resize() {
      const cap = lowEnd ? 1 : 1.35;
      dpr = Math.min(window.devicePixelRatio || 1, cap);
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
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: 1 + Math.random() * 1,
        pulse: Math.random() * Math.PI * 2,
      }));
    }

    function step(now) {
      raf = 0;
      if (paused || document.hidden) return schedule();
      if (now - lastDraw < FRAME_MS) { schedule(); return; }
      lastDraw = now;
      t += 0.016;

      ctx.clearRect(0, 0, w, h);

      for (const p of nodes) {
        p.x += p.vx + Math.cos(t * 0.22 + p.pulse) * 0.04;
        p.y += p.vy + Math.sin(t * 0.2 + p.pulse) * 0.04;
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > LINK_DIST2) continue;
          const d = Math.sqrt(d2);
          const alpha = (1 - d / LINK_DIST) * 0.18;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(59,130,246,${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      for (const p of nodes) {
        const glow = 0.5 + Math.sin(t * 1 + p.pulse) * 0.18;
        ctx.beginPath();
        ctx.fillStyle = `rgba(147,197,251,${glow})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      schedule();
    }

    function schedule() {
      if (!raf && !paused && !document.hidden) raf = requestAnimationFrame(step);
    }

    function start() {
      resize();
      makeNodes();
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      schedule();
    }

    let heroVisible = true;
    const hero = $(".hero");
    if (hero && "IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          heroVisible = e.isIntersecting;
          if (heroVisible) { if (!raf && !document.hidden) schedule(); }
          else { if (raf) { cancelAnimationFrame(raf); raf = 0; } }
        });
      }, { threshold: 0 });
      io.observe(hero);
    } else {
      let ticking = false;
      window.addEventListener("scroll", () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          ticking = false;
          const scrolled = window.scrollY;
          const shouldPause = scrolled > window.innerHeight * 1.2;
          if (shouldPause && !paused) { paused = true; if (raf) { cancelAnimationFrame(raf); raf = 0; } }
          else if (!shouldPause && paused) { paused = false; schedule(); }
        });
      }, { passive: true });
    }

    let resizeT = 0;
    window.addEventListener("resize", () => {
      clearTimeout(resizeT);
      resizeT = setTimeout(() => {
        resize();
        makeNodes();
      }, 150);
    }, { passive: true });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) { if (raf) { cancelAnimationFrame(raf); raf = 0; } }
      else if (heroVisible) schedule();
    });

    let scrollTick = false;
    window.addEventListener("scroll", () => {
      if (scrollTick) return;
      scrollTick = true;
      requestAnimationFrame(() => {
        scrollTick = false;
        const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const p = Math.min(1, window.scrollY / max);
        const op = 0.32 - p * 0.26;
        canvas.style.opacity = String(Math.max(0.04, op));
      });
    }, { passive: true });

    start();
  })();

  (() => {
    const el = $(".hero__role");
    if (!el || reduceMotion) return;
    const phrases = [
      el.textContent.trim(),
      "Desktop Support · Network Administration · VoIP Deployment",
      "Windows Server · Rocky Linux · Asterisk IP-PBX",
      "LAN / WAN · DHCP · DNS · VLAN · Enterprise Wi-Fi",
      "IP CCTV · Biometric Access · Ticketing & SLA",
    ];
    if (phrases.length < 2) return;

    const accessible = document.createElement("span");
    accessible.className = "sr-only";
    accessible.textContent = phrases[0];
    const visual = document.createElement("span");
    visual.className = "phrase-rotator";
    visual.setAttribute("aria-hidden", "true");
    el.replaceChildren(accessible, visual);

    const highlightRe = /(VoIP|Windows|Linux|Asterisk|CCTV|Wi-Fi|SLA|LAN|WAN|DHCP|DNS|VLAN)/gi;
    const holdMs = 3200;
    const transitionMs = 240;
    let index = 0;
    let holdTimer = 0;
    let swapTimer = 0;

    function renderPhrase(text) {
      visual.replaceChildren();
      let cursor = 0;
      let match;
      highlightRe.lastIndex = 0;
      while ((match = highlightRe.exec(text)) !== null) {
        if (match.index > cursor) visual.appendChild(document.createTextNode(text.slice(cursor, match.index)));
        const emphasis = document.createElement("em");
        emphasis.textContent = match[0];
        visual.appendChild(emphasis);
        cursor = match.index + match[0].length;
      }
      if (cursor < text.length) visual.appendChild(document.createTextNode(text.slice(cursor)));
    }

    function schedule() {
      window.clearTimeout(holdTimer);
      if (!document.hidden) holdTimer = window.setTimeout(rotate, holdMs);
    }

    function rotate() {
      visual.classList.add("is-changing");
      swapTimer = window.setTimeout(() => {
        index = (index + 1) % phrases.length;
        renderPhrase(phrases[index]);
        requestAnimationFrame(() => requestAnimationFrame(() => {
          visual.classList.remove("is-changing");
        }));
        schedule();
      }, transitionMs);
    }

    renderPhrase(phrases[index]);
    schedule();
    document.addEventListener("visibilitychange", () => {
      window.clearTimeout(holdTimer);
      window.clearTimeout(swapTimer);
      if (document.hidden) {
        visual.classList.remove("is-changing");
        renderPhrase(phrases[index]);
      } else {
        schedule();
      }
    });
  })();

  (() => {
    if (!canHover || reduceMotion || isPhone) return;
    const targets = $$(".panel, .project, .stat");
    targets.forEach(el => el.classList.add("spotlight"));
    let pending = null;
    document.addEventListener("pointermove", (e) => {
      pending = e;
      if (pending._raf) return;
      pending._raf = requestAnimationFrame(() => {
        const ev = pending;
        pending = null;
        let t = ev.target;
        while (t && t !== document) {
          if (t.classList && t.classList.contains("spotlight")) {
            const r = t.getBoundingClientRect();
            t.style.setProperty("--mx", ((ev.clientX - r.left) / r.width) * 100 + "%");
            t.style.setProperty("--my", ((ev.clientY - r.top) / r.height) * 100 + "%");
            break;
          }
          t = t.parentElement;
        }
      });
    }, { passive: true });
  })();

  (() => {
    if (!canHover || reduceMotion || lowEnd) return;
    const cards = $$(".project");
    const visibleSet = new Set();
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(en => {
          if (en.isIntersecting) visibleSet.add(en.target);
          else visibleSet.delete(en.target);
        });
      }, { threshold: 0.05 });
      cards.forEach(c => io.observe(c));
    } else {
      cards.forEach(c => visibleSet.add(c));
    }
    cards.forEach(card => {
      card.classList.add("tilt");
      if (!$(".project__glare", card)) {
        const g = document.createElement("span");
        g.className = "project__glare";
        g.setAttribute("aria-hidden", "true");
        const thumb = $(".project__thumb", card);
        if (thumb) thumb.appendChild(g);
        else card.appendChild(g);
      }
      let rafId = 0, mx = 50, my = 50;
      function apply() {
        rafId = 0;
        const max = lowEnd ? 4 : 6;
        const rotY = (mx - 50) / 50 * max;
        const rotX = -(my - 50) / 50 * max;
        card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(0)`;
        card.style.setProperty("--mx", mx + "%");
        card.style.setProperty("--my", my + "%");
      }
      card.addEventListener("pointermove", (e) => {
        if (!visibleSet.has(card)) return;
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
    });
  })();

  (() => {
    if (isTouch || reduceMotion || !canHover) return;
    if (lowEnd) return;
    const aura = $(".cursor-aura");
    if (!aura) return;
    let raf = 0, mx = 0, my = 0, ax = 0, ay = 0, visible = false;
    function update() {
      raf = 0;
      ax += (mx - ax) * 0.14;
      ay += (my - ay) * 0.14;
      aura.style.transform = `translate3d(${ax}px,${ay}px,0)`;
      if (Math.abs(mx - ax) > 0.3 || Math.abs(my - ay) > 0.3) {
        raf = requestAnimationFrame(update);
      }
    }
    window.addEventListener("pointermove", (e) => {
      mx = e.clientX; my = e.clientY;
      if (!visible) {
        visible = true;
        aura.classList.add("is-visible");
        ax = mx; ay = my;
        aura.style.transform = `translate3d(${ax}px,${ay}px,0)`;
      }
      if (!raf) raf = requestAnimationFrame(update);
    }, { passive: true });
    document.addEventListener("pointerleave", () => {
      visible = false;
      aura.classList.remove("is-visible");
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
    });
    $$("a, button, .project, .panel").forEach(el => {
      el.addEventListener("pointerenter", () => aura.classList.add("is-hovering"));
      el.addEventListener("pointerleave", () => aura.classList.remove("is-hovering"));
    });
    setTimeout(() => { if (!visible) aura.style.display = "none"; }, 1500);
  })();

  (() => {
    if (reduceMotion || isPhone) return;
    const copy = $(".hero__copy");
    const portrait = $(".portrait");
    const hero = $(".hero");
    if (!hero || (!copy && !portrait)) return;
    let ticking = false;
    let heroInView = true;
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(en => {
          heroInView = en.isIntersecting;
          if (!heroInView) {
            if (copy) copy.style.transform = "";
            if (portrait) portrait.style.transform = "";
          }
        });
      }, { threshold: 0 });
      io.observe(hero);
    }
    function onScroll() {
      ticking = false;
      if (!heroInView) return;
      const rect = hero.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.bottom < -100 || rect.top > vh) return;
      const progress = Math.min(1, Math.max(0, -rect.top / (rect.height || 1)));
      const y1 = progress * 20;
      const y2 = progress * -12;
      const scale = 1 - progress * 0.015;
      if (copy) copy.style.transform = `translate3d(0,${y1}px,0)`;
      if (portrait) portrait.style.transform = `translate3d(0,${y2}px,0) scale(${scale})`;
    }
    window.addEventListener("scroll", () => {
      if (ticking || !heroInView) return;
      ticking = true;
      requestAnimationFrame(onScroll);
    }, { passive: true });
    if (canHover && portrait && !lowEnd) {
      const ring = $(".portrait__ring", portrait) || portrait;
      let rafP = 0, nx = 0, ny = 0;
      portrait.addEventListener("pointermove", (e) => {
        const r = portrait.getBoundingClientRect();
        nx = (e.clientX - r.left - r.width / 2) / r.width;
        ny = (e.clientY - r.top - r.height / 2) / r.height;
        if (!rafP) rafP = requestAnimationFrame(() => {
          rafP = 0;
          ring.style.transform = `translate3d(${nx * 8}px,${ny * 8}px,0)`;
        });
      });
      portrait.addEventListener("pointerleave", () => {
        if (rafP) cancelAnimationFrame(rafP);
        rafP = 0;
        ring.style.transform = "";
      });
    }
  })();

  (() => {
    const skillList = $(".skill-list");
    const tools = $(".tools");
    const targets = [skillList, tools].filter(Boolean);
    if (!targets.length) return;
    if (reduceMotion) { targets.forEach(el => el.classList.add("is-visible")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    }, { threshold: 0.18 });
    targets.forEach(el => io.observe(el));
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

  (() => {
    if (reduceMotion || lowEnd) return;
    const tools = $$(".hero-tool");
    tools.forEach((el, i) => {
      el.style.animation = `hero-tool-float ${3.4 + (i % 3) * 0.3}s ease-in-out ${i * 0.18}s infinite`;
    });
    if (!$("#anim-float-kf")) {
      const s = document.createElement("style");
      s.id = "anim-float-kf";
      s.textContent = "@keyframes hero-tool-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}";
      document.head.appendChild(s);
    }
  })();

  (() => {
    const btns = $$(".filter");
    if (!btns.length || reduceMotion) return;
  })();

  (() => {
    window.addEventListener("keydown", (e) => {
      if (e.altKey && e.key.toLowerCase() === "m") {
        document.documentElement.classList.toggle("force-reduced");
        const on = document.documentElement.classList.contains("force-reduced");
        let s = $("#force-reduced-override");
        if (on && !s) {
          s = document.createElement("style");
          s.id = "force-reduced-override";
          s.textContent = "*{animation:none!important;transition:none!important} #network-canvas,.cursor-aura{display:none!important}";
          document.head.appendChild(s);
        } else if (!on && s) s.remove();
        console.log("Reduced motion:", on ? "forced" : "auto");
      }
    });
  })();

  (() => {
    if (reduceMotion) return;
    const mq = window.matchMedia("(max-width: 820px)");
    if (!mq.matches) return;

    $$(".features .feature").forEach((el,i)=> el.style.setProperty("--i", i));
    $$(".services .service").forEach((el,i)=> el.style.setProperty("--i", i));
    $$(".project").forEach((el,i)=> el.style.setProperty("--i", i));

    if ("IntersectionObserver" in window) {
      const cards = $$(".project");
      const io = new IntersectionObserver((entries)=>{
        entries.forEach(e=>{
          if (!e.isIntersecting) return;
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
      cards.forEach(c=> io.observe(c));
      $$(".panel").forEach((p,i)=> p.style.setProperty("--i", i%4));
    } else {
      $$(".project").forEach(c=> c.classList.add("is-visible"));
    }

    const tapTargets = $$(".btn, .filter, .project, .feature, .service");
    tapTargets.forEach(el=>{
      el.addEventListener("touchstart", ()=> el.classList.add("is-tapped"), {passive:true});
      el.addEventListener("touchend", ()=> setTimeout(()=> el.classList.remove("is-tapped"), 180), {passive:true});
    });
  })();
})();
