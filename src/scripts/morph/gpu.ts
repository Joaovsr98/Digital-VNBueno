// Decide se vale rodar a cena 3D. Sem isso, em máquina sem placa de vídeo (renderização
// por software, como o Chrome do PageSpeed/Lighthouse) cada quadro vira trabalho pesado
// no processador e a página parece travada (TBT alto). Nesses casos fica a ilustração estática.
let resposta: boolean | undefined;
export function podeAnimar3D(): boolean {
  if (resposta === undefined) resposta = testar();
  return resposta;
}
function testar(): boolean {
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    if (!gl) return false;
    const info = gl.getExtension('WEBGL_debug_renderer_info');
    const placa = String(info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return !/swiftshader|llvmpipe|softpipe|software|basic render|microsoft basic/i.test(placa);
  } catch {
    return false;
  }
}

// Começa no primeiro sinal de uso (mouse, toque, rolagem, teclado) ou depois de `espera` ms,
// o que vier primeiro. Assim a abertura da página fica livre para o texto e os botões.
export function aoInteragir(fn: () => void, espera = 6000) {
  let feito = false;
  const eventos = ['pointermove', 'pointerdown', 'wheel', 'keydown', 'touchstart'] as const;
  const ir = () => {
    if (feito) return;
    feito = true;
    eventos.forEach((e) => window.removeEventListener(e, ir));
    window.clearTimeout(t);
    fn();
  };
  eventos.forEach((e) => window.addEventListener(e, ir, { passive: true, once: true }));
  const t = window.setTimeout(ir, espera);
}
