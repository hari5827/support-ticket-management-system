
const express = require("express");
const router = express.Router();

const {
  createTicket,
  getMyTickets,
  getAllTickets,
  updateTicket,
  deleteTicket,
  getTicketById,
  getTicketActivity,
  getDashboardStats
} = require("../controllers/ticketController");

const {
  protect,
  adminOnly
} = require("../middleware/authMiddleware");

// Static routes first
router.get("/stats", protect, adminOnly, getDashboardStats);
router.get("/my-tickets", protect, getMyTickets);

// Main ticket routes
router.post("/", protect, createTicket);
router.get("/", protect, adminOnly, getAllTickets);

// Activity route
router.get("/:id/activity", protect, getTicketActivity);

// Dynamic ID routes last
router.get("/:id", protect, getTicketById);
router.put("/:id", protect, updateTicket);
router.delete("/:id", protect, deleteTicket);

module.exports = router;
