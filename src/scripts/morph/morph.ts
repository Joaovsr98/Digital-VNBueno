/**
 * Malha de partículas que se transforma entre as formas do método.
 * Motor criado por Nariely Marques (protótipo vnbueno-digital), adaptado às cores da VN Bueno Digital.
 * 1 draw call de pontos + 1 de linhas, fundo transparente. Pausa fora da tela;
 * com "reduzir movimento" desenha um quadro parado.
 */
import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, LineSegments, PerspectiveCamera, Points, Scene, ShaderMaterial, Vector3, WebGLRenderer } from "three";
import { buildShapes, LINE_THRESHOLD, SHAPES, type ShapeName } from "./shapes";

export interface MorphOptions {
  mobile: boolean;
  reduced: boolean;
  offsetX?: number;
  initial: ShapeName;
}

// ── câmera e cores por forma ──
type Shot = { pos: [number, number, number]; look: [number, number, number]; colors: [string, string] };
const AZUL = "#60a5fa", VIOLETA = "#a78bfa", CIANO = "#22d3ee", PRATA = "#cbd5e1";
const SHOTS: Record<ShapeName, Shot> = {
  field: { pos: [2, 0.5, 14], look: [0, 0, -9], colors: [PRATA, VIOLETA] },
  network: { pos: [3, 2.2, 14.5], look: [0, 0.5, -2], colors: [VIOLETA, AZUL] },
  type: { pos: [0, 0.6, 15], look: [0, 0.3, -2], colors: [AZUL, VIOLETA] },
  lattice: { pos: [3.5, 2.2, 22], look: [0, 0.5, -6], colors: [AZUL, PRATA] },
  flow: { pos: [0, 4, 17], look: [0, 0, -2], colors: [CIANO, AZUL] },
  knot: { pos: [4, 1.6, 13], look: [0, 0.2, -1], colors: [VIOLETA, CIANO] },
};
const GROUP = ["#60a5fa", "#a78bfa", "#cbd5e1", "#22d3ee", "#e2e8f0", "#818cf8"].map((h) => new Color(h));

const noise = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const common = /* glsl */ `
uniform vec4 uF0; uniform vec4 uF1; uniform vec4 uT0; uniform vec4 uT1;
uniform float uMix; uniform float uTime; uniform float uBurst; uniform vec2 uMouse; uniform float uMouseForce; uniform float uAspect;
uniform vec3 uTintA; uniform vec3 uTintB; uniform vec3 uGroup[6];
attribute vec3 s1; attribute vec3 s2; attribute vec3 s3; attribute vec3 s4; attribute vec3 s5;
attribute vec4 aRand;
varying vec3 vColor; varying float vAlpha;
${noise}
vec4 W0; vec4 W1;
vec3 morphed(out float m){
  m = smoothstep(0.0, 1.0, clamp(uMix * 1.55 - aRand.x * 0.55, 0.0, 1.0));
  W0 = mix(uF0, uT0, m); W1 = mix(uF1, uT1, m);
  vec3 p = position*W0.x + s1*W0.y + s2*W0.z + s3*W0.w + s4*W1.x + s5*W1.y;
  vec3 q = p * 0.17; float t = uTime * 0.05;
  p += vec3(snoise(q + t), snoise(q + vec3(17.0) + t), snoise(q + vec3(41.0) + t)) * 0.08 * (0.35 + aRand.z);
  p += (aRand.xyz - 0.5) * sin(m * 3.14159) * uBurst * 3.2;
  return p;
}
vec4 place(vec3 p, out float force){
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vec4 clip = projectionMatrix * mv;
  vec2 d = (clip.xy / clip.w - uMouse) * vec2(uAspect, 1.0);
  force = exp(-dot(d, d) * 16.0) * uMouseForce;
  mv.xy += normalize(d + 1e-5) * force * 0.85;
  return mv;
}
vec3 colorAt(vec3 p){
  int g = int(aRand.w + 0.5);
  float t = clamp((p.y + 3.2) / 8.0 + (aRand.y - 0.5) * 0.4, 0.0, 1.0);
  return mix(uGroup[g], mix(uTintA, uTintB, t), 0.7);
}`;

const pointsVertex = /* glsl */ `
uniform float uPixel; uniform float uSize;
${common}
void main(){
  float m; float f;
  vec3 p = morphed(m);
  vec4 mv = place(p, f);
  gl_Position = projectionMatrix * mv;
  float depth = -mv.z;
  gl_PointSize = clamp(uSize * uPixel * (0.5 + aRand.y) * (1.0 + f * 1.4) / depth, 0.0, 14.0 * uPixel);
  vAlpha = smoothstep(0.8, 3.5, depth) * (1.0 - smoothstep(30.0, 60.0, depth)) * (0.35 + aRand.z * 0.65);
  vColor = colorAt(p);
}`;
const pointsFragment = /* glsl */ `
varying vec3 vColor; varying float vAlpha;
void main(){
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.15, d) * vAlpha;
  if (a < 0.01) discard;
  gl_FragColor = vec4(vColor, a);
}`;
const linesVertex = /* glsl */ `
attribute float aVis;
${common}
void main(){
  float m; float f;
  vec3 p = morphed(m);
  vec4 mv = place(p, f);
  gl_Position = projectionMatrix * mv;
  float depth = -mv.z;
  int bits = int(aVis + 0.5);
  float w[6] = float[6](W0.x, W0.y, W0.z, W0.w, W1.x, W1.y);
  float vis = 0.0; float dom = 0.0;
  for (int s = 0; s < 6; s++) { vis += w[s] * float((bits >> s) & 1); dom = max(dom, w[s]); }
  vis *= smoothstep(0.82, 0.985, dom);
  vAlpha = vis * smoothstep(0.8, 4.0, depth) * (1.0 - smoothstep(26.0, 52.0, depth)) * 0.32 * (1.0 - uBurst * 0.6);
  vColor = colorAt(p);
}`;
const linesFragment = /* glsl */ `
varying vec3 vColor; varying float vAlpha;
void main(){ if (vAlpha < 0.004) discard; gl_FragColor = vec4(vColor, vAlpha); }`;

export async function createMorph(canvas: HTMLCanvasElement, opts: MorphOptions) {
  const N = opts.mobile ? 5000 : 11000;
  const L = opts.mobile ? 1800 : 3600;
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: !opts.mobile, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, opts.mobile ? 1.5 : 1.75));
  renderer.setClearColor(0x000000, 0);
  const scene = new Scene();
  const camera = new PerspectiveCamera(42, 1, 0.1, 140);

  const shapes = await buildShapes(N, "VN");
  const arrs = SHAPES.map((s) => shapes[s]);
  const rand = new Float32Array(N * 4);
  for (let i = 0; i < N; i++) rand.set([Math.random(), Math.random(), Math.random(), i % 6], i * 4);

  const v4 = () => ({ value: [0, 0, 0, 0] as number[] });
  const uniforms = {
    uF0: v4(), uF1: v4(), uT0: v4(), uT1: v4(),
    uMix: { value: 1 }, uTime: { value: 0 }, uBurst: { value: 0 },
    uMouse: { value: [0, 0] }, uMouseForce: { value: 0 }, uAspect: { value: 1 },
    uTintA: { value: new Color(SHOTS[opts.initial].colors[0]) }, uTintB: { value: new Color(SHOTS[opts.initial].colors[1]) },
    uGroup: { value: GROUP }, uPixel: { value: renderer.getPixelRatio() }, uSize: { value: opts.mobile ? 30 : 26 },
  };

  const pg = new BufferGeometry();
  pg.setAttribute("position", new BufferAttribute(arrs[0], 3));
  for (let s = 1; s < SHAPES.length; s++) pg.setAttribute(`s${s}`, new BufferAttribute(arrs[s], 3));
  pg.setAttribute("aRand", new BufferAttribute(rand, 4));
  const pm = new ShaderMaterial({ uniforms, vertexShader: pointsVertex, fragmentShader: pointsFragment, transparent: true, depthWrite: false, blending: AdditiveBlending });
  const points = new Points(pg, pm);
  points.frustumCulled = false;
  scene.add(points);

  const lg = new BufferGeometry();
  const lpos = SHAPES.map(() => new Float32Array(L * 6));
  const vis = new Float32Array(L * 2);
  const lr = new Float32Array(L * 8);
  for (let k = 0; k < L; k++) {
    const i = Math.floor((k * (N - 2)) / (L - 1));
    for (let e = 0; e < 2; e++) {
      const v = k * 2 + e;
      SHAPES.forEach((name, s) => {
        const a = arrs[s];
        lpos[s].set(a.subarray((i + e) * 3, (i + e) * 3 + 3), v * 3);
        const d = Math.hypot(a[i * 3] - a[i * 3 + 3], a[i * 3 + 1] - a[i * 3 + 4], a[i * 3 + 2] - a[i * 3 + 5]);
        if (d < LINE_THRESHOLD[name]) vis[v] += 1 << s;
      });
      lr.set(rand.subarray(i * 4, i * 4 + 4), v * 4);
    }
  }
  lg.setAttribute("position", new BufferAttribute(lpos[0], 3));
  for (let s = 1; s < SHAPES.length; s++) lg.setAttribute(`s${s}`, new BufferAttribute(lpos[s], 3));
  lg.setAttribute("aRand", new BufferAttribute(lr, 4));
  lg.setAttribute("aVis", new BufferAttribute(vis, 1));
  const lm = new ShaderMaterial({ uniforms, vertexShader: linesVertex, fragmentShader: linesFragment, transparent: true, depthWrite: false, blending: AdditiveBlending });
  const lines = new LineSegments(lg, lm);
  lines.frustumCulled = false;
  scene.add(lines);

  // ── estado ──
  const weights = (name: ShapeName) => {
    const w = new Array(8).fill(0);
    w[SHAPES.indexOf(name)] = 1;
    return w;
  };
  let from = weights(opts.initial), to = weights(opts.initial);
  let current = opts.initial, mix = 1, burst = opts.reduced ? 0 : 0.8, time = 0;
  const tintA = new Color(SHOTS[current].colors[0]), tintB = new Color(SHOTS[current].colors[1]);
  const camPos = new Vector3(...SHOTS[current].pos), camLook = new Vector3(...SHOTS[current].look);
  const wantPos = new Vector3(), wantLook = new Vector3(), right = new Vector3(), fwd = new Vector3();
  if (!opts.reduced) camPos.z += 12;
  const mouse = { x: 0, y: 0, tx: 0, ty: 0, inside: 0, f: 0 };

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const r = canvas.getBoundingClientRect();
    mouse.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
    mouse.ty = -((e.clientY - r.top) / r.height) * 2 + 1;
    mouse.inside = Math.abs(mouse.tx) <= 1 && Math.abs(mouse.ty) <= 1 ? 1 : 0;
  };
  window.addEventListener("pointermove", onMove, { passive: true });

  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = camera.aspect < 1 ? 52 : 42;
    camera.updateProjectionMatrix();
    uniforms.uAspect.value = camera.aspect;
    uniforms.uPixel.value = renderer.getPixelRatio();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  let visible = true, raf = 0, last = performance.now(), disposed = false;
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !raf && !disposed) {
      last = performance.now();
      raf = requestAnimationFrame(tick);
    }
  });
  io.observe(canvas);

  const tmpTint = new Color();
  function frame(dt: number) {
    const k = (rate: number) => (opts.reduced ? 1 : 1 - Math.exp(-dt * rate));
    if (!opts.reduced) time += dt;
    mix = Math.min(1, mix + dt / 1.9);
    burst += (0 - burst) * k(1.4);
    const shot = SHOTS[current];
    tintA.lerp(tmpTint.set(shot.colors[0]), k(1.5));
    tintB.lerp(tmpTint.set(shot.colors[1]), k(1.5));

    // câmera: quadro da forma + órbita lenta + paralaxe + recuo no retrato
    wantPos.set(...shot.pos);
    wantLook.set(...shot.look);
    const portrait = camera.aspect < 1;
    fwd.subVectors(wantLook, wantPos).normalize();
    if (portrait) wantPos.addScaledVector(fwd, -6);
    right.crossVectors(fwd, camera.up).normalize();
    const off = portrait ? 0 : opts.offsetX ?? 0;
    wantPos.addScaledVector(right, -off);
    wantLook.addScaledVector(right, -off);
    mouse.x += (mouse.tx * mouse.inside - mouse.x) * k(3);
    mouse.y += (mouse.ty * mouse.inside - mouse.y) * k(3);
    const sway = opts.reduced ? 0 : Math.sin(time * 0.18) * 1.2;
    wantPos.addScaledVector(right, sway + mouse.x * 1.2);
    wantPos.y += mouse.y * 0.7;
    camPos.lerp(wantPos, k(1.8));
    camLook.lerp(wantLook, k(2.2));
    camera.position.copy(camPos);
    camera.lookAt(camLook);

    (["uF0", "uF1"] as const).forEach((n, j) => (uniforms[n].value = from.slice(j * 4, j * 4 + 4)));
    (["uT0", "uT1"] as const).forEach((n, j) => (uniforms[n].value = to.slice(j * 4, j * 4 + 4)));
    uniforms.uMix.value = mix;
    uniforms.uTime.value = time;
    uniforms.uBurst.value = burst;
    mouse.f += ((mouse.inside && !opts.mobile && !opts.reduced ? 1 : 0) - mouse.f) * k(3);
    uniforms.uMouse.value = [mouse.x, mouse.y];
    uniforms.uMouseForce.value = mouse.f;
    uniforms.uTintA.value.copy(tintA);
    uniforms.uTintB.value.copy(tintB);
    renderer.render(scene, camera);
  }
  function tick(now: number) {
    raf = 0;
    if (disposed) return;
    const dt = Math.max(0, Math.min(0.05, (now - last) / 1000));
    last = now;
    frame(dt);
    if (visible && !opts.reduced) raf = requestAnimationFrame(tick);
  }
  raf = requestAnimationFrame(tick);

  return {
    setShape(name: ShapeName) {
      if (name === current) return;
      // o ponto de partida é o estado atual (mesmo no meio de uma transição)
      from = from.map((f, i) => f + (to[i] - f) * mix);
      to = weights(name);
      current = name;
      mix = opts.reduced ? 1 : 0;
      burst = opts.reduced ? 0 : Math.max(burst, 0.55);
      if (opts.reduced) frame(0);
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      pg.dispose();
      lg.dispose();
      pm.dispose();
      lm.dispose();
      renderer.dispose();
    },
  };
}
