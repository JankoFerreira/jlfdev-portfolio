/** A small, bounded WebGL ink field. No React renders or full-screen CSS masks per pointer event. */
export function mountBackground(): () => void {
  const canvas = document.querySelector<HTMLCanvasElement>('#paint-canvas');
  if (!canvas) return () => {};
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const coarse = matchMedia('(pointer: coarse)');
  if (reduced.matches || coarse.matches) return () => {};
  const gl = canvas.getContext('webgl', { alpha: true, antialias: false, depth: false, stencil: false, premultipliedAlpha: true, preserveDrawingBuffer: false });
  if (!gl) return () => {}; // The atmospheric CSS background is the fallback.
  const vertex = 'attribute vec2 p; varying vec2 uv; void main(){uv=p*.5+.5;gl_Position=vec4(p,0.,1.);}';
  const fragment = `precision mediump float;
    varying vec2 uv; uniform sampler2D field; uniform vec2 point, origin, direction;
    uniform float dt, aspect, inject, clock;
    void main(){
      vec2 q=uv-point; q.x*=aspect;
      float influence=exp(-dot(q,q)*85.);
      vec2 curl=vec2(sin(uv.y*19.+clock),cos(uv.x*17.-clock));
      vec2 flow=curl*.009+direction*influence*.12;
      vec4 ink=texture2D(field,clamp(uv-flow*dt,vec2(0.),vec2(1.)))*exp(-dt*1.65);
      vec2 segment=point-origin; segment.x*=aspect;
      vec2 start=uv-origin; start.x*=aspect;
      vec2 nearest=start-segment*clamp(dot(start,segment)/max(dot(segment,segment),.00001),0.,1.);
      float brush=exp(-dot(nearest,nearest)*900.)*inject*.48;
      vec3 pigment=mix(vec3(.18,.85,1.),vec3(.62,.28,1.),.5+.5*sin(clock*.7));
      ink.rgb+=pigment*brush; ink.a+=brush;
      gl_FragColor=clamp(ink,0.,1.);
    }`;
  const display = 'precision mediump float; varying vec2 uv; uniform sampler2D field; void main(){gl_FragColor=texture2D(field,uv);}';
  const shaders: WebGLShader[] = [], programs: WebGLProgram[] = [];
  const textures: WebGLTexture[] = [], buffers: WebGLFramebuffer[] = [];
  let quad: WebGLBuffer | null = null;
  function program(source: string) {
    function compile(type: number, text: string) {
      const shader=gl!.createShader(type); if(!shader) throw Error('Shader unavailable');
      shaders.push(shader); gl!.shaderSource(shader,text); gl!.compileShader(shader);
      if(!gl!.getShaderParameter(shader,gl!.COMPILE_STATUS)) throw Error('Shader compilation failed');
      return shader;
    }
    const result=gl!.createProgram(); if(!result) throw Error('Program unavailable'); programs.push(result);
    gl!.attachShader(result,compile(gl!.VERTEX_SHADER,vertex));gl!.attachShader(result,compile(gl!.FRAGMENT_SHADER,source));gl!.linkProgram(result);
    if(!gl!.getProgramParameter(result,gl!.LINK_STATUS))throw Error('Program linking failed');return result;
  }
  const controller=new AbortController(); const {signal}=controller;
  let frame=0,timer=0,last=0,lastInput=-Infinity,index=0,pending=false,disposed=false,interval=1000/30;
  let x=.5,y=.5,dx=0,dy=0,previousX=.5,previousY=.5,brushX=.5,brushY=.5;
  function stop(){cancelAnimationFrame(frame);frame=0;}
  function release(){if(disposed)return;stop();clearTimeout(timer);controller.abort();for(const t of textures)gl!.deleteTexture(t);for(const f of buffers)gl!.deleteFramebuffer(f);for(const p of programs)gl!.deleteProgram(p);for(const s of shaders)gl!.deleteShader(s);if(quad)gl!.deleteBuffer(quad);disposed=true;}
  try {
    const simulation=program(fragment),screen=program(display);
    quad=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,quad);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
    for(let i=0;i<2;i++) {const t=gl.createTexture(),f=gl.createFramebuffer();if(!t||!f)throw Error('Texture unavailable');textures.push(t);buffers.push(f);}
    function use(p:WebGLProgram){gl!.useProgram(p);const a=gl!.getAttribLocation(p,'p');gl!.enableVertexAttribArray(a);gl!.vertexAttribPointer(a,2,gl!.FLOAT,false,0,0);gl!.uniform1i(gl!.getUniformLocation(p,'field'),0);}
    function clear(){for(const f of [...buffers,null]){gl!.bindFramebuffer(gl!.FRAMEBUFFER,f);gl!.clearColor(0,0,0,0);gl!.clear(gl!.COLOR_BUFFER_BIT);}pending=false;}
    function resize(){
      stop(); const cap=innerWidth<900?512:768;const scale=Math.min(1,cap/Math.max(innerWidth,innerHeight));
      canvas!.width=Math.max(1,Math.round(innerWidth*scale));canvas!.height=Math.max(1,Math.round(innerHeight*scale));
      gl!.viewport(0,0,canvas!.width,canvas!.height);
      textures.forEach((texture,i)=>{gl!.bindTexture(gl!.TEXTURE_2D,texture);gl!.texParameteri(gl!.TEXTURE_2D,gl!.TEXTURE_MIN_FILTER,gl!.LINEAR);gl!.texParameteri(gl!.TEXTURE_2D,gl!.TEXTURE_MAG_FILTER,gl!.LINEAR);gl!.texParameteri(gl!.TEXTURE_2D,gl!.TEXTURE_WRAP_S,gl!.CLAMP_TO_EDGE);gl!.texParameteri(gl!.TEXTURE_2D,gl!.TEXTURE_WRAP_T,gl!.CLAMP_TO_EDGE);gl!.texImage2D(gl!.TEXTURE_2D,0,gl!.RGBA,canvas!.width,canvas!.height,0,gl!.RGBA,gl!.UNSIGNED_BYTE,null);gl!.bindFramebuffer(gl!.FRAMEBUFFER,buffers[i]);gl!.framebufferTexture2D(gl!.FRAMEBUFFER,gl!.COLOR_ATTACHMENT0,gl!.TEXTURE_2D,texture,0);if(gl!.checkFramebufferStatus(gl!.FRAMEBUFFER)!==gl!.FRAMEBUFFER_COMPLETE)throw Error('Framebuffer unavailable');});clear();
    }
    function render(time:number){
      frame=0;if(disposed||document.hidden||reduced.matches||coarse.matches)return;
      if(time-lastInput>2800){clear();return;}
      const elapsed=time-last;if(elapsed>=interval){
        if(elapsed>85)interval=50;
        const delta=Math.min(elapsed/1000,.08);last=time;
        gl!.activeTexture(gl!.TEXTURE0);gl!.bindTexture(gl!.TEXTURE_2D,textures[index]);gl!.bindFramebuffer(gl!.FRAMEBUFFER,buffers[1-index]);use(simulation);
        const u=(name:string)=>gl!.getUniformLocation(simulation,name);
        gl!.uniform2f(u('point'),x,y);gl!.uniform2f(u('origin'),brushX,brushY);gl!.uniform2f(u('direction'),dx,dy);gl!.uniform1f(u('dt'),delta);gl!.uniform1f(u('aspect'),canvas!.width/canvas!.height);gl!.uniform1f(u('inject'),pending?1:0);gl!.uniform1f(u('clock'),time*.001);gl!.drawArrays(gl!.TRIANGLES,0,6);index=1-index;pending=false;brushX=x;brushY=y;
        gl!.bindFramebuffer(gl!.FRAMEBUFFER,null);gl!.bindTexture(gl!.TEXTURE_2D,textures[index]);use(screen);gl!.drawArrays(gl!.TRIANGLES,0,6);
      }
      frame=requestAnimationFrame(render);
    }
    window.addEventListener('pointermove',event=>{
      if(event.pointerType==='touch'||document.hidden||reduced.matches||coarse.matches||disposed)return;
      x=event.clientX/innerWidth;y=1-event.clientY/innerHeight;dx=Math.max(-.25,Math.min(.25,x-previousX));dy=Math.max(-.25,Math.min(.25,y-previousY));previousX=x;previousY=y;pending=true;lastInput=performance.now();
      if(!frame){brushX=x;brushY=y;last=lastInput-interval;frame=requestAnimationFrame(render);}
    },{passive:true,signal});
    window.addEventListener('resize',()=>{clearTimeout(timer);timer=window.setTimeout(()=>{try{resize();}catch{release();}},150);},{passive:true,signal});
    const pause=()=>{stop();clear();};document.addEventListener('visibilitychange',pause,{signal});window.addEventListener('scroll',pause,{passive:true,signal});
    reduced.addEventListener('change',pause,{signal});coarse.addEventListener('change',pause,{signal});
    canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();release();},{signal});
    resize();
  } catch {release();}
  return release;
}
