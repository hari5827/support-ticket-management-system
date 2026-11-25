
const express = require("express");
const router = express.Router();

const {
  addComment,
  getComments
} = require("../controllers/commentController");

const { protect } = require("../middleware/authMiddleware");

router.post("/:ticketId", protect, addComment);
router.get("/:ticketId", protect, getComments);

module.exports = router;
