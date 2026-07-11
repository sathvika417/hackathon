import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggle } = useTheme();
  return (
    <button
      data-testid="theme-toggle"
      onClick={toggle}
      aria-label="Toggle theme"
      className="glass rounded-full p-2.5 transition-transform hover:scale-105 active:scale-95"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-cyan-300" strokeWidth={1.75} />
      ) : (
        <Moon className="h-4 w-4 text-indigo-600" strokeWidth={1.75} />
      )}
    </button>
  );
};

export default ThemeToggle;
