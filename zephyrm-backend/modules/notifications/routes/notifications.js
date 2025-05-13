/* 
    CRUD Notifications
    Notifications Routes
    host + /api/notifications
*/

const { Router } = require("express");
const { check } = require("express-validator");

const {
  userHaveNotifications,
} = require("../middlewares/notifications-validator");
const {
  getNotifications,
  createNotification,
  deleteNotification,
  markAsRead,
  markAllAsRead,
} = require("../controllers/notifications");
const { validateJWT } = require("../../../middlewares/jwt-validator");

const router = Router();

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
