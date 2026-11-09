(() => {
  "use strict";

  const canvas = document.querySelector("#circuit-canvas");
  if (!canvas) return;
  const stage = canvas.parentElement;
  const controls = document.querySelector(".circuit-controls");
  const readout = document.querySelector("#circuit-readout");
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const gl = canvas.getContext("webgl", { alpha: true, antialias: true, powerPreference: "low-power" });
  if (!gl) return;

  const vertexSource = `
    attribute vec3 position;
    attribute vec3 color;
    attribute vec2 component;
    uniform vec2 angles;
    uniform float aspect;
    uniform float separation;
    uniform float signal;
    uniform vec3 voyage;
    varying vec3 surface;

    void main() {
      vec3 p = position;
      p.xy -= voyage.xy;
      p *= voyage.z;
      p.z += separation * component.x;
      float cz = cos(angles.x), sz = sin(angles.x);
      float cx = cos(angles.y), sx = sin(angles.y);
      vec2 plane = mat2(cz, sz, -sz, cz) * p.xy;
      float y = plane.y * cx + p.z * sx;
      float depth = p.z * cx - plane.y * sx;
      float perspective = 1.0 - depth * 0.035;
      gl_Position = vec4(plane.x * 0.272 / aspect, (y - 0.22 - separation * 0.26) * 0.272, -depth * 0.10, perspective);
      vec3 active = mix(color, vec3(1.0, 0.59, 0.30), component.y * signal * 0.8);
      surface = active * (1.0 - signal * 0.45 * (1.0 - component.y));
    }
  `;
  const fragmentSource = `
    precision mediump float;
    varying vec3 surface;
    void main() { gl_FragColor = vec4(surface, 1.0); }
  `;

  function compile(type, source) {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
    gl.deleteShader(shader);
    return null;
  }

  const vertex = compile(gl.VERTEX_SHADER, vertexSource);
  const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) {
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    gl.deleteProgram(program);
    return;
  }

  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return;
  }

  const vertices = [];
  const indices = [];
  const palette = {
    base: [0.26, 0.32, 0.24],
    core: [0.33, 0.43, 0.27],
    grid: [0.40, 0.47, 0.31],
    copper: [0.85, 0.54, 0.33],
    chip: [0.80, 0.91, 0.53],
    dark: [0.10, 0.13, 0.10],
    socket: [0.59, 0.65, 0.43]
  };

  function box(x, y, z, width, height, depth, color, layer, conductive = 0, angle = 0) {
    const dx = width / 2, dy = height / 2;
    const corners = [
      [-dx, -dy, z], [dx, -dy, z], [dx, dy, z], [-dx, dy, z],
      [-dx, -dy, z + depth], [dx, -dy, z + depth], [dx, dy, z + depth], [-dx, dy, z + depth]
    ];
    const faces = [
      [0, 1, 2, 3, 0.54], [0, 1, 5, 4, 0.62], [1, 2, 6, 5, 0.76],
      [2, 3, 7, 6, 0.83], [3, 0, 4, 7, 0.68], [4, 5, 6, 7, 1.0]
    ];
    const cos = Math.cos(angle), sin = Math.sin(angle);
    for (const [a, b, c, d, light] of faces) {
      const first = vertices.length / 8;
      for (const corner of [a, b, c, d]) {
        const [u, v, w] = corners[corner];
        vertices.push(x + u * cos - v * sin, y + u * sin + v * cos, w,
          color[0] * light, color[1] * light, color[2] * light, layer, conductive);
      }
      indices.push(first, first + 1, first + 2, first, first + 2, first + 3);
    }
  }

  function trace(x1, y1, x2, y2) {
    box((x1 + x2) / 2, (y1 + y2) / 2, 0.145, Math.hypot(x2 - x1, y2 - y1),
      0.045, 0.014, palette.copper, 1, 1, Math.atan2(y2 - y1, x2 - x1));
  }

  box(0, 0, -0.32, 7.3, 4.48, 0.20, palette.base, 0);
  box(0, 0, -0.10, 7.1, 4.28, 0.23, palette.core, 1);
  for (let x = -3; x <= 3; x += 0.5) {
    for (let y = -1.75; y <= 1.75; y += 0.5) {
      box(x, y, 0.13, 0.037, 0.037, 0.008, palette.grid, 1);
    }
  }

  const routes = [
    [[-3.14, 1.6], [-2.55, 1.6], [-2.04, 1.09], [-0.87, 1.09]],
    [[-3.12, 0.83], [-2.61, 0.83], [-2.07, 0.29], [-1.39, 0.29]],
    [[-3.12, -1.34], [-2.36, -1.34], [-1.85, -0.83], [-0.73, -0.83]],
    [[-2.76, -1.83], [-1.92, -1.83], [-1.47, -1.38], [0.0, -1.38], [0.38, -1.0]],
    [[3.1, 1.62], [2.72, 1.62], [2.14, 1.04], [1.08, 1.04]],
    [[3.10, 0.72], [2.44, 0.72], [2.01, 0.29], [1.42, 0.29]],
    [[3.12, -1.57], [2.57, -1.57], [1.92, -0.92], [1.02, -0.92]],
    [[2.47, -1.88], [1.82, -1.88], [1.35, -1.41], [0.77, -1.41], [0.39, -1.03]]
  ];
  for (const route of routes) {
    for (let i = 1; i < route.length; i++) trace(...route[i - 1], ...route[i]);
    const [x, y] = route[0];
    box(x, y, 0.14, 0.15, 0.15, 0.05, palette.copper, 1, 1);
  }

  for (const x of [-3.38, 3.38]) {
    for (const y of [-1.89, 1.89]) {
      box(x, y, 0.13, 0.19, 0.19, 0.04, palette.socket, 1);
      box(x, y, 0.172, 0.09, 0.09, 0.025, palette.dark, 1);
    }
  }
  for (const x of [-2.51, 2.51]) {
    box(x, -0.25, 0.16, 0.34, 0.53, 0.15, palette.dark, 1);
    for (const y of [-0.43, -0.25, -0.07]) {
      box(x, y, 0.15, 0.52, 0.048, 0.045, palette.socket, 1);
    }
  }

  // Raised bars share edges so each letter reads as one extruded component.
  const initials = [
    [-1.04, 0.94, 1.5, 0.38], [-0.48, 0.00, 0.38, 1.50],
    [-1.04, -0.94, 1.50, 0.38], [-1.60, -0.52, 0.38, 0.46],
    [0.52, -0.19, 0.38, 1.88], [1.08, 0.94, 1.50, 0.38],
    [1.20, 0.13, 0.98, 0.38]
  ];
  for (const [x, y, w, h] of initials) box(x, y, 0.29, w, h, 0.45, palette.chip, 2);

  const vertexBuffer = gl.createBuffer();
  const indexBuffer = gl.createBuffer();
  if (!vertexBuffer || !indexBuffer) {
    gl.deleteBuffer(vertexBuffer);
    gl.deleteBuffer(indexBuffer);
    gl.deleteProgram(program);
    return;
  }
  gl.useProgram(program);
  gl.enable(gl.DEPTH_TEST);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  for (const [name, size, offset] of [["position", 3, 0], ["color", 3, 12], ["component", 2, 24]]) {
    const location = gl.getAttribLocation(program, name);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, 32, offset);
  }
  const uniforms = Object.fromEntries(["angles", "aspect", "separation", "signal", "voyage"].map(name => [name, gl.getUniformLocation(program, name)]));
  const views = {
    board: { yaw: -0.28, tilt: 0.68, separation: 0, signal: 0, text: "A custom circuit board built around my initials." },
    layers: { yaw: -0.52, tilt: 0.92, separation: 0.61, signal: 0, text: "An exploded view of the base, routing and raised initials." },
    signal: { yaw: -0.13, tilt: 0.34, separation: 0, signal: 1, text: "A routing view that highlights the copper traces." }
  };
  let target = views.board;
  const current = { ...target };
  let pointerX = 0, pointerY = 0;
  let frame = 0;
  let lost = false;

  let travel = 0;
  const figure = stage.closest("figure");
  stage.classList.add("voyage-stage");
  function scrollBoard() {
    const rect = figure.getBoundingClientRect();
    const enter = motion.matches ? 0 : Math.min(1, Math.max(0, scrollY / (innerHeight * .85)));
    const ease = enter * enter * (3 - 2 * enter);
    stage.style.left = (rect.left * (1 - ease)) + "px";
    stage.style.top = (rect.top * (1 - ease)) + "px";
    stage.style.width = (rect.width + (innerWidth - rect.width) * ease) + "px";
    stage.style.height = (rect.width / 1.35 + (innerHeight - rect.width / 1.35) * ease) + "px";
    travel = Math.max(0, scrollY / innerHeight - .85);
    target = { ...views.board, yaw: -.28 + ease * .18 + Math.sin(travel * .45) * .12, tilt: .68 + ease * .5 };
    gl.uniform3f(uniforms.voyage, Math.sin(travel * .6) * 1.5 * ease, Math.cos(travel * .4) * .65 * ease, 1 + ease * 2.6);
    rootStyle(ease);
    requestDraw();
  }
  function rootStyle(value) {
    document.documentElement.style.setProperty("--entered", value);
  }
  let scrollFrame = 0;
  window.addEventListener("scroll", () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => { scrollFrame = 0; scrollBoard(); });
  }, { passive: true });
  window.addEventListener("resize", scrollBoard);
  function draw() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniform2f(uniforms.angles, current.yaw, current.tilt);
    gl.uniform1f(uniforms.separation, current.separation);
    gl.uniform1f(uniforms.signal, current.signal);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
  }

  function render() {
    frame = 0;
    if (lost || document.hidden) return;
    const destination = { yaw: target.yaw + pointerX, tilt: target.tilt + pointerY, separation: target.separation, signal: target.signal };
    let pending = false;
    for (const key of Object.keys(destination)) {
      const change = destination[key] - current[key];
      if (!motion.matches && Math.abs(change) > 0.002) {
        current[key] += change * 0.20;
        pending = true;
      } else {
        current[key] = destination[key];
      }
    }
    draw();
    if (pending) requestDraw();
  }

  function requestDraw() {
    if (!frame && !lost && !document.hidden) frame = requestAnimationFrame(render);
  }

  function resize() {
    if (lost) return;
    const { width, height } = canvas.getBoundingClientRect();
    if (!width || !height) return;
    const ratio = Math.min(devicePixelRatio || 1, 1.4);
    const renderWidth = Math.min(1200, Math.round(innerWidth));
    const renderHeight = Math.round(renderWidth * innerHeight / innerWidth);
    if (canvas.width !== renderWidth || canvas.height !== renderHeight) { canvas.width = renderWidth; canvas.height = renderHeight; }
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform1f(uniforms.aspect, width / height);
    draw();
    stage.classList.add("is-live");
    controls.hidden = false;
  }

  controls.addEventListener("click", event => {
    const button = event.target.closest("button[data-view]");
    if (!button) return;
    target = views[button.dataset.view];
    for (const viewButton of controls.querySelectorAll("button")) {
      viewButton.setAttribute("aria-pressed", String(viewButton === button));
    }
    readout.textContent = target.text;
    requestDraw();
  });

  stage.addEventListener("pointermove", event => {
    if (event.pointerType === "touch" || motion.matches) return;
    const rect = stage.getBoundingClientRect();
    pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 0.28;
    pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 0.20;
    requestDraw();
  }, { passive: true });
  function resetTilt() {
    pointerX = 0;
    pointerY = 0;
    requestDraw();
  }
  stage.addEventListener("pointerleave", resetTilt);
  motion.addEventListener("change", resetTilt);
  document.addEventListener("visibilitychange", requestDraw);
  canvas.addEventListener("webglcontextlost", () => {
    lost = true;
    cancelAnimationFrame(frame);
    stage.classList.remove("is-live");
    controls.hidden = true;
    readout.textContent = views.board.text;
  });

  new ResizeObserver(resize).observe(stage);
  gl.uniform3f(uniforms.voyage, 0, 0, 1);
  scrollBoard();
  resize();
})();


