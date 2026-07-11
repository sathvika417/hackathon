import React from "react";
import { motion } from "framer-motion";

const ProgressRing = ({ step, total }) => {
  const pct = Math.round(((step) / total) * 100);
  const size = 68;
  const stroke = 4;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  return (
    <div className="glass flex items-center gap-4 rounded-full py-2 pl-2 pr-5" data-testid="progress-ring">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={stroke}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: c - (c * pct) / 100 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 grid place-items-center font-mono-data text-xs font-semibold">
          {pct}%
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Step {step} of {total}
        </span>
        <span className="font-display text-sm font-medium">
          {pct}% Complete
        </span>
      </div>
    </div>
  );
};

export default ProgressRing;
