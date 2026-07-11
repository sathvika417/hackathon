import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Compass, ShieldCheck, TrendingUp } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import ProfileDropdown from "../components/ProfileDropdown";

const Landing = () => {
  const navigate = useNavigate();

  const stats = [
    { icon: ShieldCheck, label: "Occupations analyzed", value: "35+" },
    { icon: TrendingUp, label: "Skill signals", value: "10+" },
    { icon: Sparkles, label: "Powered by", value: "CatBoost" },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Nav */}
      <nav className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 pt-8 sm:px-12">
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
      </nav>

      {/* Hero */}
      <section className="relative z-10 mx-auto flex max-w-7xl flex-col items-start px-6 pt-24 pb-32 sm:px-12 sm:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
          </span>
          <span className="tracking-wide text-muted-foreground">
            Career intelligence engine · v1.0
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-5xl font-light leading-[1.02] tracking-tighter sm:text-6xl lg:text-8xl"
          data-testid="hero-title"
        >
          <span className="block">Know if AI will</span>
          <span className="block gradient-text">replace your career</span>
          <span className="block text-muted-foreground/70">before it&apos;s too late.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
        >
          A cinematic career diagnostic powered by a trained CatBoost model. Get your
          automation-risk score, skill gaps, and a rescue plan — in under 60 seconds.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4"
        >
          <button
            data-testid="start-analysis-btn"
            onClick={() => navigate("/analyze")}
            className="btn-glow group flex items-center justify-center gap-2 rounded-full bg-foreground px-7 py-4 text-sm font-semibold text-background"
          >
            Start Analysis
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2.25} />
          </button>
          <button
            data-testid="explore-careers-btn"
            onClick={() => navigate("/analyze")}
            className="flex items-center justify-center gap-2 rounded-full border border-border bg-transparent px-7 py-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            <Compass className="h-4 w-4" strokeWidth={2.25} />
            Explore Careers
          </button>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-24 grid w-full grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {stats.map((s, i) => (
            <div key={i} className="glass rounded-[24px] p-6" data-testid={`stat-${i}`}>
              <s.icon className="mb-4 h-5 w-5 text-cyan-500 dark:text-cyan-400" strokeWidth={1.75} />
              <div className="font-mono-data text-3xl font-medium">{s.value}</div>
              <div className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-20 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted-foreground"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="h-8 w-[1px] bg-gradient-to-b from-transparent via-cyan-500 to-transparent dark:via-cyan-400"
          />
          Scroll to explore
        </motion.div>
      </section>
    </div>
  );
};

export default Landing;
