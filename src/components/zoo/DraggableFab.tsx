import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";

type DraggableFabProps = {
  children: ReactNode;
  onClick: () => void;
  ariaLabel: string;
  /** Unique key so each button remembers its own position separately. */
  storageKey: string;
  /** Tailwind classes for the default spot (e.g. "bottom-24 right-4") before it's ever moved. */
  defaultPositionClassName: string;
  /** Tailwind classes for background/text color. */
  colorClassName: string;
};

const SIZE = 56; // h-14 w-14
const MARGIN = 8;
const DRAG_THRESHOLD = 6;

function clampToViewport(x: number, y: number) {
  const maxX = window.innerWidth - SIZE - MARGIN;
  const maxY = window.innerHeight - SIZE - MARGIN;
  return {
    x: Math.min(Math.max(MARGIN, x), Math.max(MARGIN, maxX)),
    y: Math.min(Math.max(MARGIN, y), Math.max(MARGIN, maxY)),
  };
}

export function DraggableFab({
  children,
  onClick,
  ariaLabel,
  storageKey,
  defaultPositionClassName,
  colorClassName,
}: DraggableFabProps) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  const drag = useRef({
    dragging: false,
    moved: false,
    startX: 0,
    startY: 0,
    baseX: 0,
    baseY: 0,
  });

  // Restore a saved position after mount so the server-rendered markup
  // (which uses the default bottom/right classes) matches on hydration.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as { x: number; y: number };
        setPos(clampToViewport(parsed.x, parsed.y));
      }
    } catch {
      // ignore corrupt/blocked storage
    }
  }, [storageKey]);

  // Keep the button on-screen if the viewport is resized/rotated.
  useEffect(() => {
    const onResize = () => {
      setPos((prev) => (prev ? clampToViewport(prev.x, prev.y) : prev));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handlePointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    drag.current = {
      dragging: true,
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      baseX: rect.left,
      baseY: rect.top,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d.dragging) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
      d.moved = true;
    }
    if (d.moved) {
      setPos(clampToViewport(d.baseX + dx, d.baseY + dy));
    }
  };

  const handlePointerUp = (e: PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d.dragging) return;
    d.dragging = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    if (d.moved) {
      setPos((prev) => {
        if (prev) {
          try {
            window.localStorage.setItem(storageKey, JSON.stringify(prev));
          } catch {
            // ignore
          }
        }
        return prev;
      });
    } else {
      // A tap/click without meaningful movement — treat as a normal click.
      onClick();
    }
  };

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={pos ? { left: pos.x, top: pos.y, right: "auto", bottom: "auto" } : undefined}
      className={`fixed z-40 grid h-14 w-14 touch-none place-items-center rounded-full shadow-float transition-transform active:scale-90 ${
        pos ? "" : defaultPositionClassName
      } ${colorClassName}`}
    >
      {children}
    </button>
  );
}
