import { frameLoop } from './frameLoop';
import { readPalette } from './palette';
import { FRAGMENT_SHADER, VERTEX_SHADER } from './tideShader';

/** Pixel-ratio ceiling: the shader cost grows with the square of it. */
const MAX_DPR = 1.5;
/** Frame budget; ambient motion this slow reads the same at 30 fps. */
const FRAME_MS = 1000 / 30 - 1;
/** Share of the gap the smoothed cursor closes per 60 fps frame. */
const POINTER_EASE = 0.06;

/** The shader's colours, read from palette.css so the backdrop follows the brand. */
const PALETTE = {
  u_base: '--palette-sidebar',
  u_deep: '--palette-accent-dark',
  u_mid: '--palette-accent',
  u_light: '--palette-accent-light',
};

const compile = (gl: WebGLRenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  gl.deleteShader(shader);
  return null;
};

const createProgram = (gl: WebGLRenderingContext) => {
  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  if (!vertex || !fragment) return null;
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (gl.getProgramParameter(program, gl.LINK_STATUS)) return program;
  gl.deleteProgram(program);
  return null;
};

/**
 * Starts the tide backdrop on `canvas`, keeping its calm centre behind
 * `anchor`. Returns the teardown. When WebGL, the shader or the palette is
 * unavailable it returns early and the canvas stays hidden, leaving the CSS
 * gradient underneath as the backdrop.
 *
 * The canvas gets `data-ready` after its first frame so CSS can fade it in.
 */
export function mountTide(canvas: HTMLCanvasElement, anchor: HTMLElement): () => void {
  const noop = () => undefined;
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false });
  if (!gl) return noop;

  const colors = readPalette(PALETTE);
  if (!colors) return noop;

  const program = createProgram(gl);
  if (!program) return noop;
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'a_pos');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  for (const [uniform, [r, g, b]] of Object.entries(colors)) {
    gl.uniform3f(gl.getUniformLocation(program, uniform), r / 255, g / 255, b / 255);
  }
  const uTime = gl.getUniformLocation(program, 'u_time');
  const uRes = gl.getUniformLocation(program, 'u_res');
  const uMouse = gl.getUniformLocation(program, 'u_mouse');
  const uCenter = gl.getUniformLocation(program, 'u_center');

  const target = { x: 0, y: 0 };
  const pointer = { x: 0, y: 0 };
  const start = performance.now();
  let needsResize = true;
  let lastDraw = 0;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
    const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
    gl.uniform2f(uRes, width, height);

    // Same space as the shader's uv: origin at the canvas centre, y up, one
    // unit per canvas height. Offsets rather than client rects, so the
    // scroll-linked transforms on the hero do not drag the centre along; this
    // assumes the canvas covers the anchor's offset parent (the hero section).
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const cx = anchor.offsetLeft + anchor.offsetWidth / 2 - w / 2;
    const cy = anchor.offsetTop + anchor.offsetHeight / 2 - h / 2;
    gl.uniform2f(uCenter, cx / h, -cy / h);
    needsResize = false;
  };

  const draw = (now: number) => {
    if (needsResize) resize();
    const step = lastDraw === 0 ? 1 : (now - lastDraw) / (1000 / 60);
    const ease = Math.min(1, step * POINTER_EASE);
    pointer.x += (target.x - pointer.x) * ease;
    pointer.y += (target.y - pointer.y) * ease;
    lastDraw = now;
    gl.uniform2f(uMouse, pointer.x, pointer.y);
    gl.uniform1f(uTime, (now - start) / 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    canvas.dataset.ready = '';
  };

  const loop = frameLoop(canvas, draw, FRAME_MS);

  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType === 'touch' || loop.reduced) return;
    target.x = (event.clientX / window.innerWidth) * 2 - 1;
    target.y = -((event.clientY / window.innerHeight) * 2 - 1);
  };

  const onContextLost = () => {
    loop.stop();
    delete canvas.dataset.ready;
  };

  const resizeObserver = new ResizeObserver(() => {
    needsResize = true;
    loop.redraw();
  });
  resizeObserver.observe(canvas);
  resizeObserver.observe(anchor);

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  canvas.addEventListener('webglcontextlost', onContextLost);

  return () => {
    loop.stop();
    resizeObserver.disconnect();
    window.removeEventListener('pointermove', onPointerMove);
    canvas.removeEventListener('webglcontextlost', onContextLost);
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
  };
}
