import { useEffect, useRef, useState } from "react";

function easeOutBack(t) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2;
}

function roundRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

const ORBIT = [
  {
    id: "well",
    label: "Old Well",
    svg: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M10 22c1.4-8 6-12 14-12s12.6 4 14 12" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <ellipse cx="24" cy="22" rx="14" ry="4.2" fill="#F2C14E" stroke="currentColor" strokeWidth="2" />
        <rect x="14" y="23" width="4.5" height="12" rx="0.6" fill="#4B9CD3" stroke="currentColor" strokeWidth="1.6" />
        <rect x="29.5" y="23" width="4.5" height="12" rx="0.6" fill="#4B9CD3" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 36.5h24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "tower",
    label: "Bell Tower",
    svg: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M24 4l2.2 5h-4.4z" fill="#F2C14E" />
        <path d="M24 7l9 8H15z" fill="#4B9CD3" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <rect x="17" y="15" width="14" height="18" rx="1" fill="#13294B" stroke="currentColor" strokeWidth="1.7" />
        <path d="M21 19h6v5.2a3 3 0 0 1-6 0z" fill="#F2C14E" />
        <path d="M13 33h22l-2.2 7H15.2z" fill="#4B9CD3" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "computer",
    label: "Computer",
    svg: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <rect x="7" y="8" width="34" height="23" rx="2.5" fill="#E8F4FC" stroke="currentColor" strokeWidth="2" />
        <rect x="10" y="11" width="28" height="15" rx="1" fill="#4B9CD3" />
        <path d="M20 31h8v3h-8z" fill="currentColor" />
        <path d="M13 34.5h22" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "cap",
    label: "Graduation cap",
    svg: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M24 12l16 6-16 6L8 18z" fill="#4B9CD3" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M14 21v6c0 4 4.2 7 10 7s10-3 10-7v-6" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M40 18v11" stroke="#F2C14E" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="40" cy="30.5" r="1.6" fill="#F2C14E" />
      </svg>
    ),
  },
  {
    id: "gear",
    label: "Gear",
    svg: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path
          d="M19.7 13.7 L21.7 9 L26.3 9 L28.3 13.7 L33 11.8 L36.2 15 L34.3 19.7 L39 21.7 L39 26.3 L34.3 28.3 L36.2 33 L33 36.2 L28.3 34.3 L26.3 39 L21.7 39 L19.7 34.3 L15 36.2 L11.8 33 L13.7 28.3 L9 26.3 L9 21.7 L13.7 19.7 L11.8 15 L15 11.8 Z"
          fill="#F2C14E"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <circle cx="24" cy="24" r="4.6" fill="#0B1C33" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    ),
  },
  {
    id: "nc",
    label: "NC",
    svg: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <text x="24" y="31" textAnchor="middle" fill="currentColor" fontFamily="Archivo Black, Arial Black, sans-serif" fontSize="18">
          NC
        </text>
      </svg>
    ),
  },
  {
    id: "book",
    label: "Book",
    svg: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M8 15h12c3.2 0 5 1.6 5 3.4V36c0-1.8-1.8-3.2-5-3.2H8z" fill="#4B9CD3" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M40 15H28c-3.2 0-5 1.6-5 3.4V36c0-1.8 1.8-3.2 5-3.2H40z" fill="#F4F7FB" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      </svg>
    ),
  },
];

function drawBrick(ctx, x, y, s, R, G, B) {
  const pad = Math.max(1, s * 0.08);
  const bx = x + pad;
  const by = y + pad + s * 0.1;
  const bw = s - pad * 2;
  const bh = s - pad * 2 - s * 0.06;
  ctx.fillStyle = `rgb(${R},${G},${B})`;
  roundRect(ctx, bx, by, bw, bh, s * 0.16);
  ctx.fill();
  ctx.fillStyle = "rgba(0,0,0,0.16)";
  ctx.fillRect(bx, by + bh - 1.4, bw, 1.4);
  ctx.fillStyle = `rgb(${Math.min(255, R + 52)},${Math.min(255, G + 44)},${Math.min(255, B + 24)})`;
  ctx.beginPath();
  ctx.arc(x + s / 2, y + s * 0.3, s * 0.15, 0, Math.PI * 2);
  ctx.fill();
}

export default function LegoLoader({ reduced, onEnter }) {
  const canvasRef = useRef(null);
  const [photo, setPhoto] = useState(reduced);
  const locked = useRef(false);

  useEffect(() => {
    if (reduced) return undefined;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let cancel = false;
    let raf = 0;

    (async () => {
      try {
        const data = await fetch("/bricks.json").then((res) => {
          if (!res.ok) throw new Error("brick map missing");
          return res.json();
        });
        if (cancel) return;

        const { cols, rows, brick, bricks } = data;
        const width = cols * brick;
        const height = rows * brick;
        canvas.width = width;
        canvas.height = height;

        const settled = document.createElement("canvas");
        settled.width = width;
        settled.height = height;
        const settledCtx = settled.getContext("2d");
        const landed = new Uint8Array(bricks.length);

        const fall = 420;
        const rowDelay = 32;
        const start = performance.now();
        const maxDelay = (rows - 1) * rowDelay + 16 * 2 + fall;

        const place = (brickRow) => {
          for (let i = 0; i < bricks.length; i += 1) {
            if (landed[i]) continue;
            const [c, r, R, G, B] = bricks[i];
            const delay = (rows - 1 - r) * rowDelay + (c % 3) * 16;
            if ((brickRow - delay) / fall >= 1) {
              landed[i] = 1;
              drawBrick(settledCtx, c * brick, r * brick, brick, R, G, B);
            }
          }
        };

        const frame = (now) => {
          const t = now - start;
          place(t);
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(settled, 0, 0);

          for (let i = 0; i < bricks.length; i += 1) {
            if (landed[i]) continue;
            const [c, r, R, G, B] = bricks[i];
            const delay = (rows - 1 - r) * rowDelay + (c % 3) * 16;
            const raw = (t - delay) / fall;
            if (raw <= 0) continue;
            const y = r * brick + (1 - easeOutBack(Math.min(raw, 1))) * -110;
            drawBrick(ctx, c * brick, y, brick, R, G, B);
          }

          if (t < maxDelay) {
            raf = requestAnimationFrame(frame);
          } else {
            place(maxDelay + fall);
            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(settled, 0, 0);
            window.setTimeout(() => {
              if (!cancel) setPhoto(true);
            }, 220);
          }
        };

        raf = requestAnimationFrame(frame);
      } catch {
        if (!cancel) setPhoto(true);
      }
    })();

    return () => {
      cancel = true;
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  function enter() {
    if (locked.current) return;
    locked.current = true;
    onEnter();
  }

  return (
    <div className="loader">
      <p className="welcome">Welcome to STC's Committee Projects</p>
      <div className="orbit-field">
          <svg className="orbit-track" viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="49.4" fill="none" stroke="#7ec8ef" strokeWidth="0.7" />
          </svg>
          <div className="orbit-spin" aria-hidden="true">
            {ORBIT.map((item, index) => {
              const angle = (360 / ORBIT.length) * index;
              return (
                <div key={item.id} className="orbit-slot" style={{ "--angle": `${angle}deg` }}>
                  <div className="orbit-glyph" title={item.label}>
                    {item.svg}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="stage">
            <div className="brick-window">
              <canvas ref={canvasRef} className={photo ? "bricks hide" : "bricks"} aria-hidden="true" />
              <img
                className={photo ? "ram-photo show" : "ram-photo"}
                src="/rameses.png"
                alt="Rameses running in a UNC cap and a Carolina blue sweater."
              />
            </div>
          </div>
      </div>
      <div className="ready-slot">
        {photo && (
          <button type="button" className="ready" onClick={enter}>
            Discover how STC connects students and tech at UNC
          </button>
        )}
      </div>
      <p className="sr-only">
        {photo
          ? "Rameses is ready. Activate the button to discover how STC connects students and tech at UNC."
          : "Rameses is being stacked out of bricks."}
      </p>
    </div>
  );
}
