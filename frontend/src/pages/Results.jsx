import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight, MessageCircle, Crown, Palette, Cpu, GraduationCap, Sparkles,
  Lightbulb, BrainCircuit, Network, Cloud, Shield, BarChart3, Code2,
  Presentation, Scale, TrendingUp, ArrowLeft, Rocket,
} from "lucide-react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip,
} from "recharts";
import ThemeToggle from "../components/ThemeToggle";

const ICON_MAP = {
  "message-circle": MessageCircle,
  crown: Crown,
  palette: Palette,
  cpu: Cpu,
  "graduation-cap": GraduationCap,
  sparkles: Sparkles,
  lightbulb: Lightbulb,
  "brain-circuit": BrainCircuit,
  network: Network,
  cloud: Cloud,
  shield: Shield,
  "bar-chart-3": BarChart3,
  "code-2": Code2,
  presentation: Presentation,
  scale: Scale,
};

const riskColor = (risk) => {
  if (risk === "High") return "from-red-500/25 to-orange-500/25 text-red-500 dark:text-red-400 ring-red-500/30";
  if (risk === "Medium") return "from-amber-500/25 to-yellow-500/25 text-amber-600 dark:text-amber-400 ring-amber-500/30";
  return "from-emerald-500/25 to-cyan-500/25 text-emerald-600 dark:text-emerald-400 ring-emerald-500/30";
};

const PIE_COLORS = ["#22d3ee", "#6366f1", "#a78bfa", "#f472b6", "#34d399", "#f59e0b"];

const Gauge = ({ value, risk }) => {
  const size = 240, stroke = 18;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  const stop = risk === "High" ? "#ef4444" : risk === "Medium" ? "#f59e0b" : "#22d3ee";

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={`url(#gaugeGrad)`} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (c * pct) / 100 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="60%" stopColor="#6366f1" />
            <stop offset="100%" stopColor={stop} />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Automation</div>
        <div className="font-mono-data text-6xl font-medium">
          {Math.round(pct)}<span className="text-2xl align-top">%</span>
        </div>
      </div>
    </div>
  );
};

const CircularScore = ({ value, size = 78, stroke = 6, color = "#22d3ee" }) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (c * value) / 100 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center font-mono-data text-sm font-semibold">
        {Math.round(value)}
      </div>
    </div>
  );
};

const Results = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("fp-result");
    if (!raw) {
      navigate("/analyze");
      return;
    }
    setData(JSON.parse(raw));
  }, [navigate]);

  const trendData = useMemo(
    () => (data ? data.trend.map((t) => ({ year: String(t.year), probability: t.probability })) : []),
    [data],
  );

  if (!data) return null;

  const { occupation, automation_probability, risk_level, score_cards, radar, pie, top_ai_factors, skill_recommendations, career_alternatives, insights } = data;

  return (
    <div className="relative min-h-screen">
      <div className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 pt-6 sm:px-12">
        <button
          data-testid="results-back-btn"
          onClick={() => navigate("/analyze")}
          className="glass flex items-center gap-2 rounded-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
          Rerun
        </button>
        <div className="glass rounded-full px-4 py-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Result Dashboard
        </div>
        <ThemeToggle />
      </div>

      <main className="relative z-10 mx-auto max-w-7xl px-6 py-12 sm:px-12">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {occupation.category} · CatBoost prediction
          </p>
          <h1 className="mt-3 font-display text-4xl font-light tracking-tighter sm:text-6xl">
            {occupation.name}
          </h1>
        </motion.div>

        {/* Bento Grid */}
        <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Gauge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-[28px] p-8 lg:col-span-4 lg:row-span-2"
            data-testid="gauge-card"
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-display text-base font-medium">Automation Probability</h3>
              <span
                data-testid="risk-badge"
                className={`bg-gradient-to-r ${riskColor(risk_level)} rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ring-1`}
              >
                {risk_level}
              </span>
            </div>
            <div className="grid place-items-center py-4">
              <Gauge value={automation_probability} risk={risk_level} />
            </div>
            <p className="mt-6 text-sm text-muted-foreground">{insights[0]}</p>
          </motion.div>

          {/* Radar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass rounded-[28px] p-8 lg:col-span-4 lg:row-span-2"
            data-testid="radar-card"
          >
            <h3 className="mb-4 font-display text-base font-medium">Skill Signature</h3>
            <div className="h-[280px]">
              <ResponsiveContainer>
                <RadarChart data={radar} outerRadius="80%">
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="axis" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                  <Radar dataKey="value" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.25} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Score cards - 6 mini */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 gap-4 lg:col-span-4 lg:row-span-2 sm:grid-cols-3 lg:grid-cols-2"
            data-testid="score-grid"
          >
            {score_cards.map((s, i) => {
              const Icon = ICON_MAP[s.icon] || Sparkles;
              const color = PIE_COLORS[i % PIE_COLORS.length];
              return (
                <motion.div
                  key={s.key}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 + i * 0.05 }}
                  className="glass rounded-[24px] p-5 transition-transform hover:-translate-y-1"
                  data-testid={`score-${s.key}`}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <Icon className="h-4 w-4" style={{ color }} strokeWidth={1.75} />
                    <CircularScore value={s.value} size={52} stroke={4} color={color} />
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{s.label}</div>
                  <div className="mt-1 font-mono-data text-lg font-medium">{s.value.toFixed(0)}</div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Line chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-[28px] p-8 lg:col-span-8"
            data-testid="trend-card"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-medium">AI Automation Trend</h3>
                <p className="text-xs text-muted-foreground">Projected probability curve for {occupation.name}</p>
              </div>
              <TrendingUp className="h-4 w-4 text-cyan-500 dark:text-cyan-400" strokeWidth={1.75} />
            </div>
            <div className="h-[240px]">
              <ResponsiveContainer>
                <LineChart data={trendData}>
                  <defs>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="100%" stopColor="#a78bfa" />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                  <Line type="monotone" dataKey="probability" stroke="url(#lineGrad)" strokeWidth={3} dot={{ r: 5, fill: "#22d3ee" }} activeDot={{ r: 7 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Pie */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="glass rounded-[28px] p-8 lg:col-span-4"
            data-testid="pie-card"
          >
            <h3 className="mb-4 font-display text-base font-medium">Strength Distribution</h3>
            <div className="h-[240px]">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={pie} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={3}>
                    {pie.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1 text-[11px]">
              {pie.map((p, i) => (
                <div key={p.name} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="text-muted-foreground">{p.name}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top AI factors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-12"
          >
            <div className="mb-4 flex items-baseline justify-between">
              <h3 className="font-display text-2xl font-light tracking-tight">Top AI Factors</h3>
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">What matters most</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {top_ai_factors.map((f, i) => {
                const Icon = ICON_MAP[f.icon] || Sparkles;
                return (
                  <motion.div
                    key={f.id}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className="glass rounded-[24px] p-5"
                    data-testid={`factor-${f.id}`}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20">
                        <Icon className="h-4 w-4 text-indigo-500 dark:text-indigo-300" strokeWidth={1.75} />
                      </div>
                      <span className="font-mono-data text-lg font-medium">{f.importance}%</span>
                    </div>
                    <div className="text-sm font-medium">{f.name}</div>
                    {/* mini sparkline */}
                    <svg viewBox="0 0 100 30" className="mt-3 h-8 w-full">
                      <polyline
                        fill="none" stroke="url(#miniGrad)" strokeWidth={1.5}
                        points={f.trend.map((v, idx) => `${(idx / (f.trend.length - 1)) * 100},${30 - (v / 100) * 26}`).join(" ")}
                      />
                      <defs>
                        <linearGradient id="miniGrad" x1="0" x2="1">
                          <stop offset="0%" stopColor="#22d3ee" />
                          <stop offset="100%" stopColor="#a78bfa" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Skill recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-7"
          >
            <div className="mb-4 flex items-baseline justify-between">
              <h3 className="font-display text-2xl font-light tracking-tight">Skill Recommendations</h3>
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Learn next</p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {skill_recommendations.map((s, i) => {
                const Icon = ICON_MAP[s.icon] || Sparkles;
                return (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.05 }}
                    className="glass rounded-[24px] p-5 transition-transform hover:-translate-y-1"
                    data-testid={`skill-${s.id}`}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <Icon className="h-4 w-4 text-cyan-500 dark:text-cyan-400" strokeWidth={1.75} />
                      <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-medium text-cyan-600 dark:text-cyan-300">
                        {s.demand}% demand
                      </span>
                    </div>
                    <div className="font-display text-base font-medium">{s.name}</div>
                    <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{s.learning_weeks} weeks</span>
                      <span>·</span>
                      <span>{"●".repeat(s.difficulty)}<span className="opacity-30">{"●".repeat(5 - s.difficulty)}</span></span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Career alternatives */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="lg:col-span-5"
          >
            <div className="mb-4 flex items-baseline justify-between">
              <h3 className="font-display text-2xl font-light tracking-tight">Safer Paths</h3>
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Alternatives</p>
            </div>
            <div className="space-y-3">
              {career_alternatives.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 + i * 0.05 }}
                  className="glass flex items-center justify-between rounded-[24px] p-5"
                  data-testid={`alt-${c.id}`}
                >
                  <div>
                    <div className="font-display text-base font-medium">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.category}</div>
                    <div className="mt-2 flex items-center gap-3 text-xs">
                      <span className="font-mono-data">${(c.median_salary_usd / 1000).toFixed(0)}k</span>
                      <span className={c.growth_pct_10y >= 0 ? "text-emerald-500" : "text-red-500"}>
                        {c.growth_pct_10y >= 0 ? "+" : ""}{c.growth_pct_10y}%
                      </span>
                    </div>
                  </div>
                  <span className={`bg-gradient-to-r ${riskColor(c.risk_level)} rounded-full px-3 py-1 text-[10px] font-semibold uppercase ring-1`}>
                    {c.risk_level}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Final CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-cyan-500 via-indigo-600 to-purple-600 p-10 lg:col-span-12"
            data-testid="final-cta"
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
            <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/70">Become Future Proof</p>
                <h2 className="mt-3 font-display text-4xl font-light tracking-tight text-white sm:text-5xl">
                  Start learning today.
                </h2>
                <p className="mt-3 max-w-md text-white/80">
                  Your model-predicted risk is {automation_probability}%. Build the skills
                  that will keep you 10 years ahead of the automation curve.
                </p>
              </div>
              <button
                data-testid="final-cta-btn"
                onClick={() => navigate("/analyze")}
                className="group flex items-center gap-2 rounded-full bg-white px-7 py-4 font-semibold text-slate-900 transition-transform hover:-translate-y-0.5 hover:shadow-2xl"
              >
                <Rocket className="h-4 w-4" strokeWidth={2.25} />
                Analyze Another Career
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2.25} />
              </button>
            </div>
          </motion.div>
        </div>

        <div className="mt-16 text-center text-xs text-muted-foreground">
          Powered by a trained CatBoost regression model · scikit-learn median imputation preprocessing
        </div>
      </main>
    </div>
  );
};

export default Results;
