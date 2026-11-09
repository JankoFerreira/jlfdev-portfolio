(() => {
  "use strict";

  const root = document.documentElement;
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const theme = document.querySelector(".theme-switch");
  const themeColor = document.querySelector('meta[name="theme-color"]');

  function applyTheme(dark) {
    if (dark) root.dataset.theme = "dark";
    else delete root.dataset.theme;
    theme.setAttribute("aria-pressed", String(dark));
    theme.querySelector(".theme-label").textContent = dark ? "Light" : "Dark";
    themeColor?.setAttribute("content", dark ? "#161a14" : "#f5f2e9");
  }

  applyTheme(root.dataset.theme === "dark");
  theme.hidden = false;
  theme.addEventListener("click", () => {
    const dark = root.dataset.theme !== "dark";
    applyTheme(dark);
    try {
      localStorage.setItem("jf-theme", dark ? "dark" : "light");
    } catch {}
  });

  const main = document.querySelector("main");
  const route = main.querySelector(".board-route");
  const paths = route.querySelectorAll("path");
  const clip = route.querySelector("clipPath rect");
  const padGroup = route.querySelector(".board-route__pads");
  const sections = [...main.querySelectorAll(":scope > header, :scope > section, :scope > article, :scope > .timeline")];
  const back = document.querySelector(".back-top");
  const pageTop = document.querySelector("#page-top");
  const svgNamespace = "http://www.w3.org/2000/svg";
  let pads = [];
  let routeTop = 0;
  let routeHeight = 0;
  let documentTravel = 0;
  let frame = 0;

  function drawRoute() {
    const { width, height, top } = route.getBoundingClientRect();
    if (!width || !height) return;
    routeTop = top + window.scrollY;
    routeHeight = height;
    documentTravel = Math.max(root.scrollHeight - innerHeight, 1);
    route.setAttribute("viewBox", "0 0 " + width + " " + height);
    clip.setAttribute("width", width);

    const compact = width < 740;
    const rail = compact ? 5 : 12;
    const fork = compact ? 14 : 31;
    const rails = [];
    pads = [];
    padGroup.replaceChildren();

    for (const [direction, edge] of [[1, 0], [-1, width]]) {
      const x = edge + direction * rail;
      const second = x + direction * (compact ? 4 : 7);
      const terminal = edge + direction * fork;
      rails.push("M" + x + " 0V" + height, "M" + second + " 20V" + Math.max(20, height - 24));
      sections.forEach((section, index) => {
        const localTop = section.getBoundingClientRect().top - top;
        const y = Math.max(24, Math.min(height - 12, localTop + (index % 2 === 0 ? 39 : 67)));
        const startY = y - (compact ? 6 : 12);
        const middle = terminal - direction * (compact ? 3 : 5);
        rails.push("M" + x + " " + startY + "L" + middle + " " + y + "H" + terminal);
        if (!compact && direction < 0 && section.id === "work") {
          const elbow = width * 0.88;
          rails.push("M" + second + " " + (y + 12) + "H" + elbow + "l-23 23h-48");
          rails.push("M" + x + " " + (y + 31) + "H" + (elbow + 24) + "l-24 24h-74");
        }
        const pad = document.createElementNS(svgNamespace, "circle");
        pad.setAttribute("cx", terminal);
        pad.setAttribute("cy", y);
        pad.setAttribute("r", compact ? 1.8 : 2.6);
        padGroup.append(pad);
        pads.push({ pad, y });
      });
    }
    const divider = main.querySelector(".index-strip");
    if (divider && !compact) {
      const bounds = divider.getBoundingClientRect();
      const topY = bounds.top - top + 3;
      const bottomY = bounds.bottom - top - 3;
      rails.push("M" + rail + " " + (topY - 12) + "l12 12H" + (width - rail - 12) + "l12 12");
      rails.push("M" + (width - rail) + " " + (bottomY - 12) + "l-12 12H" + (rail + 12) + "l-12 12");
    }
    paths.forEach(path => path.setAttribute("d", rails.join(" ")));
    scheduleScroll();
  }

  function onScroll() {
    frame = 0;
    const position = Math.max(0, window.scrollY);
    const poweredTo = Math.min(routeHeight, Math.max(0, position - routeTop + innerHeight * 0.60));
    clip.setAttribute("height", poweredTo);
    pads.forEach(({ pad, y }) => pad.classList.toggle("is-powered", y <= poweredTo));
    back.hidden = position < Math.min(360, innerHeight * 0.48);
    back.style.setProperty("--top-offset", String(100 - Math.min(1, position / documentTravel) * 100));
  }

  function scheduleScroll() {
    if (!frame) frame = requestAnimationFrame(onScroll);
  }

  back.addEventListener("click", () => {
    pageTop.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: motion.matches ? "auto" : "smooth" });
  });
  window.addEventListener("scroll", scheduleScroll, { passive: true });
  window.addEventListener("resize", drawRoute, { passive: true });
  if ("ResizeObserver" in window) new ResizeObserver(drawRoute).observe(main);
  drawRoute();

  if ("IntersectionObserver" in window && typeof Element.prototype.animate === "function") {
    const titles = document.querySelectorAll(".hero h1, .section-heading h1, .section-heading h2, .project h3, .case-study h2, .timeline h2");
    const parts = new WeakMap();
    const animationObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.intersectionRatio < 0.42 || motion.matches) continue;
        parts.get(entry.target).forEach((word, index) => {
          const direction = index % 2 ? 1 : -1;
          const x = direction * (6 + index % 3 * 3);
          const y = index % 3 === 0 ? -14 : 17;
          word.getAnimations().forEach(animation => animation.cancel());
          word.animate([
            { opacity: 0.7, transform: "translate(" + x + "px," + y + "px) rotate(" + (direction * 4) + "deg) scale(.96)" },
            { opacity: 1, transform: "translate(0,-3px) rotate(0deg) scale(1.025)", offset: 0.67 },
            { opacity: 1, transform: "none" }
          ], { duration: 510, delay: Math.min(index, 9) * 30, easing: "cubic-bezier(.2,.65,.25,1)", fill: "backwards" });
        });
      }
    }, { threshold: 0.42 });

    for (const title of titles) {
      const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT);
      const nodes = [];
      const words = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      for (const node of nodes) {
        const fragment = document.createDocumentFragment();
        for (const token of node.textContent.split(/(\s+)/)) {
          if (!token) continue;
          if (/^\s+$/.test(token)) {
            fragment.append(token);
            continue;
          }
          const word = document.createElement("span");
          word.className = "ignition-word";
          word.textContent = token;
          fragment.append(word);
          words.push(word);
        }
        node.replaceWith(fragment);
      }
      parts.set(title, words);
      animationObserver.observe(title);
    }
    motion.addEventListener("change", () => {
      if (motion.matches) titles.forEach(title => parts.get(title).forEach(word => word.getAnimations().forEach(animation => animation.cancel())));
    });
  }

  const fine = matchMedia("(any-hover: hover) and (any-pointer: fine)");
  if (typeof Element.prototype.animate !== "function") return;
  const kit = document.createElement("div");
  kit.className = "cursor-kit";
  kit.setAttribute("aria-hidden", "true");
  const reticle = document.createElement("span");
  reticle.className = "cursor-reticle";
  kit.append(reticle);
  const sparks = Array.from({ length: 7 }, () => {
    const spark = document.createElement("span");
    spark.className = "cursor-spark";
    kit.append(spark);
    return { spark, animation: null };
  });
  document.body.append(kit);

  let nextSpark = 0;
  let last = null;
  let pointer = null;
  let pointerFrame = 0;

  function hideCursor() {
    root.classList.remove("cursor-active");
    last = null;
    pointer = null;
    cancelAnimationFrame(pointerFrame);
    pointerFrame = 0;
    sparks.forEach(({ animation }) => animation?.cancel());
  }

  function paintCursor(time) {
    pointerFrame = 0;
    if (!pointer) return;
    const { x, y, link } = pointer;
    root.classList.add("cursor-active");
    reticle.style.transform = "translate(" + x + "px," + y + "px)";
    kit.classList.toggle("is-link", link);

    if (!last) {
      last = { x, y, time };
      return;
    }
    if (time - last.time < 24 || Math.hypot(x - last.x, y - last.y) < 11) return;
    const entry = sparks[nextSpark];
    nextSpark = (nextSpark + 1) % sparks.length;
    entry.animation?.cancel();
    entry.spark.style.left = (last.x - 2) + "px";
    entry.spark.style.top = (last.y - 2) + "px";
    entry.animation = entry.spark.animate([
      { opacity: 0.78, transform: "scale(1)" },
      { opacity: 0, transform: "scale(.25)" }
    ], { duration: 240, easing: "ease-out" });
    last = { x, y, time };
  }

  window.addEventListener("pointermove", event => {
    const target = event.target;
    if (!fine.matches || motion.matches || event.pointerType !== "mouse" ||
        !(target instanceof Element) || target.closest("input, textarea, select, [contenteditable], .sg-globe")) {
      if (pointer) hideCursor();
      return;
    }
    pointer = { x: event.clientX, y: event.clientY, link: Boolean(target.closest("a, button, label")) };
    if (!pointerFrame) pointerFrame = requestAnimationFrame(paintCursor);
  }, { passive: true });
  root.addEventListener("pointerleave", hideCursor);
  window.addEventListener("blur", hideCursor);
  window.addEventListener("keydown", hideCursor);
  document.addEventListener("visibilitychange", () => { if (document.hidden) hideCursor(); });
  fine.addEventListener("change", hideCursor);
  motion.addEventListener("change", hideCursor);
})();
