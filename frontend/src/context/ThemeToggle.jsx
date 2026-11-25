
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      aria-label="Toggle dark mode"
      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-yellow-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
    >
      {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
    </button>
  );
}

export default ThemeToggle;
