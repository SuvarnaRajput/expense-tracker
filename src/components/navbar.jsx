import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { useState, useEffect } from "react";

export default function Navbar() {
  const navigate = useNavigate();
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

  return (
    
    <nav className="bg-gray-800 dark:bg-gray-900 text-white px-6 py-4">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-xl font-bold">Expense Tracker</h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          <Link to="/" className="hover:underline">
            Dashboard
          </Link>

          <Link to="/transactions" className="hover:underline">
            Transactions
          </Link>

          <button
            onClick={toggleDarkMode}
            className="border px-3 py-1 rounded"
          >
            {darkMode ? "Light" : "Dark"}
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Dashboard
          </Link>

          <Link to="/transactions" onClick={() => setMenuOpen(false)}>
            Transactions
          </Link>

          <button
            onClick={toggleDarkMode}
            className="border px-3 py-1 rounded w-fit"
          >
            {darkMode ? "Light" : "Dark"}
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 w-fit"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}


