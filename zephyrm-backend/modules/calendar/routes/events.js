/* 
    CRUD  Calendar
    Events Routes
    host + /api/events
*/

const { Router } = require("express");
const { check } = require("express-validator");

const { isDate } = require("../../../helpers/isDate");

const { eventExist, isUserEvent } = require("../middlewares/event-validator");
const { fieldsValidator } = require("../../../middlewares/fields-validator");
const { validateJWT } = require("../../../middlewares/jwt-validator");

const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/events");

const router = Router();

// All routes need JWT verification
router.use(validateJWT);

// GET events
router.get("/", getEvents);

// POST event
router.post(
  "/",
  [
    check("title", "Title is required").not().isEmpty(),
    check("start", "Start date is required").custom(isDate),
    check("end", "End date is required").custom(isDate),
    fieldsValidator,
  ],
  createEvent
);

// PUT event
router.put(
  "/:id",
  [
    check("title", "Title is required").not().isEmpty(),
    check("start", "Start date is required").custom(isDate),
    check("end", "End date is required").custom(isDate),
    fieldsValidator,
    isUserEvent,
    eventExist,
  ],
  updateEvent
);

// DELETE event
router.delete("/:id", [eventExist, isUserEvent], deleteEvent);

module.exports = router;
