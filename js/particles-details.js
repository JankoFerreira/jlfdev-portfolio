// Ambient particle field for the "More About Me" section.
(function initDetailsParticles() {
    const canvas = document.getElementById("detailsCanvas");
    const section = document.querySelector(".details-section");
    if (!canvas || !section) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const ctx = canvas.getContext("2d");
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const targetFrameMs = isCoarsePointer ? 45 : 33;
    const maxDistance = isCoarsePointer ? 92 : 110;
    const maxDistanceSq = maxDistance * maxDistance;
    const maxConnectionsPerPoint = isCoarsePointer ? 2 : 3;
    const mouse = { x: null, y: null, radius: 140 };
    const state = {
        width: 0,
        height: 0,
        points: [],
        frameId: 0,
        resizeFrameId: 0,
        pointerFrameId: 0,
        sectionRect: null,
        pendingPointerEvent: null,
        isVisible: !document.hidden,
        isInViewport: true,
        lastDrawTime: 0
    };

    function resize() {
        const rect = section.getBoundingClientRect();
        const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
        state.width = Math.max(1, Math.floor(rect.width));
        state.height = Math.max(1, Math.floor(rect.height));

        canvas.width = Math.floor(state.width * ratio);
        canvas.height = Math.floor(state.height * ratio);
        canvas.style.width = `${state.width}px`;
        canvas.style.height = `${state.height}px`;
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

        const areaPerPoint = isCoarsePointer || window.innerWidth < 700 ? 36000 : 18000;
        const count = Math.max(isCoarsePointer ? 12 : 16, Math.floor((state.width * state.height) / areaPerPoint));
        state.points = Array.from({ length: count }, () => ({
            x: Math.random() * state.width,
            y: Math.random() * state.height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4
        }));
    }

    resize();

    function requestResize() {
        if (state.resizeFrameId) return;

        state.resizeFrameId = window.requestAnimationFrame(() => {
            state.resizeFrameId = 0;
            resize();
        });
    }

    window.addEventListener("resize", requestResize, { passive: true });

    // Track the pointer on the section because the canvas sits behind the content.
    section.addEventListener("pointerenter", () => {
        state.sectionRect = section.getBoundingClientRect();
    }, { passive: true });

    section.addEventListener("pointermove", event => {
        if (event.pointerType === "touch") return;

        state.pendingPointerEvent = event;
        if (state.pointerFrameId) return;

        state.pointerFrameId = window.requestAnimationFrame(() => {
            const pointerEvent = state.pendingPointerEvent;
            const rect = state.sectionRect || section.getBoundingClientRect();
            state.pendingPointerEvent = null;
            state.pointerFrameId = 0;

            if (!pointerEvent) return;

            mouse.x = pointerEvent.clientX - rect.left;
            mouse.y = pointerEvent.clientY - rect.top;
        });
    });

    section.addEventListener("pointerleave", () => {
        mouse.x = null;
        mouse.y = null;
        state.sectionRect = null;
    }, { passive: true });

    function renderFrame() {
        ctx.clearRect(0, 0, state.width, state.height);

        state.points.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            // Keep particles contained inside the section.
            if (p.x < 0 || p.x > state.width) p.vx *= -1;
            if (p.y < 0 || p.y > state.height) p.vy *= -1;

            // Nudge nearby particles away from the pointer for a light reactive effect.
            if (mouse.x !== null) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < mouse.radius && dist > 0) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    p.vx += (dx / dist) * force * 0.1;
                    p.vy += (dy / dist) * force * 0.1;
                }
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
            ctx.fillStyle = "#00bcd4";
            ctx.fill();
        });

        // Connect close particles to keep the background looking structured.
        for (let i = 0; i < state.points.length; i++) {
            let connections = 0;

            for (let j = i + 1; j < state.points.length; j++) {
                const dx = state.points[i].x - state.points[j].x;
                const dy = state.points[i].y - state.points[j].y;
                const distSq = dx * dx + dy * dy;

                if (distSq < maxDistanceSq) {
                    const dist = Math.sqrt(distSq);
                    ctx.strokeStyle = `rgba(0,188,212,${1 - dist / maxDistance})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(state.points[i].x, state.points[i].y);
                    ctx.lineTo(state.points[j].x, state.points[j].y);
                    ctx.stroke();
                    connections += 1;

                    if (connections >= maxConnectionsPerPoint) {
                        break;
                    }
                }
            }
        }
    }

    function animate(time) {
        if (!state.isVisible || !state.isInViewport) {
            state.frameId = 0;
            return;
        }

        if (time - state.lastDrawTime >= targetFrameMs) {
            renderFrame();
            state.lastDrawTime = time;
        }

        state.frameId = requestAnimationFrame(animate);
    }

    function ensureAnimation() {
        if (!state.frameId && state.isVisible && state.isInViewport) {
            state.frameId = requestAnimationFrame(animate);
        }
    }

    function stopAnimation() {
        if (!state.frameId) return;
        cancelAnimationFrame(state.frameId);
        state.frameId = 0;
        state.lastDrawTime = 0;
    }

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(entries => {
            state.isInViewport = Boolean(entries[0]?.isIntersecting);
            state.isInViewport ? ensureAnimation() : stopAnimation();
        }, { threshold: 0.05 });
        observer.observe(section);
    }

    document.addEventListener("visibilitychange", () => {
        state.isVisible = !document.hidden;
        state.isVisible ? ensureAnimation() : stopAnimation();
    });

    ensureAnimation();
})();
