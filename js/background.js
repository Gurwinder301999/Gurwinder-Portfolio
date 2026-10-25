// This Website is made by GURWINDER SINGH.
// Optimized: idle-sleep, lower dpr on mobile, rAF only when needed.
(() => {
  "use strict";
  const TOTAL_FRAMES    = 240;
  const SMOOTHING_FAST  = 0.2;
  const SMOOTHING_REST  = 0.08;
  const NEARBY_RADIUS   = 12;
  const MAX_CONCURRENT  = 6;
  const LOADER_MAX_WAIT = 2200;
  const WEBP_OK = document.createElement("canvas")
    .toDataURL("image/webp").indexOf("image/webp") === 0;
  const FRAME_SRC = (i) =>
    (WEBP_OK ? "frames-webp/frame_" : "frames/frame_") +
    String(i).padStart(6, "0") + (WEBP_OK ? ".webp" : ".jpg");
  const conn = typeof navigator !== "undefined" ? navigator.connection : null;
  const WALK_STRIDE = (conn && (conn.saveData || /2g/.test(conn.effectiveType || ""))) ? 2 : 1;
  const canvas = document.getElementById("frame-canvas");
  const loader = document.getElementById("loader");
  const fill   = document.getElementById("loader-fill");
  const label  = document.getElementById("loader-label");
  if (!canvas) return;
  const ctx = canvas.getContext("2d", { alpha: false });
  const frames    = new Map();

  // Disable heavy canvas on low-end mobile to keep 60fps
  const isLowEndMobile = window.innerWidth < 600 && (conn && (conn.saveData || /2g/.test(conn.effectiveType || "")));
  // keep canvas but lower DPR; don't fully disable unless saveData

  const reducedMotion = typeof window.matchMedia === "function"
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) {
    if (loader) loader.classList.add("is-done");
    return;
  }
  const inFlight  = new Set();
  const failed    = new Set();
  let loadedCount = 0;
  let totalWanted = 0;
  let started     = false;
  let revealed    = false;
  let target      = 0;
  let playhead    = 0;
  let lastDrawn   = -1;
  let lastTime    = 0;
  let queueCursor = 0;
  // idle-sleep: stop RAF when at rest
  let rafId = 0;
  let isTicking = false;
  let idleFrames = 0;

  function requestFrame(index) {
    if (index < 0 || index >= TOTAL_FRAMES) return false;
    if (frames.has(index) || inFlight.has(index) || failed.has(index)) return false;
    const img = new Image();
    inFlight.add(index);
    totalWanted += 1;
    img.onload = () => {
      inFlight.delete(index);
      frames.set(index, img);
      loadedCount += 1;
      paintLoader();
      if (!revealed && index === Math.round(target)) reveal();
      // wake tick if new frame arrived near playhead
      if (!isTicking) wake();
    };
    img.onerror = () => {
      inFlight.delete(index);
      failed.add(index);
    };
    img.src = FRAME_SRC(index);
    return true;
  }

  function nearestLoaded(index) {
    for (let d = 0; d <= NEARBY_RADIUS + 30; d++) {
      if (frames.has(index - d)) return frames.get(index - d);
      if (frames.has(index + d)) return frames.get(index + d);
    }
    return frames.get(0) || null;
  }

  function pump() {
    const center = Math.round(target);
    for (let d = -NEARBY_RADIUS; d <= NEARBY_RADIUS; d++) requestFrame(center + d);
    let active = inFlight.size;
    while (active < MAX_CONCURRENT && queueCursor < TOTAL_FRAMES) {
      requestFrame(queueCursor);
      queueCursor += WALK_STRIDE;
      active = inFlight.size;
    }
  }

  function paintLoader() {
    const pct = Math.min(100, Math.round((loadedCount / totalWanted) * 100));
    if (fill) fill.style.width = pct + "%";
    if (label) label.textContent = "Loading " + pct + "%";
  }

  function reveal() {
    if (revealed) return;
    revealed = true;
    window.setTimeout(() => canvas.classList.add("visible"), 60);
    if (loader) loader.classList.add("is-done");
  }

  function resizeCanvas(force) {
    const cap = window.innerWidth < 900 ? 1.4 : 1.8;
    const dpr = Math.min(window.devicePixelRatio || 1, cap);
    const w = Math.round(window.innerWidth * dpr);
    const h = Math.round(window.innerHeight * dpr);
    if (!force && w === canvas.width && Math.abs(h - canvas.height) < 80) return;
    canvas.width  = w;
    canvas.height = h;
    lastDrawn = -1;
    wake();
  }

  function draw(img) {
    const cw = canvas.width;
    const ch = canvas.height;
    const scale = Math.max(cw / img.width, ch / img.height);
    const dw = img.width * scale;
    const dh = img.height * scale;
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
  }

  function scrollProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (max <= 0) return 0;
    return Math.min(1, Math.max(0, window.scrollY / max));
  }

  function wake() {
    if (isTicking || document.hidden) return;
    isTicking = true;
    idleFrames = 0;
    lastTime = 0;
    rafId = requestAnimationFrame(tick);
  }

  function tick(now) {
    if (!lastTime) lastTime = now;
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    target = scrollProgress() * (TOTAL_FRAMES - 1);
    const lag = Math.abs(target - playhead);
    const k = 1 - Math.pow(1 - (lag > 2 ? SMOOTHING_FAST : SMOOTHING_REST), dt * 60);
    playhead += (target - playhead) * k;
    if (Math.abs(target - playhead) < 0.01) playhead = target;
    const index = Math.round(playhead);
    let didDraw = false;
    if (index !== lastDrawn) {
      const img = nearestLoaded(index);
      if (img) {
        draw(img);
        lastDrawn = index;
        didDraw = true;
        idleFrames = 0;
      }
    }

    if (started) pump();

    // idle detection: if playhead at target and no draw, count idle
    const atRest = Math.abs(target - playhead) < 0.02 && !didDraw;
    if (atRest) idleFrames++; else idleFrames = 0;

    // sleep after ~20 idle frames (~320ms) — wakes on next scroll/resize
    if (idleFrames > 20 && lag < 0.02) {
      isTicking = false;
      rafId = 0;
      return;
    }

    rafId = requestAnimationFrame(tick);
  }

  function onResize() { resizeCanvas(); }

  window.addEventListener("scroll", wake, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
  window.addEventListener("orientationchange", () => {
    window.setTimeout(() => resizeCanvas(true), 150);
  }, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
      isTicking = false;
      lastTime = 0;
    } else {
      wake();
    }
  });
  window.setTimeout(reveal, LOADER_MAX_WAIT);
  function start() {
    if (started) return;
    started = true;
    pump();
    wake();
  }
  window.addEventListener("load", start, { once: true });
  if (document.readyState === "complete") start();
  resizeCanvas();
  requestFrame(0);
  requestFrame(TOTAL_FRAMES - 1);
  requestFrame(1);
  requestFrame(2);
  wake();
})();
