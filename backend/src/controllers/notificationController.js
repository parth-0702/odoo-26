const asyncHandler = require("express-async-handler");
const Notification = require("../models/Notification");

// GET /api/notifications  — scoped to the current user's role audience
const listForUser = asyncHandler(async (req, res) => {
  const role = req.user.role;
  const query = {
    $or: [{ audienceRoles: { $size: 0 } }, { audienceRoles: role }],
  };
  const items = await Notification.find(query).sort("-createdAt").limit(100);
  const unread = items.filter((n) => !n.read).length;
  res.json({ data: items, unread });
});

// PUT /api/notifications/:id/read
const markRead = asyncHandler(async (req, res) => {
  const item = await Notification.findByIdAndUpdate(
    req.params.id,
    { read: true },
    { new: true }
  );
  if (!item) {
    res.status(404);
    throw new Error("Notification not found");
  }
  res.json({ data: item });
});

// PUT /api/notifications/read-all
const markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ read: false }, { read: true });
  res.json({ message: "All marked as read" });
});

module.exports = { listForUser, markRead, markAllRead };