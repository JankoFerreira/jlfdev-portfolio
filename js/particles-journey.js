function createParticleField(config) {
    const canvas = document.getElementById(config.canvasId);
    const wrapper = document.querySelector(config.wrapperSelector);

    if (!canvas || !wrapper) {
        return null;
    }

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reducedMotionQuery.matches) {
        return null;
    }

    const ctx = canvas.getContext("2d");
    const mouse = { x: null, y: null, radius: config.mouseRadius ?? 140 };
    const state = {
        width: 0,
        height: 0,
        points: [],
        frameId: 0,
        resizeFrameId: 0,
        pointerFrameId: 0,
        wrapperRect: null,
        pendingPointerEvent: null,
        isVisible: !document.hidden,
        isInViewport: true
    };
    const maxDistance = config.maxDistance ?? 120;
    const maxDistanceSq = maxDistance * maxDistance;
    const pointRadius = config.pointRadius ?? 1.8;

    function rand(min, max) {
        return Math.random() * (max - min) + min;
    }

    function buildPoints() {
        const area = Math.max(1, state.width * state.height);
        const desiredCount = Math.max(
            config.minCount ?? 18,
            Math.floor(area / (config.areaPerPoint ?? 22000))
        );

        state.points = Array.from({ length: desiredCount }, () => ({
            x: rand(0, state.width),
            y: rand(0, state.height),
            vx: rand(-(config.speed ?? 0.32), config.speed ?? 0.32),
            vy: rand(-(config.speed ?? 0.32), config.speed ?? 0.32)
        }));
    }

    function resize() {
        const rect = wrapper.getBoundingClientRect();
        const ratio = Math.min(window.devicePixelRatio || 1, 1.5);

        state.width = Math.max(1, Math.floor(rect.width));
        state.height = Math.max(1, Math.floor(rect.height));

        canvas.width = Math.floor(state.width * ratio);
        canvas.height = Math.floor(state.height * ratio);
        canvas.style.width = `${state.width}px`;
        canvas.style.height = `${state.height}px`;
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

        buildPoints();
        renderFrame();
    }

    function renderFrame() {
        ctx.clearRect(0, 0, state.width, state.height);

        for (const point of state.points) {
            point.x += point.vx;
            point.y += point.vy;

            if (point.x <= 0 || point.x >= state.width) point.vx *= -1;
            if (point.y <= 0 || point.y >= state.height) point.vy *= -1;

            if (mouse.x !== null) {
                const dx = point.x - mouse.x;
                const dy = point.y - mouse.y;
                const distSq = (dx * dx) + (dy * dy);

                if (distSq > 0 && distSq < (mouse.radius * mouse.radius)) {
                    const dist = Math.sqrt(distSq);
                    const force = (mouse.radius - dist) / mouse.radius;
                    point.vx += (dx / dist) * force * (config.mouseForce ?? 0.08);
                    point.vy += (dy / dist) * force * (config.mouseForce ?? 0.08);
                }
            }

            ctx.beginPath();
            ctx.arc(point.x, point.y, pointRadius, 0, Math.PI * 2);
            ctx.fillStyle = "#00bcd4";
            ctx.fill();
        }

        for (let i = 0; i < state.points.length; i += 1) {
            for (let j = i + 1; j < state.points.length; j += 1) {
                const dx = state.points[i].x - state.points[j].x;
                const dy = state.points[i].y - state.points[j].y;
                const distSq = (dx * dx) + (dy * dy);

                if (distSq >= maxDistanceSq) {
                    continue;
                }

                const distanceRatio = Math.sqrt(distSq) / maxDistance;
                ctx.strokeStyle = `rgba(0,188,212,${1 - distanceRatio})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(state.points[i].x, state.points[i].y);
                ctx.lineTo(state.points[j].x, state.points[j].y);
                ctx.stroke();
            }
        }
    }

    function animate() {
        if (!state.isVisible || !state.isInViewport) {
            state.frameId = 0;
            return;
        }

        renderFrame();
        state.frameId = window.requestAnimationFrame(animate);
    }

    function ensureAnimation() {
        if (state.frameId || !state.isVisible || !state.isInViewport) {
            return;
        }

        state.frameId = window.requestAnimationFrame(animate);
    }

    function stopAnimation() {
        if (!state.frameId) {
            return;
        }

        window.cancelAnimationFrame(state.frameId);
        state.frameId = 0;
    }

    function handlePointerMove(event) {
        state.pendingPointerEvent = event;
        if (state.pointerFrameId) return;

        state.pointerFrameId = window.requestAnimationFrame(() => {
            const pointerEvent = state.pendingPointerEvent;
            const rect = state.wrapperRect || wrapper.getBoundingClientRect();
            state.pendingPointerEvent = null;
            state.pointerFrameId = 0;

            if (!pointerEvent) return;

            mouse.x = pointerEvent.clientX - rect.left;
            mouse.y = pointerEvent.clientY - rect.top;
        });
    }

    function clearPointer() {
        mouse.x = null;
        mouse.y = null;
        state.wrapperRect = null;
    }

    function cacheWrapperRect() {
        state.wrapperRect = wrapper.getBoundingClientRect();
    }

    function handleVisibilityChange() {
        state.isVisible = !document.hidden;

        if (state.isVisible) {
            ensureAnimation();
            return;
        }

        stopAnimation();
    }

    let viewportObserver = null;

    if ("IntersectionObserver" in window) {
        viewportObserver = new IntersectionObserver(entries => {
            const [entry] = entries;
            state.isInViewport = Boolean(entry?.isIntersecting);

            if (state.isInViewport) {
                ensureAnimation();
                return;
            }

            stopAnimation();
        }, {
            threshold: 0.05
        });

        viewportObserver.observe(wrapper);
    }

    function requestResize() {
        if (state.resizeFrameId) return;

        state.resizeFrameId = window.requestAnimationFrame(() => {
            state.resizeFrameId = 0;
            resize();
        });
    }

    window.addEventListener("resize", requestResize, { passive: true });
    wrapper.addEventListener("pointerenter", cacheWrapperRect, { passive: true });
    wrapper.addEventListener("pointermove", handlePointerMove, { passive: true });
    wrapper.addEventListener("pointerleave", clearPointer, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);

    resize();
    ensureAnimation();

    return {
        destroy() {
            stopAnimation();
            viewportObserver?.disconnect();
            window.removeEventListener("resize", requestResize);
            wrapper.removeEventListener("pointerenter", cacheWrapperRect);
            wrapper.removeEventListener("pointermove", handlePointerMove);
            wrapper.removeEventListener("pointerleave", clearPointer);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        }
    };
}

// Fill the portfolio timeline line as the user scrolls through the section.
(function initTimelineProgress() {
    const timeline = document.querySelector(".journey-timeline");
    if (!timeline) return;

    function updateProgress() {
        const rect = timeline.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const start = windowHeight * 0.65;
        let progress = (start - rect.top) / rect.height;

        progress = Math.max(0, Math.min(1, progress));
        timeline.style.setProperty("--timeline-progress-y", `${(progress * rect.height).toFixed(1)}px`);
    }

    let ticking = false;

    function requestUpdate() {
        if (ticking) return;

        ticking = true;
        window.requestAnimationFrame(() => {
            updateProgress();
            ticking = false;
        });
    }

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("load", requestUpdate);
    window.addEventListener("resize", requestUpdate);
    requestUpdate();
})();
