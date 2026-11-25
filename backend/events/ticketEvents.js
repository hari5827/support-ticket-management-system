
const EventEmitter = require("events");
const ActivityLog = require("../models/ActivityLog");
const EVENTS = require("./eventNames");

class AsyncEventEmitter extends EventEmitter {
  async emitAsync(event, data) {
    const listeners = this.listeners(event);

    await Promise.all(
      listeners.map(listener => listener(data))
    );
  }
}

const ticketEvents = new AsyncEventEmitter();

// Save activity log
const saveActivity = async (data) => {
  try {
    await ActivityLog.create(data);
  } catch (error) {
    console.error("Activity log failed:", error.message);
    throw error;
  }
};

// Ticket created
ticketEvents.on(EVENTS.TICKET_CREATED, async (data) => {
  await saveActivity({
    ticket: data.ticketId,
    performedBy: data.userId,
    action: "ticket_created",
    details: "New ticket created"
  });
});

// Ticket updated
ticketEvents.on(EVENTS.TICKET_UPDATED, async (data) => {
  await saveActivity({
    ticket: data.ticketId,
    performedBy: data.userId,
    action: "ticket_updated",
    details: "Ticket details updated"
  });
});

// Status changed
ticketEvents.on(EVENTS.STATUS_CHANGED, async (data) => {
  await saveActivity({
    ticket: data.ticketId,
    performedBy: data.userId,
    action: "status_changed",
    details: `Status changed from ${data.oldStatus} to ${data.newStatus}`
  });
});

// Comment added
ticketEvents.on(EVENTS.COMMENT_ADDED, async (data) => {
  await saveActivity({
    ticket: data.ticketId,
    performedBy: data.userId,
    action: "comment_added",
    details: "New comment added"
  });
});

// Ticket resolved
ticketEvents.on(EVENTS.TICKET_RESOLVED, async (data) => {
  await saveActivity({
    ticket: data.ticketId,
    performedBy: data.userId,
    action: "ticket_resolved",
    details: "Ticket marked as resolved"
  });
});

module.exports = ticketEvents;

