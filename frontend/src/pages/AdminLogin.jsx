
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Headphones,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import ThemeToggle from "../context/ThemeToggle";

function AdminLogin() {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await adminLogin(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Admin login failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#080e1c] dark:bg-[#050914] flex items-center justify-center p-4 transition-colors">
      <div className="fixed top-5 right-5 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl">

        <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-indigo-700 via-blue-800 to-slate-950 text-white">
          <div>
            <div className="flex items-center gap-3">
              <div className="bg-white/15 p-3 rounded-xl">
                <ShieldCheck size={25} />
              </div>
              <span className="text-xl font-bold">TicketFlow Admin</span>
            </div>

            <div className="mt-24">
              <h1 className="text-4xl font-bold leading-tight">
                Manage support.
                <br />
                Lead every solution.
              </h1>
              <p className="text-blue-100 mt-5 leading-relaxed">
                Monitor tickets, manage priorities and keep your support
                operations running smoothly.
              </p>
            </div>
          </div>

          <p className="text-sm text-blue-200">
            © 2026 TicketFlow. All rights reserved.
          </p>
        </div>

        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <div className="md:hidden flex items-center gap-2 mb-10 text-indigo-700 dark:text-indigo-400">
            <Headphones size={25} />
            <span className="font-bold text-xl">TicketFlow Admin</span>
          </div>

          <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-3">
            ADMIN PORTAL
          </p>

          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Admin sign in
          </h2>

          <p className="text-slate-500 dark:text-slate-400 mt-2 mb-8">
            Sign in to manage support tickets.
          </p>

          {error && (
            <p className="bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-5">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Admin email
              </label>
              <input
                type="email"
                placeholder="admin@example.com"
                className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-indigo-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl transition">
              Admin Sign In <ArrowRight size={18} />
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">
            New administrator?
            <Link to="/admin/register" className="text-indigo-600 dark:text-indigo-400 font-semibold ml-1">
              Create admin account
            </Link>
          </p>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-3">
            <Link to="/login" className="hover:text-indigo-500">
              User login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
