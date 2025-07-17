import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { DEFAULT_AVATAR } from "../constants/global";

export default function Navbar() {
  const { user, setUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const drawerRef = useRef(null);
  const navigate = useNavigate();
  const { notifications } = useNotification();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex justify-between items-center px-4 py-3 bg-white dark:bg-gray-900 shadow-md sticky top-0 z-40">
      <Link to="/" className="text-xl font-bold text-blue-600">
        Jaya
      </Link>

      {/* Hamburger for Mobile */}
      <button
        className="md:hidden"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle Menu"
        aria-expanded={menuOpen}
        aria-controls="mobile-drawer"
      >
        ☰
      </button>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-4">
        <Link
          to="/notifications"
          title="Notifications"
          aria-label="Notifications"
          className="relative"
        >
          🔔
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </Link>
        <Link to="/chat" title="Chat">💬</Link>
        <div className="relative" ref={dropdownRef}>
          <img
            src={user?.avatar || DEFAULT_AVATAR}
            alt="profile"
            className="w-8 h-8 rounded-full border cursor-pointer"
            tabIndex={0}
            role="button"
            aria-haspopup="menu"
            aria-expanded={dropdownOpen}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setDropdownOpen(!dropdownOpen);
            }}
          />
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow rounded z-50">
              <Link
                to={`/profile/${user?.username}`}
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        id="mobile-drawer"
        role="navigation"
        aria-hidden={!menuOpen}
        ref={drawerRef}
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-md transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 flex flex-col gap-4">
          <button
            className="self-end text-xl"
            onClick={() => setMenuOpen(false)}
          >
            ✖
          </button>
          <Link to="/">🏠 Home</Link>
          <Link to="/reels">🎥 Reels</Link>
          <Link to="/notifications">🔔 Notifications</Link>
          <Link to="/chat">💬 Chat</Link>
          <Link to={user ? `/profile/${user.username}` : "/login"}>
            👤 Profile/Login
          </Link>

          <button
            onClick={() => {
              const newMode = !isDarkMode;
              setIsDarkMode(newMode);
              if (newMode) {
                document.documentElement.classList.add("dark");
                localStorage.setItem("theme", "dark");
              } else {
                document.documentElement.classList.remove("dark");
                localStorage.setItem("theme", "light");
              }
            }}
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div>
      </div>
    </header>
  );
}
