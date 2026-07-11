import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import ProfileDropdown from "./ProfileDropdown";

/**
 * Shared premium glassmorphism shell for Login / Sign Up / Forgot Password.
 * Two-column on desktop (marketing panel + form), single column on mobile.
 */
const AuthLayout = ({ eyebrow, title, subtitle, children, footer, testId }) => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen" data-testid={testId}>
      {/* top bar */}
      <div className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 pt-6 sm:px-12">
        <button
          data-testid="auth-back-home"
          onClick={() => navigate("/")}
          className="glass flex items-center gap-2 rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
          Home
        </button>
        <div className="flex items-center gap-2.5" data-testid="brand-logo">
          <div className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
            <Sparkles className="h-4 w-4 text-white" strokeWidth={2.25} />
          </div>
          <span className="font-display text-lg font-semibold tracking-tight">
            FutureProof<span className="text-cyan-500 dark:text-cyan-400">.ai</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <ProfileDropdown />
        </div>
      </div>

      <main className="relative z-10 mx-auto grid min-h-[calc(100vh-96px)] max-w-6xl grid-cols-1 items-center gap-10 px-6 py-10 sm:px-12 lg:grid-cols-2">
        {/* left: marketing panel */}
        <motion.section
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {eyebrow}
          </p>
          <h1 className="mt-3 font-display text-5xl font-light tracking-tighter">
            <span className="block">{title}</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
            {subtitle}
          </p>

          {/* Decorative feature bullets */}
          <div className="mt-10 space-y-4">
            {[
              "CatBoost-powered career predictions",
              "Personalized skill roadmaps",
              "Track your future-proof score over time",
            ].map((line, i) => (
              <motion.div
                key={line}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="flex items-center gap-3 text-sm text-muted-foreground"
              >
                <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-cyan-500/20 to-indigo-500/20">
                  <Sparkles className="h-3 w-3 text-cyan-500 dark:text-cyan-300" strokeWidth={2} />
                </span>
                {line}
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* right: form card */}
        <motion.section
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="glass-strong rounded-[28px] p-8 shadow-2xl sm:p-10">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground lg:hidden">
              {eyebrow}
            </p>
            <h2 className="mt-2 font-display text-3xl font-light tracking-tight sm:text-4xl lg:hidden">
              {title}
            </h2>
            <div className="lg:mt-0">{children}</div>
            {footer && (
              <div className="mt-6 border-t border-border pt-6 text-center text-sm text-muted-foreground">
                {footer}
              </div>
            )}
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default AuthLayout;
