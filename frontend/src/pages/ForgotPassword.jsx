import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSent(true);
      setSubmitting(false);
      toast.success("If an account exists, a reset link is on the way.");
    }, 500);
  };

  return (
    <AuthLayout
      testId="forgot-page"
      eyebrow="Recover access"
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a secure reset link. It's that simple."
      footer={
        <>
          Remembered it?{" "}
          <Link
            to="/login"
            data-testid="link-back-login"
            className="font-semibold text-cyan-500 hover:underline dark:text-cyan-400"
          >
            Back to login
          </Link>
        </>
      }
    >
      <div className="hidden lg:mb-8 lg:block">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Recover</p>
        <h2 className="mt-2 font-display text-4xl font-light tracking-tight">Reset password</h2>
      </div>

      {sent ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          data-testid="forgot-success"
          className="flex flex-col items-start gap-4 rounded-2xl bg-emerald-500/10 p-6 ring-1 ring-emerald-500/30"
        >
          <div className="grid h-10 w-10 place-items-center rounded-full bg-emerald-500/20">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" strokeWidth={2} />
          </div>
          <div>
            <div className="font-display text-lg font-medium">Check your inbox</div>
            <p className="mt-1 text-sm text-muted-foreground">
              If an account exists for <span className="font-medium text-foreground">{email}</span>,
              we&apos;ve sent a password reset link. It may take a minute to arrive.
            </p>
          </div>
          <Link
            to="/login"
            data-testid="forgot-back-btn"
            className="mt-2 flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
          >
            Back to login
          </Link>
        </motion.div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              Email address
            </label>
            <div className="glass flex items-center gap-3 rounded-2xl px-4 py-3 transition-colors focus-within:ring-2 focus-within:ring-cyan-400/60">
              <Mail className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
              <input
                data-testid="forgot-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@work.com"
                autoComplete="email"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
              />
            </div>
          </div>

          <motion.button
            type="submit"
            data-testid="forgot-submit"
            disabled={submitting}
            whileTap={{ scale: 0.98 }}
            className="btn-glow group flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-3.5 text-sm font-semibold text-background disabled:opacity-50"
          >
            {submitting ? "Sending…" : "Send reset link"}
            {!submitting && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2.25} />}
          </motion.button>
        </form>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
