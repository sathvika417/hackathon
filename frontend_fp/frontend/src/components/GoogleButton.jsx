import React from "react";

const GoogleButton = ({
  label = "Continue with Google",
  testId,
  disabled = false,
  helperText,
}) => (
  <div className="space-y-2">
    <button
      type="button"
      data-testid={testId || "google-btn"}
      disabled={disabled}
      className="group flex w-full items-center justify-center gap-3 rounded-full border border-border bg-transparent px-6 py-3.5 text-sm font-semibold transition-transform hover:-translate-y-0.5 hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-transparent"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.66 4.1-5.5 4.1a6.2 6.2 0 1 1 0-12.4c1.94 0 3.24.8 3.98 1.48l2.72-2.62C17.02 3.06 14.7 2 12 2 6.86 2 2.7 6.16 2.7 11.3S6.86 20.6 12 20.6c6.94 0 9.24-4.86 9.24-7.4 0-.5-.06-.88-.14-1.26H12z" />
      </svg>
      {label}
    </button>
    {helperText ? (
      <p className="text-center text-xs text-muted-foreground">{helperText}</p>
    ) : null}
  </div>
);

export default GoogleButton;
