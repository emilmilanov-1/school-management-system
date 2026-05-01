const express = require("express");
const prisma = require("../config/prisma");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN", "TEACHER"),
  async (req, res) => {
    try {
    const { groupId, teacherName, room, dayOfWeek, startTime, endTime } = req.body;

    const schedule = await prisma.schedule.create({
      data: {
        groupId,
        teacherName,
        room,
        dayOfWeek,
        startTime,
        endTime
      }
    });

    return res.status(201).json(schedule);
  } catch (error) {
    console.error("Create schedule error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
  }
);


router.get("/", authMiddleware, async (req, res) => {
  try {
    const schedules = await prisma.schedule.findMany({
      include: {
        group: true
      }
    });

    return res.json(schedules);
  } catch (error) {
    console.error("Get schedules error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});
 
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN", "TEACHER"),
  async (req, res) => {
    try {
      const id = Number(req.params.id);

      await prisma.schedule.delete({
        where: { id },
      });

      return res.json({ message: "Schedule deleted successfully." });
    } catch (error) {
      console.error("Delete schedule error:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  }
);

module.exports = router;
