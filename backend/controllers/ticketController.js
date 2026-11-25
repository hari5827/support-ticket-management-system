const ticketEvents = require("../events/ticketEvents");
const Ticket = require("../models/Ticket");
const mongoose = require("mongoose");
const ActivityLog = require("../models/ActivityLog");
const EVENTS = require("../events/eventNames");

// Create Ticket
exports.createTicket = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        message: "Title, description and category are required"
      });
    }

    const ticket = await Ticket.create({
      title,
      description,
      category,
      priority: priority || "medium",
      createdBy: req.user._id
    });

   await ticketEvents.emitAsync(EVENTS.TICKET_CREATED, {
    ticketId: ticket._id,
    userId: req.user._id
   });

    res.status(201).json({
      message: "Ticket created successfully",
      ticket
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get Logged-in User Tickets
exports.getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({
      createdBy: req.user._id
    }).sort({ createdAt: -1 });

    res.status(200).json({
      count: tickets.length,
      tickets
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get All Tickets (Admin)

exports.getAllTickets = async (req, res) => {
  try {
    const {
      status,
      priority,
      category,
      search,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "desc"
    } = req.query;

    // Pagination
    const currentPage = Math.max(1, parseInt(page) || 1);
    const pageLimit = Math.min(100, Math.max(1, parseInt(limit) || 10));
    const skip = (currentPage - 1) * pageLimit;

    // Filtering
    const filter = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;

    // Search
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } }
      ];
    }

    // Sorting (allow only approved fields)
    const allowedSortFields = ["createdAt", "title"];
    const sortField = allowedSortFields.includes(sortBy)
      ? sortBy
      : "createdAt";

    const sortOrder = order === "asc" ? 1 : -1;

    // Fetch tickets
    const tickets = await Ticket.find(filter)
      .populate("createdBy", "name email")
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(pageLimit);

    // Total matching tickets
    const totalTickets = await Ticket.countDocuments(filter);

    res.status(200).json({
      success: true,
      pagination: {
        currentPage,
        totalPages: Math.ceil(totalTickets / pageLimit),
        totalTickets,
        limit: pageLimit
      },
      tickets
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};



// Update Ticket

exports.updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found"
      });
    }

    const oldStatus = ticket.status;

    const isAdmin = req.user.role === "admin";
    const isOwner =
      ticket.createdBy.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        message: "You cannot update this ticket"
      });
    }

    const {
      title,
      description,
      category,
      priority,
      status
    } = req.body;

    if (isAdmin) {
      if (title !== undefined) ticket.title = title;
      if (description !== undefined) ticket.description = description;
      if (category !== undefined) ticket.category = category;
      if (priority !== undefined) ticket.priority = priority;
      if (status !== undefined) ticket.status = status;

    } else {
      if (ticket.status !== "open") {
        return res.status(400).json({
          message: "Only open tickets can be edited"
        });
      }

      if (status !== undefined || priority !== undefined) {
        return res.status(403).json({
          message: "Only admins can change status or priority"
        });
      }

      if (title !== undefined) ticket.title = title;
      if (description !== undefined) ticket.description = description;
      if (category !== undefined) ticket.category = category;
    }

    await ticket.save();

    // Ticket Updated Event
    await ticketEvents.emitAsync(EVENTS.TICKET_UPDATED, {
      ticketId: ticket._id,
      userId: req.user._id
    });

    // Status Changed Event
    if (oldStatus !== ticket.status) {
      await ticketEvents.emitAsync(EVENTS.STATUS_CHANGED, {
        ticketId: ticket._id,
        userId: req.user._id,
        oldStatus,
        newStatus: ticket.status
      });

      // Ticket Resolved Event
      if (ticket.status === "resolved") {
        await ticketEvents.emitAsync(EVENTS.TICKET_RESOLVED, {
          ticketId: ticket._id,
          userId: req.user._id
        });
      }
    }

    res.status(200).json({
      message: "Ticket updated successfully",
      ticket
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};



// Delete Ticket
exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found"
      });
    }

    const isOwner = ticket.createdBy.toString() === req.user._id.toString();

    if (!isOwner) {
      return res.status(403).json({
        message: "You cannot delete this ticket"
      });
    }

    if (ticket.status !== "open") {
      return res.status(400).json({
        message: "Only open tickets can be deleted"
      });
    }

    await ticket.deleteOne();

    res.status(200).json({
      message: "Ticket deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Ticket Details
exports.getTicketById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid ticket ID"
      });
    }

    const ticket = await Ticket.findById(id)
      .populate("createdBy", "name email");

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found"
      });
    }

    const isOwner =
      ticket.createdBy._id.toString() === req.user._id.toString();

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    res.status(200).json({
      success: true,
      ticket
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Get Ticket Activity
exports.getTicketActivity = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found"
      });
    }

    const isOwner =
      ticket.createdBy.toString() === req.user._id.toString();

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    const activities = await ActivityLog.find({
      ticket: ticket._id
    })
      .populate("performedBy", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: activities.length,
      activities
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


exports.getDashboardStats = async (req, res) => {
  try {
    // Total tickets
    const totalTickets = await Ticket.countDocuments();

    // Group tickets by status
    const statusStats = await Ticket.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Group tickets by priority
    const priorityStats = await Ticket.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 }
        }
      }
    ]);

    // Tickets created per day (last 7 days)
    const lastSevenDays = await Ticket.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(
              Date.now() - 7 * 24 * 60 * 60 * 1000
            )
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt"
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Response
    res.status(200).json({
      success: true,

      overview: {
        totalTickets,
        openTickets: statusStats.find(
          item => item._id === "open"
        )?.count || 0,

        inProgressTickets: statusStats.find(
          item => item._id === "in-progress"
        )?.count || 0,

        resolvedTickets: statusStats.find(
          item => item._id === "resolved"
        )?.count || 0
      },

      statusStats,
      priorityStats,
      lastSevenDays
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
