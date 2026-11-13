import { useEffect, useRef } from "react";

const COLORS = ["#4B9CD3", "#4B9CD3", "#4B9CD3", "#3D8EC8", "#7EB6E0", "#13294B", "#E7F3FB", "#13294B"];

export default function PixelWave({ reduced, onCovered, onDone }) {
  const canvasRef = useRef(null);
  const coveredRef = useRef(onCovered);
  const doneRef = useRef(onDone);
  coveredRef.current = onCovered;
  doneRef.current = onDone;

  useEffect(() => {
    if (reduced) {
      coveredRef.current();
      const timer = window.setTimeout(() => doneRef.current(), 320);
      return () => window.clearTimeout(timer);
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: true });
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const size = width < 700 ? 14 : 18;
    const cols = Math.ceil(width / size);
    const rows = Math.ceil(height / size);
    const cells = [];
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < cols; x += 1) {
        const delay = x * 13 + Math.sin(y * 0.62) * 46 + Math.cos(x * 0.18 + y * 0.1) * 16;
        cells.push({
          x: x * size,
          y: y * size,
          delay,
          color: COLORS[(x * 3 + y * 7) % COLORS.length],
        });
      }
    }
    let min = Infinity;
    let max = 0;
    for (const cell of cells) {
      min = Math.min(min, cell.delay);
      max = Math.max(max, cell.delay);
    }
    for (const cell of cells) cell.delay -= min;
    const coverAt = max - min + 150;
    const hold = 160;
    const end = coverAt + hold + 780;
    const start = performance.now();
    let raf = 0;
    let covered = false;

    const tick = (now) => {
      const t = now - start;
      ctx.clearRect(0, 0, width, height);
      for (const cell of cells) {
        const grow = Math.min(1, Math.max(0, (t - cell.delay) / 120));
        let shrink = 1;
        if (t > coverAt + hold) {
          const clearDelay = cell.delay * 0.45;
          shrink = 1 - Math.min(1, Math.max(0, (t - coverAt - hold - clearDelay) / 260));
        }
        const p = grow * shrink;
        if (p <= 0) continue;
        const draw = (size + 3) * p;
        const inset = (size - draw) / 2;
        ctx.globalAlpha = Math.min(1, 0.25 + p);
        ctx.fillStyle = cell.color;
        ctx.fillRect(cell.x + inset, cell.y + inset, draw, draw);
      }
      ctx.globalAlpha = 1;

      if (!covered && t >= coverAt) {
        covered = true;
        coveredRef.current();
      }
      if (t < end) raf = requestAnimationFrame(tick);
      else doneRef.current();
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  if (reduced) return <div className="wave-fade" aria-hidden="true" />;
  return <canvas ref={canvasRef} className="wave" aria-hidden="true" />;
}
