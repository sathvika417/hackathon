import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Backpack,
  Briefcase,
  Building2,
  GraduationCap,
  RotateCw,
  Search,
  Sparkles,
  User,
} from "lucide-react";
import { fetchOccupations, predictAutomation } from "../lib/api";
import { Slider } from "../components/ui/slider";
import ThemeToggle from "../components/ThemeToggle";
import ProgressRing from "../components/ProgressRing";
import { toast } from "sonner";

const PERSONAS = [
  { id: "student", label: "Student", icon: Backpack, desc: "Preparing for the future workforce" },
  { id: "professional", label: "Working Professional", icon: Briefcase, desc: "Employed full-time" },
  { id: "freelancer", label: "Freelancer", icon: User, desc: "Independent operator" },
  { id: "business_owner", label: "Business Owner", icon: Building2, desc: "Running or building a company" },
  { id: "career_switcher", label: "Career Switcher", icon: RotateCw, desc: "Planning a pivot" },
];

const EXPERIENCE = ["0-2", "2-5", "5-10", "10+"];
const EDUCATION = [
  { id: "diploma", label: "Diploma" },
  { id: "bachelor", label: "Bachelor" },
  { id: "master", label: "Master" },
  { id: "phd", label: "PhD" },
];
const AI_USAGE = ["never", "rarely", "sometimes", "often", "daily"];

const stepVariants = {
  enter:  { opacity: 0, y: 40, filter: "blur(6px)" },
  center: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit:   { opacity: 0, y: -40, filter: "blur(6px)" },
};

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [persona, setPersona] = useState(null);
  const [occupations, setOccupations] = useState([]);
  const [occupation, setOccupation] = useState(null);
  const [search, setSearch] = useState("");
  const [experience, setExperience] = useState("2-5");
  const [education, setEducation] = useState("bachelor");
  const [aiUsageIdx, setAiUsageIdx] = useState(2);

  useEffect(() => {
    fetchOccupations()
      .then(setOccupations)
      .catch(() => toast.error("Could not load occupations"));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return occupations.slice(0, 10);
    return occupations.filter((o) => o.name.toLowerCase().includes(q)).slice(0, 12);
  }, [occupations, search]);

  const runPrediction = async () => {
    try {
      const data = await predictAutomation({
        occupation_id: occupation.id,
        persona,
        experience,
        education,
        ai_usage: AI_USAGE[aiUsageIdx],
      });
      sessionStorage.setItem("fp-result", JSON.stringify(data));
      navigate("/results");
    } catch (e) {
      toast.error("Prediction failed. Please try again.");
      setStep(3);
    }
  };

  // Trigger prediction the moment we hit step 4 (scanning), navigate after animation
  useEffect(() => {
    if (step === 4 && occupation) {
      const t = setTimeout(runPrediction, 5200);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const canNext =
    (step === 1 && !!persona) ||
    (step === 2 && !!occupation) ||
    (step === 3 && !!experience && !!education);

  return (
    <div className="relative min-h-screen">
      {/* Top bar */}
      <div className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 pt-6 sm:px-12">
        <button
          data-testid="back-home-btn"
          onClick={() => (step === 1 ? navigate("/") : setStep((s) => Math.max(1, s - 1)))}
          className="glass flex items-center gap-2 rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
          Back
        </button>
        <ProgressRing step={step} total={5} />
        <ThemeToggle />
      </div>

      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-96px)] max-w-5xl flex-col justify-center px-6 py-12 sm:px-12">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.section
              key="s1"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5 }}
              data-testid="step-1"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Step 1 · Identity</p>
              <h2 className="mt-3 font-display text-4xl font-light tracking-tight sm:text-6xl">
                Who are you?
              </h2>
              <p className="mt-4 max-w-lg text-muted-foreground">
                We calibrate the analysis for your context. Pick the profile that fits best.
              </p>

              <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {PERSONAS.map((p, i) => {
                  const active = persona === p.id;
                  return (
                    <motion.button
                      key={p.id}
                      data-testid={`persona-${p.id}`}
                      onClick={() => setPersona(p.id)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className={`group relative overflow-hidden rounded-[24px] p-6 text-left transition-transform hover:-translate-y-1 ${
                        active
                          ? "bg-gradient-to-br from-cyan-500/15 via-indigo-500/15 to-purple-500/15 ring-2 ring-cyan-400"
                          : "glass"
                      }`}
                    >
                      <div className={`mb-8 inline-flex h-12 w-12 items-center justify-center rounded-2xl transition-colors ${
                        active ? "bg-cyan-400 text-slate-950" : "bg-muted text-foreground"
                      }`}>
                        <p.icon className="h-5 w-5" strokeWidth={1.75} />
                      </div>
                      <div className="font-display text-lg font-medium">{p.label}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{p.desc}</div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.section>
          )}

          {step === 2 && (
            <motion.section
              key="s2"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5 }}
              data-testid="step-2"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Step 2 · Career</p>
              <h2 className="mt-3 font-display text-4xl font-light tracking-tight sm:text-6xl">
                Choose your career
              </h2>
              <p className="mt-4 max-w-lg text-muted-foreground">
                Search from our catalog of 35+ occupations trained into the model.
              </p>

              <div className="mt-12 glass rounded-[24px] p-2">
                <div className="flex items-center gap-3 rounded-[20px] px-5 py-4">
                  <Search className="h-5 w-5 text-muted-foreground" strokeWidth={1.75} />
                  <input
                    data-testid="career-search"
                    autoFocus
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Software Engineer, Doctor, Designer…"
                    className="w-full bg-transparent font-display text-2xl outline-none placeholder:text-muted-foreground/60"
                  />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {filtered.map((o, i) => {
                  const active = occupation?.id === o.id;
                  return (
                    <motion.button
                      key={o.id}
                      data-testid={`career-${o.id}`}
                      onClick={() => setOccupation(o)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className={`flex items-center justify-between rounded-2xl px-5 py-4 text-left transition-colors ${
                        active
                          ? "bg-cyan-500/10 ring-1 ring-cyan-400"
                          : "glass hover:bg-muted/40"
                      }`}
                    >
                      <div>
                        <div className="font-medium">{o.name}</div>
                        <div className="text-xs text-muted-foreground">{o.category}</div>
                      </div>
                      {active && <Sparkles className="h-4 w-4 text-cyan-400" strokeWidth={2} />}
                    </motion.button>
                  );
                })}
              </div>
            </motion.section>
          )}

          {step === 3 && (
            <motion.section
              key="s3"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5 }}
              data-testid="step-3"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Step 3 · Journey</p>
              <h2 className="mt-3 font-display text-4xl font-light tracking-tight sm:text-6xl">
                Your career journey
              </h2>

              {/* Experience pills */}
              <div className="mt-14">
                <div className="mb-4 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  Experience
                </div>
                <div className="flex flex-wrap gap-3">
                  {EXPERIENCE.map((e) => {
                    const active = experience === e;
                    return (
                      <button
                        key={e}
                        data-testid={`exp-${e}`}
                        onClick={() => setExperience(e)}
                        className={`rounded-full px-6 py-3 text-sm font-medium transition-all ${
                          active
                            ? "bg-foreground text-background shadow-lg"
                            : "glass hover:-translate-y-0.5"
                        }`}
                      >
                        {e} Years
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Education cards */}
              <div className="mt-10">
                <div className="mb-4 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  Education
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {EDUCATION.map((e) => {
                    const active = education === e.id;
                    return (
                      <button
                        key={e.id}
                        data-testid={`edu-${e.id}`}
                        onClick={() => setEducation(e.id)}
                        className={`flex flex-col items-start gap-3 rounded-2xl p-5 text-left transition-transform hover:-translate-y-1 ${
                          active
                            ? "bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 ring-2 ring-indigo-400"
                            : "glass"
                        }`}
                      >
                        <GraduationCap className="h-5 w-5 text-indigo-500 dark:text-indigo-400" strokeWidth={1.75} />
                        <span className="font-display text-lg font-medium">{e.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* AI usage slider */}
              <div className="mt-10">
                <div className="mb-4 flex items-baseline justify-between">
                  <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    AI Usage
                  </span>
                  <span className="font-display text-base font-medium capitalize">
                    {AI_USAGE[aiUsageIdx]}
                  </span>
                </div>
                <div className="glass rounded-[24px] p-6">
                  <Slider
                    data-testid="ai-usage-slider"
                    value={[aiUsageIdx]}
                    min={0}
                    max={4}
                    step={1}
                    onValueChange={(v) => setAiUsageIdx(v[0])}
                  />
                  <div className="mt-4 flex justify-between text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {AI_USAGE.map((u) => (
                      <span key={u}>{u}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {step === 4 && <ScanningStep occupationName={occupation?.name} />}
        </AnimatePresence>

        {step < 4 && (
          <div className="mt-12 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {occupation ? `Selected: ${occupation.name}` : "Take your time."}
            </span>
            <button
              data-testid="next-btn"
              disabled={!canNext}
              onClick={() => setStep((s) => s + 1)}
              className="btn-glow group flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-sm font-semibold text-background disabled:cursor-not-allowed disabled:opacity-30"
            >
              {step === 3 ? "Run Analysis" : "Continue"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2.25} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

const SCAN_LINES = [
  "Analyzing occupation…",
  "Understanding your skill signature…",
  "Calculating automation probability…",
  "Comparing against industry cohort…",
  "Generating future-proof skills…",
  "Preparing your career insights…",
];

const ScanningStep = ({ occupationName }) => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % SCAN_LINES.length), 850);
    return () => clearInterval(t);
  }, []);
  return (
    <motion.section
      key="s4"
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.5 }}
      data-testid="step-4"
      className="grid place-items-center py-8"
    >
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[32px] glass-strong p-10">
        {/* scanning laser */}
        <motion.div
          initial={{ y: "-100%" }}
          animate={{ y: "1000%" }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
          className="pointer-events-none absolute left-0 right-0 h-16 bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent"
        />
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Step 4 · Neural Analysis
        </p>
        <h2 className="mt-3 font-display text-3xl font-light tracking-tight sm:text-4xl">
          Scanning {occupationName || "your career"}…
        </h2>

        {/* neural viz */}
        <div className="my-10 h-40 w-full">
          <NeuralViz />
        </div>

        <div className="space-y-2 font-mono-data text-sm">
          {SCAN_LINES.map((line, i) => {
            const done = i < idx;
            const active = i === idx;
            return (
              <div
                key={i}
                className={`flex items-center gap-3 transition-colors ${
                  done ? "text-muted-foreground/50" : active ? "text-cyan-500 dark:text-cyan-400" : "text-muted-foreground/30"
                }`}
              >
                <span className={`inline-block h-1.5 w-1.5 rounded-full ${
                  active ? "bg-cyan-400" : done ? "bg-muted-foreground/40" : "bg-muted"
                }`} />
                {line}
              </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
};

const NeuralViz = () => {
  // static SVG neural nodes + animated pulses
  const cols = [3, 5, 5, 3];
  const w = 480, h = 160;
  const layers = cols.map((n, li) => {
    const x = ((li + 1) / (cols.length + 1)) * w;
    return Array.from({ length: n }, (_, i) => ({
      x, y: ((i + 1) / (n + 1)) * h, li, i,
    }));
  });
  const nodes = layers.flat();
  const edges = [];
  for (let li = 0; li < layers.length - 1; li++) {
    for (const a of layers[li]) for (const b of layers[li + 1]) edges.push([a, b]);
  }
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mx-auto h-full w-full">
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={a.x} y1={a.y} x2={b.x} y2={b.y}
          stroke="url(#nvGrad)" strokeWidth={0.5} opacity={0.35}
        />
      ))}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={4} fill="url(#nvGrad)" />
          <motion.circle
            cx={n.x} cy={n.y} r={4} fill="none"
            stroke="#22d3ee"
            animate={{ r: [4, 10, 4], opacity: [0.9, 0, 0.9] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: (i % 5) * 0.2 }}
          />
        </g>
      ))}
      <defs>
        <linearGradient id="nvGrad" x1="0" x2="1">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Onboarding;
