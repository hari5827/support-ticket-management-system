

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Headphones, Eye, EyeOff, ArrowRight } from "lucide-react";
import ThemeToggle from "../context/ThemeToggle";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await register(name, email, password);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#080e1c] dark:bg-[#050914] flex items-center justify-center p-4 transition-colors">
      <div className="fixed top-5 right-5 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl transition-colors">

        <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-indigo-700 via-blue-800 to-slate-950 text-white">
          <div>
            <div className="flex items-center gap-3">
              <div className="bg-white/15 p-3 rounded-xl">
                <Headphones size={25} />
              </div>
              <span className="text-xl font-bold">TicketFlow</span>
            </div>

            <div className="mt-24">
              <h1 className="text-4xl font-bold leading-tight">
                Better support
                <br />
                starts here.
              </h1>
              <p className="text-blue-100 mt-5 leading-relaxed">
                Create your account and experience a simpler way to manage
                support requests and conversations.
              </p>
            </div>
          </div>

          <p className="text-sm text-blue-200">
            © 2026 TicketFlow. All rights reserved.
          </p>
        </div>

        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <div className="md:hidden flex items-center gap-2 mb-8 text-indigo-700 dark:text-indigo-400">
            <Headphones size={25} />
            <span className="font-bold text-xl">TicketFlow</span>
          </div>

          <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-3">
            GET STARTED
          </p>

          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Create your account
          </h2>

          <p className="text-slate-500 dark:text-slate-400 mt-2 mb-7">
            Join us and get your support workspace started.
          </p>

          {error && (
            <p className="bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-5">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Full name
              </label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
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
                  placeholder="Create a password"
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
              Create Account <ArrowRight size={18} />
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-7">
            Already have an account?
            <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-semibold ml-1">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
