import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import styles from "./ThemeToggle.module.css";

const ThemeToggle = () => {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  const toggleTransition = () => {
    const root = document.documentElement;
    root.classList.toggle("transition");
  };

  return (
    <button
      onClick={toggleTheme}
      onMouseEnter={toggleTransition}
      onMouseLeave={toggleTransition}
      className={styles.themeButton}
      title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {theme === "dark" ? (
        <Sun size={20} className="text-yellow-500" />
      ) : (
        <Moon size={20} className="text-blue-500" />
      )}
    </button>
  );
};

export default ThemeToggle;
