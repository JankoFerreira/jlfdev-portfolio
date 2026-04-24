// =========================
// HERO PARTICLES (MOUSE REPELLER)
// =========================
(function initHeroParticles() {
    const canvas = document.getElementById("heroCanvas");
    const hero = document.querySelector(".hero");
    if (!canvas || !hero) return;

    const ctx = canvas.getContext("2d");
    const mouse = { x: null, y: null, radius: 140 };
    const state = {
        width: 0,
        height: 0,
        ratio: 1,
        points: [],
        frameId: 0,
        resizeFrameId: 0,
        pointerFrameId: 0,
        heroRect: null,
        pendingPointerEvent: null,
        isVisible: !document.hidden,
        isInViewport: true
    };

    function resize() {
        const rect = hero.getBoundingClientRect();
        state.width = Math.max(1, Math.floor(rect.width));
        state.height = Math.max(1, Math.floor(rect.height));
        state.ratio = Math.min(window.devicePixelRatio || 1, 1.5);

        canvas.width = Math.floor(state.width * state.ratio);
        canvas.height = Math.floor(state.height * state.ratio);
        canvas.style.width = `${state.width}px`;
        canvas.style.height = `${state.height}px`;
        ctx.setTransform(state.ratio, 0, 0, state.ratio, 0, 0);

        const areaPerPoint = window.innerWidth < 700 ? 22000 : 12000;
        const count = Math.max(18, Math.floor((state.width * state.height) / areaPerPoint));
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

    hero.addEventListener("pointerenter", () => {
        state.heroRect = hero.getBoundingClientRect();
    }, { passive: true });

    hero.addEventListener("pointermove", event => {
        if (event.pointerType === "touch") return;

        state.pendingPointerEvent = event;
        if (state.pointerFrameId) return;

        state.pointerFrameId = window.requestAnimationFrame(() => {
            const pointerEvent = state.pendingPointerEvent;
            const rect = state.heroRect || hero.getBoundingClientRect();
            state.pendingPointerEvent = null;
            state.pointerFrameId = 0;

            if (!pointerEvent) return;

            mouse.x = pointerEvent.clientX - rect.left;
            mouse.y = pointerEvent.clientY - rect.top;
        });
    });

    hero.addEventListener("pointerleave", () => {
        mouse.x = null;
        mouse.y = null;
        state.heroRect = null;
    }, { passive: true });

    function renderFrame() {
        ctx.clearRect(0, 0, state.width, state.height);

        state.points.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > state.width) p.vx *= -1;
            if (p.y < 0 || p.y > state.height) p.vy *= -1;

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

        for (let i = 0; i < state.points.length; i++) {
            for (let j = i + 1; j < state.points.length; j++) {
                const dx = state.points[i].x - state.points[j].x;
                const dy = state.points[i].y - state.points[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    ctx.strokeStyle = `rgba(0,188,212,${1 - dist / 120})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(state.points[i].x, state.points[i].y);
                    ctx.lineTo(state.points[j].x, state.points[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        if (!state.isVisible || !state.isInViewport) {
            state.frameId = 0;
            return;
        }

        renderFrame();
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
    }

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(entries => {
            state.isInViewport = Boolean(entries[0]?.isIntersecting);
            state.isInViewport ? ensureAnimation() : stopAnimation();
        }, { threshold: 0.05 });
        observer.observe(hero);
    }

    document.addEventListener("visibilitychange", () => {
        state.isVisible = !document.hidden;
        state.isVisible ? ensureAnimation() : stopAnimation();
    });

    ensureAnimation();
})();
