import { Link, useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { useState, useEffect } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // 🌙 Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  // 🌙 Toggle dark mode
  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDarkMode(!darkMode);
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const isActive = (path) =>
    location.pathname === path
      ? "text-primary font-semibold"
      : "text-textMuted-light dark:text-textMuted-dark hover:text-primary";

  return (
    <nav className="sticky top-0 z-50 bg-card-light dark:bg-card-dark border-b border-borderSubtle-light dark:border-borderSubtle-dark shadow-soft">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <h1 className="text-lg font-semibold text-textMain-light dark:text-textMain-dark">
          Expense<span className="text-primary">Tracker</span>
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/dashboard" className={isActive("/dashboard")}>
            Dashboard
          </Link>

          <Link to="/transactions" className={isActive("/transactions")}>
            Transactions
          </Link>

          <button
            onClick={toggleDarkMode}
            className="px-3 py-1.5 rounded-md text-sm border border-borderSubtle-light dark:border-borderSubtle-dark text-textMuted-light dark:text-textMuted-dark hover:text-textMain-light dark:hover:text-textMain-dark transition"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-1.5 rounded-md text-sm bg-danger text-white hover:opacity-90 transition"
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl text-textMain-light dark:text-textMain-dark"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-4 bg-card-light dark:bg-card-dark border-t border-borderSubtle-light dark:border-borderSubtle-dark">
          <Link
            to="/dashboard"
            onClick={() => setMenuOpen(false)}
            className={`block ${isActive("/dashboard")}`}
          >
            Dashboard
          </Link>

          <Link
            to="/transactions"
            onClick={() => setMenuOpen(false)}
            className={`block ${isActive("/transactions")}`}
          >
            Transactions
          </Link>

          <button
            onClick={toggleDarkMode}
            className="block px-3 py-1.5 rounded-md text-sm border border-borderSubtle-light dark:border-borderSubtle-dark"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>

          <button
            onClick={handleLogout}
            className="block px-4 py-1.5 rounded-md text-sm bg-danger text-white"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
