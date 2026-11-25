
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  Clock,
  MessageSquare,
  Headphones,
  RefreshCw,
} from "lucide-react";
import api from "../services/api";
import ThemeToggle from "../context/ThemeToggle";

function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [comments, setComments] = useState([]);
  const [activities, setActivities] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const [commentsRes, activityRes] = await Promise.all([
        api.get(`/comments/${id}`),
        api.get(`/tickets/${id}/activity`),
      ]);

      const commentsData = commentsRes.data;
      const activityData = activityRes.data;

      setComments(
        Array.isArray(commentsData)
          ? commentsData
          : commentsData.comments || []
      );

      setActivities(
        Array.isArray(activityData)
          ? activityData
          : activityData.activities || activityData.logs || []
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not load ticket details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    try {
      setSubmitting(true);

      await api.post(`/comments/${id}`, {
        message: message.trim(),
      });

      setMessage("");
      await fetchDetails();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120] transition-colors">
      <div className="max-w-6xl mx-auto p-4 sm:p-8">

        {/* Header */}
        <header className="flex items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-2">
              <Headphones size={22} />
              <span className="font-bold text-lg">TicketFlow</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Ticket Details
            </h1>

            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Review discussion and ticket activity.
            </p>
          </div>

          <ThemeToggle />
        </header>

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        {/* Error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-500 dark:text-slate-400 gap-3">
            <RefreshCw size={20} className="animate-spin" />
            Loading ticket details...
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">

            {/* Comments */}
            <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 transition-colors">
              <h2 className="font-semibold text-lg text-slate-900 dark:text-white flex items-center gap-2 mb-5">
                <MessageSquare size={19} />
                Comments
              </h2>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {comments.length === 0 ? (
                  <p className="text-slate-400 dark:text-slate-500 text-sm">
                    No comments yet.
                  </p>
                ) : (
                  comments.map((comment) => (
                    <div
                      key={comment._id}
                      className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4"
                    >
                      <p className="font-medium text-sm text-slate-800 dark:text-slate-200">
                        {comment.user?.name ||
                          comment.user?.email ||
                          "User"}
                      </p>

                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 whitespace-pre-wrap">
                        {comment.message}
                      </p>

                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                        {comment.createdAt
                          ? new Date(comment.createdAt).toLocaleString()
                          : ""}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleAddComment} className="mt-6">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write a comment..."
                  rows="3"
                  className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />

                <button
                  type="submit"
                  disabled={!message.trim() || submitting}
                  className="mt-3 bg-indigo-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm hover:bg-indigo-700 disabled:opacity-50 transition"
                >
                  <Send size={16} />
                  {submitting ? "Sending..." : "Add Comment"}
                </button>
              </form>
            </section>

            {/* Activity */}
            <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 transition-colors">
              <h2 className="font-semibold text-lg text-slate-900 dark:text-white flex items-center gap-2 mb-5">
                <Clock size={19} />
                Activity History
              </h2>

              <div className="space-y-5 max-h-[500px] overflow-y-auto">
                {activities.length === 0 ? (
                  <p className="text-slate-400 dark:text-slate-500 text-sm">
                    No activity found.
                  </p>
                ) : (
                  activities.map((activity) => (
                    <div key={activity._id} className="flex gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full bg-indigo-500 shrink-0" />

                      <div>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 capitalize">
                          {activity.action?.replaceAll("_", " ") ||
                            "Activity"}
                        </p>

                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          {activity.details || ""}
                        </p>

                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                          {activity.createdAt
                            ? new Date(activity.createdAt).toLocaleString()
                            : ""}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

export default TicketDetails;

