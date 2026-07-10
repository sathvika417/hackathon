import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import GoogleButton from "../components/GoogleButton";
import { Checkbox } from "../components/ui/checkbox";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
    setSubmitting(true);
    // UI-only: no Firebase yet. Simulate the successful branch.
    setTimeout(() => {
      login({ email });
      toast.success("Welcome back!");
      setSubmitting(false);
      navigate("/");
    }, 500);
  };

  return (
    <AuthLayout
      testId="login-page"
      eyebrow="Welcome back"
      title="Log in to FutureProof.ai"
      subtitle="Continue your career intelligence journey. Track, predict, and future-proof your path."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            data-testid="link-to-signup"
            className="font-semibold text-cyan-500 hover:underline dark:text-cyan-400"
          >
            Sign up
          </Link>
        </>
      }
    >
      <div className="hidden lg:mb-8 lg:block">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Account</p>
        <h2 className="mt-2 font-display text-4xl font-light tracking-tight">Log in</h2>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <Field
          testId="login-email"
          icon={Mail}
          label="Email address"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@work.com"
          autoComplete="email"
        />

        <Field
          testId="login-password"
          icon={Lock}
          label="Password"
          type={show ? "text" : "password"}
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          autoComplete="current-password"
          right={
            <button
              type="button"
              data-testid="toggle-password"
              onClick={() => setShow((s) => !s)}
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? <EyeOff className="h-4 w-4" strokeWidth={1.75} /> : <Eye className="h-4 w-4" strokeWidth={1.75} />}
            </button>
          }
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex cursor-pointer items-center gap-2 text-muted-foreground">
            <Checkbox
              data-testid="remember-me"
              checked={remember}
              onCheckedChange={(v) => setRemember(!!v)}
            />
            Remember me
          </label>
          <Link
            to="/forgot-password"
            data-testid="link-forgot-password"
            className="text-cyan-500 hover:underline dark:text-cyan-400"
          >
            Forgot password?
          </Link>
        </div>

        <motion.button
          type="submit"
          data-testid="login-submit"
          disabled={submitting}
          whileTap={{ scale: 0.98 }}
          className="btn-glow group flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-3.5 text-sm font-semibold text-background disabled:opacity-50"
        >
          {submitting ? "Signing in…" : "Log in"}
          {!submitting && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2.25} />}
        </motion.button>

        <div className="relative flex items-center py-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          <div className="flex-1 border-t border-border" />
          <span className="px-4">or</span>
          <div className="flex-1 border-t border-border" />
        </div>

        <GoogleButton testId="google-login" />
      </form>
    </AuthLayout>
  );
};

const Field = ({ testId, icon: Icon, label, type, value, onChange, placeholder, autoComplete, right }) => (
  <div>
    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
      {label}
    </label>
    <div className="glass flex items-center gap-3 rounded-2xl px-4 py-3 transition-colors focus-within:ring-2 focus-within:ring-cyan-400/60">
      <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
      <input
        data-testid={testId}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
      />
      {right}
    </div>
  </div>
);

export default Login;
