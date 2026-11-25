
const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: true
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    action: {
      type: String,
      enum: [
        "ticket_created",
        "ticket_updated",
        "status_changed",
        "comment_added",
        "ticket_resolved"
      ],
      required: true
    },

    details: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);
