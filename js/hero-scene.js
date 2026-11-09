(() => {
const vertexShader = `
attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aUv;
uniform vec2 uRotation;
uniform vec2 uAspect;
varying vec3 vNormal;
varying vec2 vUv;

vec3 rotate(vec3 p) {
    float cy = cos(uRotation.y), sy = sin(uRotation.y);
    float cx = cos(uRotation.x), sx = sin(uRotation.x);
    p = vec3(cy * p.x + sy * p.z, p.y, cy * p.z - sy * p.x);
    return vec3(p.x, cx * p.y - sx * p.z, sx * p.y + cx * p.z);
}

void main() {
    vec3 p = rotate(aPosition);
    float depth = 4.9 - p.z;
    gl_Position = vec4(p.xy * uAspect * 2.15, depth * 1.02 - 0.5, depth);
    vNormal = rotate(aNormal);
    vUv = aUv;
}
`;
const fragmentShader = `
precision mediump float;
varying vec3 vNormal;
varying vec2 vUv;
uniform float uTime;

void main() {
    vec3 n = normalize(vNormal);
    vec3 light = normalize(vec3(-0.55, 0.8, 1.0));
    vec3 palette = mix(vec3(0.49, 0.24, 0.92), vec3(0.12, 0.86, 1.0),
        0.5 + 0.5 * cos(6.2832 * vUv.x - 0.6));
    float diffuse = max(dot(n, light), 0.0);
    float rim = pow(1.0 - abs(n.z), 2.0);
    float specular = pow(max(dot(n, normalize(light + vec3(0.0, 0.0, 1.0))), 0.0), 23.0);
    vec2 grid = abs(fract(vUv * vec2(92.0, 14.0) + 0.5) - 0.5);
    float trace = 1.0 - smoothstep(0.018, 0.125, min(grid.x, grid.y));
    float pulse = pow(0.5 + 0.5 * cos(18.85 * vUv.x - 1.35 * uTime), 10.0);
    vec3 color = vec3(0.027, 0.040, 0.093) + palette * (diffuse * 0.29 + rim * 0.54);
    color += palette * trace * (0.14 + 0.53 * pulse + 0.24 * diffuse);
    color += vec3(0.66, 0.87, 1.0) * specular * 0.62;
    gl_FragColor = vec4(color, 1.0);
}
`;
function knotGeometry() {
    const rings = 144;
    const sides = 20;
    const vertices = [];
    const indices = [];
    for (let ring = 0; ring <= rings; ring++) {
        const u = ring * Math.PI * 2 / rings;
        const radius = 1.21 + 0.42 * Math.cos(3 * u);
        const radiusSlope = -1.26 * Math.sin(3 * u);
        const cos = Math.cos(2 * u);
        const sin = Math.sin(2 * u);
        const x = radius * cos;
        const y = radius * sin;
        const z = 0.50 * Math.sin(3 * u);
        const tx = radiusSlope * cos - 2 * radius * sin;
        const ty = radiusSlope * sin + 2 * radius * cos;
        const tz = 1.5 * Math.cos(3 * u);
        const tangentLength = Math.hypot(tx, ty, tz);
        const planarLength = Math.hypot(tx, ty);
        const nx = ty / planarLength;
        const ny = -tx / planarLength;
        const bx = -tz * ny / tangentLength;
        const by = tz * nx / tangentLength;
        const bz = (tx * ny - ty * nx) / tangentLength;
        for (let side = 0; side <= sides; side++) {
            const v = side * Math.PI * 2 / sides;
            const cx = Math.cos(v) * nx + Math.sin(v) * bx;
            const cy = Math.cos(v) * ny + Math.sin(v) * by;
            const cz = Math.sin(v) * bz;
            const tube = 0.245;
            vertices.push(x + tube * cx, y + tube * cy, z + tube * cz, cx, cy, cz, ring / rings, side / sides);
            if (ring < rings && side < sides) {
                const first = ring * (sides + 1) + side;
                const next = first + sides + 1;
                indices.push(first, next, first + 1, first + 1, next, next + 1);
            }
        }
    }
    return { vertices: new Float32Array(vertices), indices: new Uint16Array(indices) };
}
function createProgram(gl) {
    const program = gl.createProgram();
    if (!program)
        return null;
    for (const [type, source] of [[gl.VERTEX_SHADER, vertexShader], [gl.FRAGMENT_SHADER, fragmentShader]]) {
        const shader = gl.createShader(type);
        if (!shader) {
            gl.deleteProgram(program);
            return null;
        }
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            gl.deleteShader(shader);
            gl.deleteProgram(program);
            return null;
        }
        gl.attachShader(program, shader);
        gl.deleteShader(shader);
    }
    gl.linkProgram(program);
    if (gl.getProgramParameter(program, gl.LINK_STATUS))
        return program;
    gl.deleteProgram(program);
    return null;
}
function mountHeroScene(canvas) {
    const stage = canvas.parentElement;
    const hero = canvas.closest(".hero");
    const toggle = hero?.querySelector("[data-scene-toggle]");
    if (!stage || !hero || !toggle)
        return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const gl = canvas.getContext("webgl", { alpha: true, antialias: true });
    if (!gl)
        return;
    const program = createProgram(gl);
    const vertexBuffer = gl.createBuffer();
    const indexBuffer = gl.createBuffer();
    if (!program || !vertexBuffer || !indexBuffer) {
        gl.deleteProgram(program);
        gl.deleteBuffer(vertexBuffer);
        gl.deleteBuffer(indexBuffer);
        return;
    }
    const geometry = knotGeometry();
    gl.useProgram(program);
    gl.enable(gl.DEPTH_TEST);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, geometry.vertices, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, geometry.indices, gl.STATIC_DRAW);
    for (const [name, size, offset] of [["aPosition", 3, 0], ["aNormal", 3, 12], ["aUv", 2, 24]]) {
        const location = gl.getAttribLocation(program, name);
        gl.enableVertexAttribArray(location);
        gl.vertexAttribPointer(location, size, gl.FLOAT, false, 32, offset);
    }
    const rotation = gl.getUniformLocation(program, "uRotation");
    const aspect = gl.getUniformLocation(program, "uAspect");
    const time = gl.getUniformLocation(program, "uTime");
    let frame = 0;
    let lastFrame = 0;
    let elapsed = 0;
    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;
    let visible = false;
    let paused = false;
    let lost = false;
    function draw() {
        if (lost)
            return;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.uniform2f(rotation, -0.32 + Math.sin(elapsed * 0.34) * 0.28 + pointerY, 0.27 + elapsed * 0.22 + pointerX);
        gl.uniform1f(time, elapsed);
        gl.drawElements(gl.TRIANGLES, geometry.indices.length, gl.UNSIGNED_SHORT, 0);
    }
    function animate(now) {
        if (lastFrame)
            elapsed += Math.min((now - lastFrame) / 1000, 0.05);
        lastFrame = now;
        pointerX += (targetX - pointerX) * 0.075;
        pointerY += (targetY - pointerY) * 0.075;
        draw();
        frame = requestAnimationFrame(animate);
    }
    function updateMotion() {
        cancelAnimationFrame(frame);
        lastFrame = 0;
        toggle.hidden = lost || motion.matches;
        toggle.textContent = paused ? "Resume motion" : "Pause motion";
        if (visible && !document.hidden && !paused && !motion.matches && !lost) {
            frame = requestAnimationFrame(animate);
        }
    }
    function resize() {
        if (lost)
            return;
        const { clientWidth: width, clientHeight: height } = canvas;
        if (!width || !height)
            return;
        const pixelRatio = Math.min(window.devicePixelRatio || 1, width < 520 ? 1.2 : 1.5);
        canvas.width = Math.round(width * pixelRatio);
        canvas.height = Math.round(height * pixelRatio);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(aspect, Math.min(1, height / width), Math.min(1, width / height));
        draw();
        stage.classList.add("scene-live");
    }
    function onPointer(event) {
        if (event.pointerType === "touch")
            return;
        const rect = hero.getBoundingClientRect();
        targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 0.85;
        targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 0.5;
    }
    function resetPointer() {
        targetX = 0;
        targetY = 0;
    }
    function onToggle() {
        paused = !paused;
        updateMotion();
    }
    function onContextLost() {
        lost = true;
        stage.classList.remove("scene-live");
        updateMotion();
    }
    const resizeObserver = new ResizeObserver(resize);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        updateMotion();
    });
    resize();
    updateMotion();
    resizeObserver.observe(canvas);
    visibilityObserver.observe(canvas);
    hero.addEventListener("pointermove", onPointer);
    hero.addEventListener("pointerleave", resetPointer);
    toggle.addEventListener("click", onToggle);
    canvas.addEventListener("webglcontextlost", onContextLost);
    motion.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateMotion);
    return () => {
        cancelAnimationFrame(frame);
        resizeObserver.disconnect();
        visibilityObserver.disconnect();
        hero.removeEventListener("pointermove", onPointer);
        hero.removeEventListener("pointerleave", resetPointer);
        toggle.removeEventListener("click", onToggle);
        canvas.removeEventListener("webglcontextlost", onContextLost);
        motion.removeEventListener("change", updateMotion);
        document.removeEventListener("visibilitychange", updateMotion);
        gl.deleteBuffer(vertexBuffer);
        gl.deleteBuffer(indexBuffer);
        gl.deleteProgram(program);
    };
}

const canvas = document.querySelector("#portfolio-scene-canvas");
if (canvas) mountHeroScene(canvas);
})();
