const SKILLS_GLOBE_DEFAULTS = {
    autoRotate: true,
    hintText: "Drag to rotate",
    initialRotationX: -0.35,
    initialRotationY: 0.55
};

const SKILLS_GLOBE_DRAG_ROTATION_SPEED = 0.008;
const SKILLS_GLOBE_DRAG_INERTIA = 0.00045;
const SKILLS_GLOBE_IDLE_SPIN = 0.004;
const SKILLS_GLOBE_INERTIA_DAMPING = 0.965;
const SKILLS_GLOBE_MAX_ROTATION_X = 1.05;
const SKILLS_GLOBE_GLOW_COLORS = [
    "86, 231, 255",
    "143, 107, 255",
    "223, 249, 255"
];

function resolveSkillsGlobeContainer(container) {
    if (typeof container === "string") {
        return document.querySelector(container);
    }

    return container instanceof Element ? container : null;
}

function skillsGlobeSpherePoint(index, total) {
    const offset = 2 / total;
    const increment = Math.PI * (3 - Math.sqrt(5));
    const y = (index * offset) - 1 + (offset / 2);
    const radius = Math.sqrt(1 - y * y);
    const phi = index * increment;

    return {
        x: Math.cos(phi) * radius,
        y,
        z: Math.sin(phi) * radius
    };
}

function rotateSkillsGlobePoint(point, angleX, angleY) {
    const cosY = Math.cos(angleY);
    const sinY = Math.sin(angleY);
    const x1 = point.baseX * cosY - point.baseZ * sinY;
    const z1 = point.baseX * sinY + point.baseZ * cosY;
    const cosX = Math.cos(angleX);
    const sinX = Math.sin(angleX);

    return {
        x: x1,
        y: point.baseY * cosX - z1 * sinX,
        z: point.baseY * sinX + z1 * cosX
    };
}

function getSkillsGlobeRotationValue(element) {
    if (element.classList.contains("sg-ring-1")) return 75;
    if (element.classList.contains("sg-ring-2")) return 45;
    if (element.classList.contains("sg-ring-3")) return 15;
    if (element.classList.contains("sg-ring-v1")) return 0;
    if (element.classList.contains("sg-ring-v2")) return 35;
    if (element.classList.contains("sg-ring-v3")) return 70;
    if (element.classList.contains("sg-ring-v4")) return 105;
    return 0;
}

function clampSkillsGlobeRotationX(value) {
    if (value > SKILLS_GLOBE_MAX_ROTATION_X) return SKILLS_GLOBE_MAX_ROTATION_X;
    if (value < -SKILLS_GLOBE_MAX_ROTATION_X) return -SKILLS_GLOBE_MAX_ROTATION_X;
    return value;
}

function buildSkillsGlobeMarkup(hintText) {
    return `
        <div class="skills-globe-component">
            <div class="sg-globe-wrap">
                <div class="sg-globe-hint">${hintText}</div>
                <div class="sg-globe" aria-label="Interactive skills globe" role="img">
                    <div class="sg-globe-shadow"></div>
                    <div class="sg-globe-core"></div>
                    <div class="sg-globe-ring sg-horizontal sg-ring-1"></div>
                    <div class="sg-globe-ring sg-horizontal sg-ring-2"></div>
                    <div class="sg-globe-ring sg-horizontal sg-ring-3"></div>
                    <div class="sg-globe-ring sg-vertical sg-ring-v1"></div>
                    <div class="sg-globe-ring sg-vertical sg-ring-v2"></div>
                    <div class="sg-globe-ring sg-vertical sg-ring-v3"></div>
                    <div class="sg-globe-ring sg-vertical sg-ring-v4"></div>
                    <div class="sg-globe-lat sg-lat-1"></div>
                    <div class="sg-globe-lat sg-lat-2"></div>
                    <div class="sg-globe-lat sg-lat-3"></div>
                    <div class="sg-globe-overlay"></div>
                    <div class="sg-globe-dots"></div>
                </div>
            </div>
        </div>
    `;
}

function initSkillsGlobe(config) {
    const options = { ...SKILLS_GLOBE_DEFAULTS, ...config };
    const container = resolveSkillsGlobeContainer(options.container);

    if (!container || !Array.isArray(options.skills) || options.skills.length === 0) {
        return null;
    }

    container.innerHTML = buildSkillsGlobeMarkup(options.hintText);

    const root = container.querySelector(".skills-globe-component");
    const globeWrap = root.querySelector(".sg-globe-wrap");
    const globe = root.querySelector(".sg-globe");
    const rings = globe.querySelectorAll(".sg-globe-ring, .sg-globe-lat");
    const state = {
        points: [],
        radius: 0,
        rotationX: options.initialRotationX,
        rotationY: options.initialRotationY,
        velocityX: 0,
        velocityY: 0,
        isDragging: false,
        pointerFrameId: 0,
        pendingPointerEvent: null,
        lastPointerX: 0,
        lastPointerY: 0,
        frameId: null,
        resizeFrameId: 0,
        isInViewport: true,
        isDocumentVisible: !document.hidden
    };

    options.skills.forEach((skill, index) => {
        const node = document.createElement("div");
        node.className = "sg-skill-node";
        node.innerHTML = `
            <div class="sg-skill-node-inner">
                <img src="${skill.icon}" alt="${skill.name}" draggable="false" loading="lazy" decoding="async">
                <span>${skill.name}</span>
            </div>
        `;
        globe.appendChild(node);

        const point = skillsGlobeSpherePoint(index, options.skills.length);
        state.points.push({
            baseX: point.x,
            baseY: point.y,
            baseZ: point.z,
            element: node,
            glowColor: SKILLS_GLOBE_GLOW_COLORS[index % SKILLS_GLOBE_GLOW_COLORS.length]
        });
    });

    function updateMeasurements() {
        const rect = globe.getBoundingClientRect();
        state.radius = rect.width * 0.33;
    }

    function render() {
        state.points.forEach(point => {
            const rotated = rotateSkillsGlobePoint(point, state.rotationX, state.rotationY);
            const depth = (rotated.z + 1) / 2;
            const scale = 0.48 + depth * 0.78;
            const x = rotated.x * state.radius * 1.45;
            const y = rotated.y * state.radius * 1.45;
            const opacity = 0.18 + depth * 0.95;
            const zIndex = Math.floor(depth * 1000);

            point.element.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
            point.element.style.opacity = opacity.toFixed(3);
            point.element.style.zIndex = zIndex;
        });

        const meshTiltX = state.rotationX * 45;
        const meshTiltY = state.rotationY * 45;

        rings.forEach(ring => {
            if (ring.classList.contains("sg-vertical")) {
                ring.style.transform = `rotateY(${getSkillsGlobeRotationValue(ring) + meshTiltY}deg)`;
            }

            if (ring.classList.contains("sg-horizontal")) {
                ring.style.transform = `rotateX(${getSkillsGlobeRotationValue(ring) + meshTiltX}deg)`;
            }
        });
    }

    function animate() {
        if (!state.isInViewport || !state.isDocumentVisible) {
            state.frameId = null;
            return;
        }

        if (!state.isDragging) {
            if (options.autoRotate) {
                state.rotationY += SKILLS_GLOBE_IDLE_SPIN;
            }

            state.rotationX = clampSkillsGlobeRotationX(state.rotationX + state.velocityX);
            state.rotationY += state.velocityY;
            state.velocityX *= SKILLS_GLOBE_INERTIA_DAMPING;
            state.velocityY *= SKILLS_GLOBE_INERTIA_DAMPING;
        }

        render();
        state.frameId = window.requestAnimationFrame(animate);
    }

    function ensureAnimationFrame() {
        if (state.frameId || !state.isInViewport || !state.isDocumentVisible) {
            return;
        }

        state.frameId = window.requestAnimationFrame(animate);
    }

    function stopAnimationFrame() {
        if (!state.frameId) {
            return;
        }

        window.cancelAnimationFrame(state.frameId);
        state.frameId = null;
    }

    function onPointerDown(event) {
        state.isDragging = true;
        state.velocityX *= 0.35;
        state.velocityY *= 0.35;
        state.lastPointerX = event.clientX;
        state.lastPointerY = event.clientY;
        globe.classList.add("is-dragging");
        globeWrap.classList.add("is-dragging");

        if (globe.setPointerCapture) {
            globe.setPointerCapture(event.pointerId);
        }
    }

    function onPointerMove(event) {
        if (!state.isDragging) return;

        state.pendingPointerEvent = event;
        if (state.pointerFrameId) return;

        state.pointerFrameId = window.requestAnimationFrame(() => {
            const pointerEvent = state.pendingPointerEvent;
            state.pointerFrameId = 0;
            state.pendingPointerEvent = null;

            if (!pointerEvent) return;

        const deltaX = pointerEvent.clientX - state.lastPointerX;
        const deltaY = pointerEvent.clientY - state.lastPointerY;
        state.rotationY -= deltaX * SKILLS_GLOBE_DRAG_ROTATION_SPEED;
        state.rotationX = clampSkillsGlobeRotationX(state.rotationX - deltaY * SKILLS_GLOBE_DRAG_ROTATION_SPEED);
        state.velocityY = -deltaX * SKILLS_GLOBE_DRAG_INERTIA;
        state.velocityX = -deltaY * SKILLS_GLOBE_DRAG_INERTIA;
        state.lastPointerX = pointerEvent.clientX;
        state.lastPointerY = pointerEvent.clientY;
        render();
        });
    }

    function onPointerUp(event) {
        state.isDragging = false;
        globe.classList.remove("is-dragging");
        globeWrap.classList.remove("is-dragging");

        if (event && globe.releasePointerCapture && globe.hasPointerCapture && globe.hasPointerCapture(event.pointerId)) {
            globe.releasePointerCapture(event.pointerId);
        }
    }

    function onVisibilityChange() {
        state.isDocumentVisible = !document.hidden;

        if (document.hidden) {
            state.velocityX = 0;
            state.velocityY = 0;
            stopAnimationFrame();
            return;
        }

        ensureAnimationFrame();
    }

    function requestResize() {
        if (state.resizeFrameId) return;

        state.resizeFrameId = window.requestAnimationFrame(() => {
            state.resizeFrameId = 0;
            updateMeasurements();
            render();
        });
    }

    let viewportObserver = null;

    if ("IntersectionObserver" in window) {
        viewportObserver = new IntersectionObserver(entries => {
            const [entry] = entries;
            state.isInViewport = Boolean(entry?.isIntersecting);

            if (state.isInViewport) {
                ensureAnimationFrame();
                return;
            }

            stopAnimationFrame();
        }, {
            threshold: 0.08
        });

        viewportObserver.observe(container);
    }

    globe.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    window.addEventListener("resize", requestResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    updateMeasurements();
    render();
    ensureAnimationFrame();

    return {
        destroy() {
            globe.removeEventListener("pointerdown", onPointerDown);
            window.removeEventListener("pointermove", onPointerMove);
            window.removeEventListener("pointerup", onPointerUp);
            window.removeEventListener("pointercancel", onPointerUp);
            window.removeEventListener("resize", requestResize);
            document.removeEventListener("visibilitychange", onVisibilityChange);
            viewportObserver?.disconnect();

            stopAnimationFrame();

            container.innerHTML = "";
        }
    };
}

document.addEventListener("DOMContentLoaded", () => {
    initSkillsGlobe({
        container: "#skillsGlobeMount",
        hintText: "Drag to explore",
        skills: [
            { name: "HTML", icon: "media/html5.svg" },
            { name: "CSS", icon: "media/css3.svg" },
            { name: "JavaScript", icon: "media/javascript.svg" },
            { name: "Python", icon: "media/python.svg" },
            { name: "C#", icon: "media/csharp.svg" },
            { name: "Git", icon: "media/git.svg" },
            { name: "GitHub", icon: "media/github-brands-solid-full.svg" },
            { name: "FastAPI", icon: "media/fastapi.svg" },
            { name: "PostgreSQL", icon: "media/postgresql.svg" },
            { name: "SQLite", icon: "media/sqlite.svg" }
        ]
    });
});
