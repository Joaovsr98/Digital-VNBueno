// Cena de partículas da seção "Como trabalhamos": cada etapa do método tem uma forma.
// Leve por padrão: o Three.js (chunk separado) só é baixado quando a seção chega perto da tela.
import type { ShapeName } from './morph/shapes';
import { podeAnimar3D } from './morph/gpu';

const FORMAS: ShapeName[] = ['field', 'network', 'type', 'lattice', 'flow', 'knot'];
const INTERVALO = 5200;

const cena = document.getElementById('metodo-cena');
const canvas = cena?.querySelector('canvas');
const legenda = cena?.querySelector<HTMLElement>('[data-legenda]');
const cards = Array.from(document.querySelectorAll<HTMLElement>('#metodo-etapas [data-etapa]'));

if (cena && canvas && legenda && cards.length === FORMAS.length) {
  const titulos = cards.map((c) => c.querySelector('h3')?.textContent?.trim() ?? '');
  const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;

  const marcar = (i: number) => {
    legenda.textContent = `${String(i + 1).padStart(2, '0')} / 0${FORMAS.length} · ${titulos[i]}`;
    cards.forEach((c, j) => c.classList.toggle('etapa-ativa', j === i));
  };

  const iniciar = async () => {
    if (!podeAnimar3D()) return;
    const { createMorph } = await import('./morph/morph');
    const api = await createMorph(canvas, { mobile, reduced: reduzido, initial: FORMAS[0] });
    canvas.classList.remove('opacity-0');
    cena.querySelector('.metodo-fallback')?.classList.add('opacity-0');

    let atual = 0;
    let pausadoAte = 0;
    const ir = (i: number) => {
      atual = i;
      api.setShape(FORMAS[i]);
      marcar(i);
    };
    marcar(0);

    // passar o mouse ou tocar numa etapa mostra a forma dela e segura o ciclo por um tempo
    cards.forEach((card, i) => {
      const escolher = () => {
        pausadoAte = performance.now() + 9000;
        ir(i);
      };
      card.addEventListener('pointerenter', escolher);
      card.addEventListener('click', escolher);
    });

    if (!reduzido) {
      window.setInterval(() => {
        if (document.hidden || performance.now() < pausadoAte) return;
        ir((atual + 1) % FORMAS.length);
      }, INTERVALO);
    }
  };

  const io = new IntersectionObserver(
    (entradas) => {
      if (!entradas.some((e) => e.isIntersecting)) return;
      io.disconnect();
      iniciar().catch(() => {
        /* sem cena: fica a ilustração estática */
      });
    },
    { rootMargin: '400px 0px' },
  );
  io.observe(cena);
}
