

import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import ThemeToggle from "../context/ThemeToggle";
import {
  Headphones, LayoutDashboard, Ticket, LogOut,
  Search, RefreshCw, Clock3, CheckCircle2,
  AlertCircle, ChevronLeft, ChevronRight, Eye
} from "lucide-react";

const statusStyles = {
  open: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300",
  "in-progress": "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
  resolved: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
};

const priorityStyles = {
  low: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
  medium: "bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300",
  high: "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300",
};

const inputStyles =
  "w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500";

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({});
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTickets, setTotalTickets] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = { page, limit: 10, search, status, priority };

      const [ticketResponse, statsResponse] = await Promise.all([
        api.get("/tickets", { params }),
        api.get("/tickets/stats"),
      ]);

      const ticketData = ticketResponse.data;
      const statsData = statsResponse.data;

      setTickets(ticketData.tickets || []);
      setStats(statsData);

      setTotalTickets(
        ticketData.pagination?.totalTickets ??
        ticketData.pagination?.total ??
        ticketData.total ??
        ticketData.tickets?.length ??
        0
      );

      setTotalPages(ticketData.pagination?.totalPages || 1);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load dashboard");
    } finally {
      setLoading(false);
    }
  }, [page, search, status, priority]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleUpdate = async (ticketId, field, value) => {
    try {
      await api.put(`/tickets/${ticketId}`, { [field]: value });
      await fetchDashboard();
    } catch (err) {
      alert(err.response?.data?.message || "Unable to update ticket");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      setError("Logout failed. Please try again.");
    }
  };

  const overview = stats.overview || {};

  const statCards = [
    {
      title: "Total Tickets",
      value: overview.totalTickets ?? stats.totalTickets ?? totalTickets,
      icon: Ticket,
      color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400",
    },
    {
      title: "Open Tickets",
      value: overview.openTickets ?? stats.statusCounts?.open ??
        tickets.filter(t => t.status === "open").length,
      icon: AlertCircle,
      color: "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400",
    },
    {
      title: "In Progress",
      value: overview.inProgressTickets ?? stats.statusCounts?.["in-progress"] ??
        tickets.filter(t => t.status === "in-progress").length,
      icon: Clock3,
      color: "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
    },
    {
      title: "Resolved",
      value: overview.resolvedTickets ?? stats.statusCounts?.resolved ??
        tickets.filter(t => t.status === "resolved").length,
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
          <LayoutDashboard size={19} />
          <span className="font-medium">Dashboard</span>
        </div>

        <div className="mt-auto border-t border-slate-700 pt-5">
          <p className="text-sm font-medium">{user?.name || "Admin"}</p>
          <p className="text-xs text-slate-400 mt-1">Administrator</p>

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
              Workspace / Overview
            </p>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              Admin Dashboard
            </h1>

            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Manage and monitor all support requests.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <button
              onClick={fetchDashboard}
              className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              title="Refresh"
            >
              <RefreshCw size={18} />
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

        {/* Tickets */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl transition-colors">
          <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              All Tickets
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Review and manage support requests.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search tickets..."
                  className={`${inputStyles} pl-10`}
                />
              </div>

              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className={inputStyles}
              >
                <option value="">All statuses</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>

              <select
                value={priority}
                onChange={(e) => {
                  setPriority(e.target.value);
                  setPage(1);
                }}
                className={inputStyles}
              >
                <option value="">All priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {error && (
            <p className="m-5 p-3 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-lg text-sm">
              {error}
            </p>
          )}

          {loading ? (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400">
              Loading tickets...
            </div>
          ) : tickets.length === 0 ? (
            <div className="p-12 text-center">
              <Ticket className="mx-auto text-slate-300 dark:text-slate-600" size={35} />
              <p className="font-medium text-slate-700 dark:text-slate-200 mt-3">
                No tickets found
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Try changing your search or filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[1000px]">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-xs uppercase text-slate-500 dark:text-slate-400">
                  <tr>
                    <th className="px-6 py-4">Ticket</th>
                    <th className="px-6 py-4">Created By</th>
                    <th className="px-6 py-4">Priority</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Created</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {tickets.map((ticket) => (
                    <tr
                      key={ticket._id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                          {ticket.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {ticket.category}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                        {ticket.createdBy?.name || "Unknown"}
                      </td>

                      <td className="px-6 py-4">
                        <select
                          value={ticket.priority}
                          onChange={(e) =>
                            handleUpdate(ticket._id, "priority", e.target.value)
                          }
                          className={`text-xs font-semibold rounded-lg px-2.5 py-2 border-0 outline-none ${priorityStyles[ticket.priority] || ""}`}
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </td>

                      <td className="px-6 py-4">
                        <select
                          value={ticket.status}
                          onChange={(e) =>
                            handleUpdate(ticket._id, "status", e.target.value)
                          }
                          className={`text-xs font-semibold rounded-lg px-2.5 py-2 border-0 outline-none ${statusStyles[ticket.status] || ""}`}
                        >
                          <option value="open">Open</option>
                          <option value="in-progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {ticket.createdAt
                          ? new Date(ticket.createdAt).toLocaleDateString()
                          : "—"}
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() => navigate(`/tickets/${ticket._id}`)}
                          className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                        >
                          <Eye size={16} />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-t border-slate-100 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {totalTickets} tickets total
            </p>

            <div className="flex items-center gap-3">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
              >
                <ChevronLeft size={18} />
              </button>

              <span className="text-sm text-slate-600 dark:text-slate-300">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
