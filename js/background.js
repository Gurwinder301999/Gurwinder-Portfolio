
(() => {
  "use strict";


  const TOTAL_FRAMES    = 240;
  const SMOOTHING       = 0.12;
  const NEARBY_RADIUS   = 12;
  const MAX_CONCURRENT  = 6;
  const LOADER_MAX_WAIT = 2200;

  const FRAME_SRC = (i) => `frames/frame_${String(i).padStart(6, "0")}.jpg`;


  const canvas = document.getElementById("frame-canvas");
  const loader = document.getElementById("loader");
  const fill   = document.getElementById("loader-fill");
  const label  = document.getElementById("loader-label");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: false });


  const frames    = new Map();
  const inFlight  = new Set();
  const failed    = new Set();
  let loadedCount = 0;
  let started     = false;

  function requestFrame(index) {
    if (index < 0 || index >= TOTAL_FRAMES) return;
    if (frames.has(index) || inFlight.has(index) || failed.has(index)) return;

    const img = new Image();
    inFlight.add(index);

    img.onload = () => {
      inFlight.delete(index);
      frames.set(index, img);
      loadedCount += 1;
      paintLoader();
      if (!revealed && index === Math.round(target)) reveal();
    };
    img.onerror = () => {
      inFlight.delete(index);
      failed.add(index);
    };
    img.src = FRAME_SRC(index);
  }


  function nearestLoaded(index) {
    for (let d = 0; d <= NEARBY_RADIUS + 30; d++) {
      if (frames.has(index - d)) return frames.get(index - d);
      if (frames.has(index + d)) return frames.get(index + d);
    }
    return frames.get(0) || null;
  }


  let queueCursor = 0;
  function pump() {
    const center = Math.round(target);
    for (let d = -NEARBY_RADIUS; d <= NEARBY_RADIUS; d++) requestFrame(center + d);

    let active = inFlight.size;
    while (active < MAX_CONCURRENT && queueCursor < TOTAL_FRAMES) {
      requestFrame(queueCursor);
      queueCursor += 1;
      active = inFlight.size;
    }
  }


  function paintLoader() {
    const pct = Math.round((loadedCount / TOTAL_FRAMES) * 100);
    if (fill) fill.style.width = pct + "%";
    if (label) label.textContent = "Loading " + pct + "%";
  }

  let revealed = false;
  function reveal() {
    if (revealed) return;
    revealed = true;
    window.setTimeout(() => canvas.classList.add("visible"), 60);
    if (loader) loader.classList.add("is-done");
  }


  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width  = Math.round(window.innerWidth  * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    lastDrawn = -1;
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

  let target    = 0;
  let playhead  = 0;
  let lastDrawn = -1;
  let lastTime  = 0;

  function tick(now) {
    if (!lastTime) lastTime = now;
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    target = scrollProgress() * (TOTAL_FRAMES - 1);


    const k = 1 - Math.pow(1 - SMOOTHING, dt * 60);
    playhead += (target - playhead) * k;
    if (Math.abs(target - playhead) < 0.01) playhead = target;


    const index = Math.round(playhead);
    if (index !== lastDrawn) {
      const img = nearestLoaded(index);
      if (img) {
        draw(img);
        lastDrawn = index;
      }
    }

    if (started) pump();
    requestAnimationFrame(tick);
  }


  function onResize() { resizeCanvas(); }

  window.addEventListener("resize", onResize, { passive: true });
  window.addEventListener("orientationchange", onResize, { passive: true });


  window.setTimeout(reveal, LOADER_MAX_WAIT);

  function start() {
    if (started) return;
    started = true;
    pump();
  }
  window.addEventListener("load", start, { once: true });
  if (document.readyState === "complete") start();

  resizeCanvas();
  requestFrame(0);
  requestFrame(TOTAL_FRAMES - 1);
  requestFrame(1);
  requestFrame(2);
  requestAnimationFrame(tick);

})();
