import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, ShieldCheck } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import GoogleButton from "../components/GoogleButton";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

const strengthOf = (pw) => {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  if (pw.length >= 12) s++;
  return Math.min(4, s);
};

const STRENGTH_LABELS = ["Too weak", "Weak", "Fair", "Strong", "Excellent"];
const STRENGTH_COLORS = [
  "bg-red-500",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-emerald-500",
  "bg-cyan-400",
];

const SignUp = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const strength = useMemo(() => strengthOf(password), [password]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (strength < 2) {
      toast.error("Please choose a stronger password");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      signup({ email, name });
      toast.success("Account created!");
      setSubmitting(false);
      navigate("/");
    }, 500);
  };

  return (
    <AuthLayout
      testId="signup-page"
      eyebrow="Get started"
      title="Create your account"
      subtitle="Join thousands mapping their careers against the AI horizon. Free to start."
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/login"
            data-testid="link-to-login"
            className="font-semibold text-cyan-500 hover:underline dark:text-cyan-400"
          >
            Log in
          </Link>
        </>
      }
    >
      <div className="hidden lg:mb-8 lg:block">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Account</p>
        <h2 className="mt-2 font-display text-4xl font-light tracking-tight">Sign up</h2>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <Field
          testId="signup-name"
          icon={User}
          label="Full name"
          type="text"
          value={name}
          onChange={setName}
          placeholder="Ada Lovelace"
          autoComplete="name"
        />
        <Field
          testId="signup-email"
          icon={Mail}
          label="Email address"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@work.com"
          autoComplete="email"
        />

        <div>
          <Field
            testId="signup-password"
            icon={Lock}
            label="Password"
            type={show ? "text" : "password"}
            value={password}
            onChange={setPassword}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            right={
              <button
                type="button"
                data-testid="signup-toggle-password"
                onClick={() => setShow((s) => !s)}
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label={show ? "Hide password" : "Show password"}
              >
                {show ? <EyeOff className="h-4 w-4" strokeWidth={1.75} /> : <Eye className="h-4 w-4" strokeWidth={1.75} />}
              </button>
            }
          />

          {/* Strength meter */}
          {password.length > 0 && (
            <div className="mt-3" data-testid="password-strength">
              <div className="flex gap-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      i < strength ? STRENGTH_COLORS[strength] : "bg-muted"
                    }`}
                  />
                ))}
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Strength</span>
                <span className="font-medium">{STRENGTH_LABELS[strength]}</span>
              </div>
            </div>
          )}
        </div>

        <Field
          testId="signup-confirm"
          icon={ShieldCheck}
          label="Confirm password"
          type={show ? "text" : "password"}
          value={confirm}
          onChange={setConfirm}
          placeholder="Repeat password"
          autoComplete="new-password"
        />

        <motion.button
          type="submit"
          data-testid="signup-submit"
          disabled={submitting}
          whileTap={{ scale: 0.98 }}
          className="btn-glow group flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-3.5 text-sm font-semibold text-background disabled:opacity-50"
        >
          {submitting ? "Creating…" : "Create account"}
          {!submitting && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2.25} />}
        </motion.button>

        <div className="relative flex items-center py-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          <div className="flex-1 border-t border-border" />
          <span className="px-4">or</span>
          <div className="flex-1 border-t border-border" />
        </div>

        <GoogleButton testId="google-signup" />
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

export default SignUp;
