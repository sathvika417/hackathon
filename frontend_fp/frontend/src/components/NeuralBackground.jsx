import React, { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";

/**
 * Full-screen animated neural-network / galaxy particle canvas.
 * Lightweight (no external deps). Nodes drift slowly and connect via thin lines
 * when close; mouse position acts as a subtle gravity well.
 */
const NeuralBackground = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isDark = theme === "dark";
    const count = Math.min(120, Math.floor((width * height) / 15000));
    const nodes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.6 + 0.6,
    }));

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    const handleMouse = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouse);

    const nodeColor = isDark ? "rgba(34, 211, 238, 0.75)" : "rgba(37, 99, 235, 0.55)";
    const linkColor = isDark ? "34, 211, 238" : "99, 102, 241";

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // draw nodes
      nodes.forEach((n) => {
        // gravity toward mouse
        const dx = mouseRef.current.x - n.x;
        const dy = mouseRef.current.y - n.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 40000) {
          n.vx += (dx / Math.sqrt(d2 + 1)) * 0.02;
          n.vy += (dy / Math.sqrt(d2 + 1)) * 0.02;
        }
        n.x += n.vx;
        n.y += n.vy;
        n.vx *= 0.99;
        n.vy *= 0.99;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.fill();
      });

      // connect
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.strokeStyle = `rgba(${linkColor}, ${(1 - dist / 130) * 0.35})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      data-testid="neural-background"
      className="fixed inset-0 -z-10 h-full w-full"
      style={{ pointerEvents: "none" }}
    />
  );
};

export default NeuralBackground;
