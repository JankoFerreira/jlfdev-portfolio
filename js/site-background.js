// Drive the shared animated site background and pointer-follow reveal mask.
(function initSiteBackground() {
    const canvas = document.getElementById("rain-canvas");
    const meshLayer = document.getElementById("meshLayer");
    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const glyphs = "01AISTUDIONEXWEBSYSTEMGRIDFLOWVECTORAGENT";
    const usePurpleChance = 0.18;

    let width = 0;
    let height = 0;
    let ratio = 1;
    let fontSize = 16;
    let columns = [];
    let lastTime = 0;
    let rainFrameId = 0;
    let pointerFrameId = 0;
    let resizeFrameId = 0;
    let isDocumentVisible = !document.hidden;
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        ratio = Math.min(window.devicePixelRatio || 1, 1.25);

        canvas.width = Math.floor(width * ratio);
        canvas.height = Math.floor(height * ratio);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

        fontSize = width < 640 ? 13 : 17;
        const spacing = fontSize * (width < 640 ? 1.85 : 1.45);
        const count = Math.ceil(width / spacing);

        columns = Array.from({ length: count }, (_, index) => ({
            x: index * spacing,
            y: Math.random() * -height,
            speed: width < 640 ? 34 + Math.random() * 62 : 44 + Math.random() * 86,
            opacity: 0.28 + Math.random() * 0.24,
            purple: Math.random() < usePurpleChance,
            length: 5 + Math.floor(Math.random() * (width < 640 ? 5 : 8)),
            chars: []
        }));

        columns.forEach(column => {
            column.chars = Array.from({ length: column.length }, () => glyphs[Math.floor(Math.random() * glyphs.length)]);
        });
    }

    function drawRain(delta) {
        const lineHeight = fontSize * 1.05;

        ctx.font = `${fontSize}px "Space Grotesk", monospace`;
        ctx.textBaseline = "top";
        ctx.shadowBlur = 2;

        columns.forEach(column => {
            column.y += column.speed * delta;

            for (let index = 0; index < column.length; index += 1) {
                const y = column.y - index * lineHeight;
                const fade = 1 - index / column.length;
                const alpha = Math.max(0.06, column.opacity * fade);

                if (index === 0) {
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = column.purple ? "rgba(214, 174, 255, 0.38)" : "rgba(200, 243, 255, 0.42)";
                    ctx.fillStyle = column.purple
                        ? `rgba(244, 226, 255, ${Math.min(0.92, alpha + 0.26)})`
                        : `rgba(239, 251, 255, ${Math.min(0.94, alpha + 0.24)})`;
                } else if (column.purple) {
                    ctx.shadowBlur = 4;
                    ctx.shadowColor = "rgba(168, 85, 247, 0.18)";
                    ctx.fillStyle = `rgba(186, 122, 255, ${alpha})`;
                } else {
                    ctx.shadowBlur = 4;
                    ctx.shadowColor = "rgba(125, 211, 252, 0.18)";
                    ctx.fillStyle = `rgba(132, 224, 255, ${alpha})`;
                }

                ctx.fillText(column.chars[index], column.x, y);
            }

            if (column.y - column.length * lineHeight > height + Math.random() * 180) {
                column.y = -Math.random() * height * 0.5;
                column.speed = 44 + Math.random() * 86;
                column.opacity = 0.28 + Math.random() * 0.24;
                column.purple = Math.random() < usePurpleChance;
                column.length = 5 + Math.floor(Math.random() * (width < 640 ? 5 : 8));
                column.chars = Array.from({ length: column.length }, () => glyphs[Math.floor(Math.random() * glyphs.length)]);
            }
        });
    }

    function render(time) {
        const delta = Math.min((time - lastTime) / 1000 || 0.016, 0.05);
        lastTime = time;

        ctx.fillStyle = "rgba(6, 8, 18, 0.90)";
        ctx.fillRect(0, 0, width, height);

        drawRain(delta);
        rainFrameId = window.requestAnimationFrame(render);
    }

    function startRainLoop() {
        if (reducedMotion || !isDocumentVisible || rainFrameId) {
            return;
        }

        lastTime = performance.now();
        rainFrameId = window.requestAnimationFrame(render);
    }

    function stopRainLoop() {
        if (!rainFrameId) {
            return;
        }

        window.cancelAnimationFrame(rainFrameId);
        rainFrameId = 0;
    }

    function setRevealVars(x, y, widthValue, heightValue, softness, driftX, driftY) {
        root.style.setProperty("--mx", `${x}px`);
        root.style.setProperty("--my", `${y}px`);
        root.style.setProperty("--reveal-width", `${widthValue}px`);
        root.style.setProperty("--reveal-height", `${heightValue}px`);
        root.style.setProperty("--reveal-softness", `${softness}px`);
        root.style.setProperty("--reveal-dx", `${driftX}px`);
        root.style.setProperty("--reveal-dy", `${driftY}px`);
    }

    function requestResize() {
        if (resizeFrameId) return;

        resizeFrameId = window.requestAnimationFrame(() => {
            resizeFrameId = 0;
            resize();
        });
    }

    resize();
    ctx.fillStyle = "rgba(6, 8, 18, 1)";
    ctx.fillRect(0, 0, width, height);
    window.addEventListener("resize", requestResize, { passive: true });

    if (!reducedMotion) {
        startRainLoop();
    } else {
        drawRain(0.016);
    }

    if (reducedMotion) {
        setRevealVars(-9999, -9999, 0, 0, 0, 0, 0);
        return;
    }

    let currentX = window.innerWidth * 0.5;
    let currentY = window.innerHeight * 0.5;
    let targetX = currentX;
    let targetY = currentY;

    let meshCurrentX = 0;
    let meshCurrentY = 0;
    let meshTargetX = 0;
    let meshTargetY = 0;

    let currentRevealWidth = 0;
    let currentRevealHeight = 0;
    let currentRevealSoftness = 0;
    let currentRevealDriftX = 0;
    let currentRevealDriftY = 0;
    let targetRevealWidth = 0;
    let targetRevealHeight = 0;
    let targetRevealSoftness = 0;
    let targetRevealDriftX = 0;
    let targetRevealDriftY = 0;

    function animatePointer() {
        // Ease the spotlight and mesh drift so pointer movement feels fluid.
        currentX += (targetX - currentX) * 0.16;
        currentY += (targetY - currentY) * 0.16;

        meshCurrentX += (meshTargetX - meshCurrentX) * 0.05;
        meshCurrentY += (meshTargetY - meshCurrentY) * 0.05;

        currentRevealWidth += (targetRevealWidth - currentRevealWidth) * 0.12;
        currentRevealHeight += (targetRevealHeight - currentRevealHeight) * 0.12;
        currentRevealSoftness += (targetRevealSoftness - currentRevealSoftness) * 0.12;
        currentRevealDriftX += (targetRevealDriftX - currentRevealDriftX) * 0.12;
        currentRevealDriftY += (targetRevealDriftY - currentRevealDriftY) * 0.12;

        setRevealVars(
            currentX,
            currentY,
            currentRevealWidth,
            currentRevealHeight,
            currentRevealSoftness,
            currentRevealDriftX,
            currentRevealDriftY
        );

        if (meshLayer) {
            meshLayer.style.transform = `translate3d(${meshCurrentX}px, ${meshCurrentY}px, 0)`;
        }

        pointerFrameId = window.requestAnimationFrame(animatePointer);
    }

    function startPointerLoop() {
        if (pointerFrameId || !isDocumentVisible) {
            return;
        }

        pointerFrameId = window.requestAnimationFrame(animatePointer);
    }

    function stopPointerLoop() {
        if (!pointerFrameId) {
            return;
        }

        window.cancelAnimationFrame(pointerFrameId);
        pointerFrameId = 0;
    }

    if (!isCoarsePointer) {
        window.addEventListener("pointermove", event => {
            targetX = event.clientX;
            targetY = event.clientY;

            const x = event.clientX / width - 0.5;
            const y = event.clientY / height - 0.5;
            const velocityX = event.movementX || 0;
            const velocityY = event.movementY || 0;
            const speed = Math.min(1, (Math.abs(velocityX) + Math.abs(velocityY)) / 28);

            meshTargetX = x * 18;
            meshTargetY = y * 12;

            if (width < 700) {
                targetRevealWidth = 118 + speed * 18;
                targetRevealHeight = 84 + speed * 12;
                targetRevealSoftness = 58 + speed * 12;
            } else {
                targetRevealWidth = 170 + speed * 34;
                targetRevealHeight = 126 + speed * 26;
                targetRevealSoftness = 96 + speed * 24;
            }

            targetRevealDriftX = Math.max(-36, Math.min(36, velocityX * 1.5));
            targetRevealDriftY = Math.max(-26, Math.min(26, velocityY * 1.2));
        }, { passive: true });
    }

    window.addEventListener("mouseleave", () => {
        meshTargetX = 0;
        meshTargetY = 0;
        targetRevealWidth = 0;
        targetRevealHeight = 0;
        targetRevealSoftness = 0;
        targetRevealDriftX = 0;
        targetRevealDriftY = 0;
    }, { passive: true });

    document.addEventListener("visibilitychange", () => {
        isDocumentVisible = !document.hidden;

        if (!isDocumentVisible) {
            stopRainLoop();
            stopPointerLoop();
            return;
        }

        startRainLoop();
        startPointerLoop();
    });

    startPointerLoop();
})();
