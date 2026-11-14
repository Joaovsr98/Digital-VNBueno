// Cena de partículas do topo da home. Começa no "VN" e percorre o que a VN Bueno faz.
// Para não atrasar a abertura da página, o Three.js só é baixado depois do carregamento,
// num momento ocioso do navegador.
import type { ShapeName } from './morph/shapes';
import { aoInteragir, podeAnimar3D } from './morph/gpu';

const CICLO: { forma: ShapeName; rotulo: string }[] = [
  { forma: 'type', rotulo: 'VN Bueno Digital' },
  { forma: 'field', rotulo: 'Sites e landing pages' },
  { forma: 'lattice', rotulo: 'Sistemas sob medida' },
  { forma: 'network', rotulo: 'Integrações e automação' },
  { forma: 'flow', rotulo: 'Gestão e processos' },
  { forma: 'knot', rotulo: 'Suporte contínuo' },
];
const INTERVALO = 5200;

const cena = document.getElementById('topo-cena');
const canvas = cena?.querySelector('canvas');
const legenda = cena?.querySelector<HTMLElement>('[data-legenda]');

async function iniciar() {
  if (!cena || !canvas || !podeAnimar3D()) return;
  const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
  const largo = window.innerWidth >= 1024;

  const { createMorph } = await import('./morph/morph');
  // no computador a forma fica à direita do texto; no celular, centralizada atrás dele
  const api = await createMorph(canvas, { mobile, reduced: reduzido, initial: CICLO[0].forma, offsetX: largo ? 5 : 0 });
  canvas.classList.remove('opacity-0');
  cena.querySelector('.topo-fallback')?.classList.add('opacity-0');

  if (reduzido) return;
  let passo = 0;
  window.setInterval(() => {
    if (document.hidden) return;
    passo = (passo + 1) % CICLO.length;
    api.setShape(CICLO[passo].forma);
    if (legenda) legenda.textContent = `${String(passo + 1).padStart(2, '0')} / 0${CICLO.length} · ${CICLO[passo].rotulo}`;
  }, INTERVALO);
}

const quandoOcioso = (fn: () => void) =>
  'requestIdleCallback' in window ? window.requestIdleCallback(fn, { timeout: 1500 }) : window.setTimeout(fn, 300);

const comecar = () => aoInteragir(() => quandoOcioso(() => iniciar().catch(() => {})));
if (document.readyState === 'complete') comecar();
else window.addEventListener('load', comecar, { once: true });
