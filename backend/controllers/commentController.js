const Comment = require("../models/Comment");
const Ticket = require("../models/Ticket");
const ticketEvents = require("../events/ticketEvents");
const EVENTS = require("../events/eventNames");

// Add Comment
exports.addComment = async (req, res) => {
  try {
    const { message } = req.body;
    const { ticketId } = req.params;

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Comment cannot be empty"
      });
    }

    const ticket = await Ticket.findById(ticketId);

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

    const comment = await Comment.create({
      ticket: ticketId,
      user: req.user._id,
      message
    });

   await ticketEvents.emitAsync(EVENTS.COMMENT_ADDED, {
       ticketId: ticket._id,
    userId: req.user._id
    });

    res.status(201).json({
      message: "Comment added successfully",
      comment
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get Ticket Comments
exports.getComments = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.ticketId);

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

    const comments = await Comment.find({
      ticket: req.params.ticketId
    })
      .populate("user", "name email")
      .sort({ createdAt: 1 });

    res.status(200).json({
      count: comments.length,
      comments
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};