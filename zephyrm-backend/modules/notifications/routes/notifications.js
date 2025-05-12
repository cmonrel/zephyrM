/* 
    CRUD Notifications
    Notifications Routes
    host + /api/notifications
*/

const { Router } = require("express");
const { check } = require("express-validator");

const {
  userHaveNotifications,
  createEventReminder,
} = require("../middlewares/notifications-validator");
const {
  getNotifications,
  createNotification,
  deleteNotification,
  markAsRead,
  markAllAsRead,
  setupNotificationStream,
} = require("../controllers/notifications");
const { validateJWT } = require("../../../middlewares/jwt-validator");

const router = Router();

// GET setup notification stream
router.get("/stream/:id", setupNotificationStream);

// GET notifications
router.get("/:id", [userHaveNotifications], getNotifications);

// All routes after need JWT verification
router.use(validateJWT);

// POST notification
router.post("/new", createNotification);

// PUT mark as read
router.put("/read/:id", markAsRead);

// PUT mark all as read
router.put("/read", markAllAsRead);

// DELETE notification
router.delete("/:id", deleteNotification);

module.exports = router;
