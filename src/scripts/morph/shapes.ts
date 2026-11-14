/**
 * Formas do método (6 etapas). Motor criado por Nariely Marques (protótipo vnbueno-digital),
 * adaptado à VN Bueno Digital. Cada forma é uma nuvem de N pontos na mesma ordem de índice,
 * para que o shader transforme uma na outra; pontos consecutivos próximos viram linhas.
 */
export const SHAPES = ["field", "network", "type", "lattice", "flow", "knot"] as const;
export type ShapeName = (typeof SHAPES)[number];

/** Distância máxima entre pontos consecutivos para haver linha (0 = sem linhas). */
export const LINE_THRESHOLD: Record<ShapeName, number> = {
  field: 1.1, network: 1.1, type: 0, lattice: 1.1, flow: 1.1, knot: 0.9,
};


function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
type Seg = [number, number, number, number, number, number];

function alongSegments(segs: Seg[], n: number, out: Float32Array, start: number, jitter = 0, r = Math.random) {
  const lens = segs.map(([a, b, c, d, e, f]) => Math.hypot(d - a, e - b, f - c));
  const total = lens.reduce((s, l) => s + l, 0) || 1;
  const counts = lens.map((l) => Math.floor((l / total) * n));
  let rest = n - counts.reduce((s, c) => s + c, 0);
  for (let i = 0; rest > 0; i = (i + 1) % counts.length, rest--) counts[i]++;
  let k = start;
  segs.forEach(([a, b, c, d, e, f], si) => {
    const cnt = counts[si];
    for (let j = 0; j < cnt; j++) {
      const t = cnt === 1 ? 0.5 : j / (cnt - 1);
      out[k * 3] = a + (d - a) * t + (r() - 0.5) * jitter;
      out[k * 3 + 1] = b + (e - b) * t + (r() - 0.5) * jitter;
      out[k * 3 + 2] = c + (f - c) * t + (r() - 0.5) * jitter;
      k++;
    }
  });
  return k;
}
const rect = (x: number, y: number, z: number, w: number, h: number): Seg[] => {
  const [x0, x1, y0, y1] = [x - w / 2, x + w / 2, y - h / 2, y + h / 2];
  return [[x0, y0, z, x1, y0, z], [x1, y0, z, x1, y1, z], [x1, y1, z, x0, y1, z], [x0, y1, z, x0, y0, z]];
};

// Pórticos arquitetônicos
function lattice(n: number) {
  const out = new Float32Array(n * 3);
  const segs: Seg[] = [];
  const W = 9, Y0 = -2.5, Y1 = 3.6, Z0 = 8, STEP = 5, K = 8;
  for (let k = 0; k < K; k++) {
    const z = Z0 - k * STEP;
    segs.push(...rect(0, (Y0 + Y1) / 2, z, W, Y1 - Y0));
    if (k % 2 === 0) segs.push([-W / 2, 1.9, z, W / 2, 1.9, z]);
    if (k % 3 === 1) segs.push([-1.6, Y0, z, -1.6, 1.9, z], [1.6, Y0, z, 1.6, 1.9, z]);
  }
  const zEnd = Z0 - (K - 1) * STEP;
  for (const [x, y] of [[-W / 2, Y0], [W / 2, Y0], [-W / 2, Y1], [W / 2, Y1]]) segs.push([x, y, Z0, x, y, zEnd]);
  for (let x = -3; x <= 3; x += 1.5) segs.push([x, Y0, Z0, x, Y0, zEnd]);
  alongSegments(segs, n, out, 0, 0.03, rng(1));
  return out;
}
// Nós e conexões
function network(n: number) {
  const out = new Float32Array(n * 3);
  const r = rng(3);
  const nodes: [number, number, number][] = [];
  for (let i = 0; i < 46; i++) {
    const u = r() * Math.PI * 2, v = Math.acos(2 * r() - 1), rad = 0.45 + Math.cbrt(r()) * 0.55;
    nodes.push([Math.sin(v) * Math.cos(u) * 9 * rad, Math.cos(v) * 4.8 * rad + 0.5, Math.sin(v) * Math.sin(u) * 6 * rad - 2]);
  }
  const segs: Seg[] = [];
  nodes.forEach((a, i) => {
    nodes
      .map((b, j) => [j, Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])] as const)
      .filter(([j]) => j !== i)
      .sort((p, q) => p[1] - q[1])
      .slice(0, 2)
      .forEach(([j]) => j > i && segs.push([...a, ...nodes[j]] as Seg));
    if (i % 7 === 0) segs.push([...a, ...nodes[(i * 13 + 5) % nodes.length]] as Seg);
  });
  const nEdges = Math.floor(n * 0.78);
  alongSegments(segs, nEdges, out, 0, 0.02, r);
  for (let k = nEdges; k < n; k++) {
    const c = nodes[k % nodes.length];
    out.set([c[0] + (r() - 0.5) * 0.55, c[1] + (r() - 0.5) * 0.55, c[2] + (r() - 0.5) * 0.55], k * 3);
  }
  return out;
}
// Tipografia (amostrada de um canvas 2D)
async function type(n: number, text: string) {
  const out = new Float32Array(n * 3);
  const r = rng(4);
  const W = 1024, H = 512;
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const ctx = cv.getContext("2d", { willReadFrequently: true });
  const pts: number[] = [];
  if (ctx) {
    try {
      await document.fonts?.load('700 400px "Space Grotesk Variable"');
      await document.fonts?.ready;
    } catch {}
    const fam = getComputedStyle(document.documentElement).getPropertyValue("--font-display").trim() || "sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `700 400px ${fam}`;
    ctx.fillText(text, W / 2, H / 2 + 20);
    const d = ctx.getImageData(0, 0, W, H).data;
    for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 2) if (d[(y * W + x) * 4 + 3] > 128) pts.push(x, y);
  }
  const count = pts.length / 2;
  for (let k = 0; k < n; k++) {
    if (!count) {
      out.set([(r() - 0.5) * 20, (r() - 0.5) * 8, -2], k * 3);
      continue;
    }
    const j = Math.floor(r() * count);
    out.set([(pts[j * 2] / W - 0.5) * 22, -(pts[j * 2 + 1] / H - 0.5) * 11 + 0.4, (r() - 0.5) * 1.4 - 2], k * 3);
  }
  return out;
}
// Fluxograma / organograma
function flow(n: number) {
  const out = new Float32Array(n * 3);
  const segs: Seg[] = [];
  const levels = [
    { y: 4.6, xs: [0], w: 4, h: 1.5 },
    { y: 0.9, xs: [-7.5, 0, 7.5], w: 3.6, h: 1.3 },
    { y: -2.7, xs: [-11, -6.6, -2.2, 2.2, 6.6, 11], w: 2.8, h: 1.1 },
  ];
  levels.forEach((lv, li) => lv.xs.forEach((x, i) => segs.push(...rect(x, lv.y, -2 + ((i + li) % 2) * 1.6, lv.w, lv.h))));
  for (let li = 1; li < levels.length; li++) {
    const up = levels[li - 1], lv = levels[li];
    lv.xs.forEach((x, i) => {
      const px = up.xs[Math.floor((i / lv.xs.length) * up.xs.length)];
      const yTop = up.y - up.h / 2, yBot = lv.y + lv.h / 2, ym = (yTop + yBot) / 2;
      segs.push([px, yTop, -1.2, px, ym, -1.2], [px, ym, -1.2, x, ym, -1.2], [x, ym, -1.2, x, yBot, -1.2]);
    });
  }
  segs.push([-13, -5.4, -1, 13, -5.4, -1]);
  for (let x = -12; x <= 12; x += 3) segs.push([x - 0.4, -5.0, -1, x, -5.4, -1], [x, -5.4, -1, x - 0.4, -5.8, -1]);
  alongSegments(segs, n, out, 0, 0.02, rng(5));
  return out;
}
// Nó contínuo (estrutura integrada)
function knot(n: number) {
  const out = new Float32Array(n * 3);
  const f = (t: number) => {
    const s = 4.6 + 1.9 * Math.cos(3 * t);
    return [s * Math.cos(2 * t), 1.9 * Math.sin(3 * t) * 1.3 + 0.3, s * Math.sin(2 * t) - 1];
  };
  for (let k = 0; k < n; k++) {
    const t = (k / n) * Math.PI * 2;
    const p = f(t), q = f(t + 0.001);
    const T = [q[0] - p[0], q[1] - p[1], q[2] - p[2]];
    const tl = Math.hypot(...T) || 1;
    T[0] /= tl; T[1] /= tl; T[2] /= tl;
    const nl = Math.hypot(T[2], T[0]) || 1;
    const N = [T[2] / nl, 0, -T[0] / nl];
    const B = [T[1] * N[2] - T[2] * N[1], T[2] * N[0] - T[0] * N[2], T[0] * N[1] - T[1] * N[0]];
    const a = k * 0.85, rad = 0.55;
    out.set([0, 1, 2].map((i) => p[i] + (Math.cos(a) * N[i] + Math.sin(a) * B[i]) * rad), k * 3);
  }
  return out;
}
// Molduras suspensas (interfaces / projetos)
function field(n: number) {
  const out = new Float32Array(n * 3);
  const r = rng(9);
  const segs: Seg[] = [];
  const ratios = [1.6, 0.8, 1.33, 1, 2.1, 0.75];
  for (let i = 0; i < 16; i++) {
    const h = 1.6 + r() * 2.4, w = h * ratios[i % ratios.length];
    const x = (r() - 0.5) * 26, y = (r() - 0.5) * 11, z = -2 - r() * 22;
    segs.push(...rect(x, y, z, w, h), [x - w / 2, y - h / 2, z, x + w / 2, y + h / 2, z]);
  }
  alongSegments(segs, n, out, 0, 0.02, r);
  return out;
}

export async function buildShapes(n: number, text = "VN"): Promise<Record<ShapeName, Float32Array>> {
  return {
    field: field(n),
    network: network(n),
    type: await type(n, text),
    lattice: lattice(n),
    flow: flow(n),
    knot: knot(n),
  };
}
