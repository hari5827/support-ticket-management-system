


import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import ThemeToggle from "../context/ThemeToggle";
import {
  Headphones, Plus, Search, LogOut, Ticket,
  Clock3, CheckCircle2, AlertCircle, X, RefreshCw
} from "lucide-react";

const statusStyles = {
  open: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
  "in-progress": "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
  resolved: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
};

const priorityStyles = {
  low: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
  medium: "bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300",
  high: "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300",
};

const inputStyles = "w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500";

function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium",
  });

  const [submitting, setSubmitting] = useState(false);

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/tickets/my-tickets");
      const data = response.data;

      setTickets(Array.isArray(data) ? data : data.tickets || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load your tickets"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleCreateTicket = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      await api.post("/tickets", form);

      setForm({
        title: "",
        description: "",
        category: "",
        priority: "medium",
      });

      setShowForm(false);
      await fetchTickets();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to create ticket"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (ticketId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this ticket?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/tickets/${ticketId}`);
      await fetchTickets();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to delete ticket"
      );
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      setError("Logout failed. Please try again.");
    }
  };

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSearch =
        ticket.title?.toLowerCase().includes(search.toLowerCase()) ||
        ticket.category?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        !filterStatus || ticket.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [tickets, search, filterStatus]);

  const openCount = tickets.filter(t => t.status === "open").length;
  const progressCount = tickets.filter(
    t => t.status === "in-progress"
  ).length;
  const resolvedCount = tickets.filter(
    t => t.status === "resolved"
  ).length;

  const statCards = [
    {
      title: "Total Tickets",
      value: tickets.length,
      icon: Ticket,
      color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400",
    },
    {
      title: "Open",
      value: openCount,
      icon: AlertCircle,
      color: "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400",
    },
    {
      title: "In Progress",
      value: progressCount,
      icon: Clock3,
      color: "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
    },
    {
      title: "Resolved",
      value: resolvedCount,
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120] flex transition-colors">

      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-[#10182b] dark:bg-[#080d19] text-white flex-col p-6 border-r border-slate-800">
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-indigo-600 p-2.5 rounded-xl">
            <Headphones size={22} />
          </div>
          <span className="text-xl font-bold">TicketFlow</span>
        </div>

        <p className="text-xs uppercase tracking-wider text-slate-500 mb-4">
          Workspace
        </p>

        <div className="flex items-center gap-3 bg-indigo-600 rounded-xl px-4 py-3">
          <Ticket size={19} />
          <span className="font-medium">My Tickets</span>
        </div>

        <div className="mt-auto border-t border-slate-700 pt-5">
          <p className="text-sm font-medium">{user?.name || "User"}</p>
          <p className="text-xs text-slate-400 mt-1">Customer Account</p>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-slate-300 hover:text-white mt-6 text-sm"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 p-5 sm:p-8">
        <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 md:hidden mb-3 text-indigo-700 dark:text-indigo-400">
              <Headphones size={23} />
              <span className="font-bold text-lg">TicketFlow</span>
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Workspace / My Tickets
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              Welcome, {user?.name?.split(" ")[0] || "there"}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Track and manage your support requests.
            </p>
          </div>

          <div className="flex gap-3 items-center">
            <ThemeToggle />

            <button
              onClick={fetchTickets}
              className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              title="Refresh"
            >
              <RefreshCw size={18} />
            </button>

            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-xl font-medium transition"
            >
              <Plus size={19} />
              New Ticket
            </button>

            <button
              onClick={handleLogout}
              className="md:hidden p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900 p-3 rounded-xl mb-5 text-sm">
            {error}
          </div>
        )}

        {/* Statistics */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {card.title}
                  </p>
                  <div className={`p-2.5 rounded-xl ${card.color}`}>
                    <Icon size={20} />
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-4">
                  {loading ? "—" : card.value}
                </h2>
              </div>
            );
          })}
        </section>

        {/* Ticket list */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl transition-colors">
          <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              My Support Tickets
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              All your submitted requests in one place.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search your tickets..."
                  className={`${inputStyles} pl-10 text-sm`}
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`${inputStyles} text-sm`}
              >
                <option value="">All statuses</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400">
              Loading your tickets...
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="p-12 text-center">
              <Ticket className="mx-auto text-slate-300 dark:text-slate-600" size={38} />
              <p className="font-semibold text-slate-700 dark:text-slate-200 mt-3">
                No tickets found
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Create a ticket to get started.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className="p-5 sm:p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                >
                  <div className="flex flex-wrap justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {ticket.title}
                      </h3>

                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {ticket.category}
                      </p>

                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 line-clamp-2">
                        {ticket.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-start gap-2">
                      <span
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusStyles[ticket.status] || ""}`}
                      >
                        {ticket.status}
                      </span>

                      <span
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full ${priorityStyles[ticket.priority] || ""}`}
                      >
                        {ticket.priority} priority
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-between items-center gap-3 mt-5">
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      Created: {ticket.createdAt
                        ? new Date(ticket.createdAt).toLocaleDateString()
                        : "—"}
                    </p>

                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => navigate(`/tickets/${ticket._id}`)}
                        className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
                      >
                        View Details
                      </button>

                      {ticket.status === "open" && (
                        <button
                          onClick={() => handleDelete(ticket._id)}
                          className="text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
                        >
                          Delete ticket
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Create ticket modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800">

            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Create New Ticket
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Describe your issue below.
                </p>
              </div>

              <button
                onClick={() => setShowForm(false)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Ticket title
                </label>
                <input
                  required
                  maxLength={120}
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  placeholder="Briefly describe your issue"
                  className={inputStyles}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Category
                </label>
                <input
                  required
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  placeholder="e.g. Technical, Billing, Account"
                  className={inputStyles}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  required
                  rows={4}
                  maxLength={2000}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Explain the issue in detail..."
                  className={`${inputStyles} resize-none`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Priority
                </label>
                <select
                  value={form.priority}
                  onChange={(e) =>
                    setForm({ ...form, priority: e.target.value })
                  }
                  className={inputStyles}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <button
                disabled={submitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition"
              >
                {submitting ? "Creating..." : "Submit Ticket"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
