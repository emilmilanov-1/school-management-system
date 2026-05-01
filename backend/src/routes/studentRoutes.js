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
    const {
      firstName,
      lastName,
      birthDate,
      schoolName,
      schoolClass,
      level,
      studyType,
      parentId
    } = req.body;

    const student = await prisma.student.create({
      data: {
        firstName,
        lastName,
        birthDate: birthDate ? new Date(birthDate) : null,
        schoolName,
        schoolClass,
        level,
        studyType,
        parentId
      }
    });

    return res.status(201).json(student);
  } catch (error) {
    console.error("Create student error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
  }
);


router.get("/", authMiddleware, async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      include: {
        parent: true,
        payments: true,
        documents: true,
        attendances: true,
        notes: true,
        groupMembers: {
          include: {
            group: true
          }
        }
      }
    });

    return res.json(students);
  } catch (error) {
    console.error("Get students error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);

    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        parent: true,
        payments: true,
        documents: true,
        attendances: true,
        notes: true,
        enrollments: true,
        groupMembers: {
          include: {
            group: true
          }
        }
      }
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    return res.json(student);
  } catch (error) {
    console.error("Get student error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN", "TEACHER"),
  async (req, res) => {
    try {
    const id = Number(req.params.id);

    const updatedStudent = await prisma.student.update({
      where: { id },
      data: {
        ...req.body,
        birthDate: req.body.birthDate ? new Date(req.body.birthDate) : undefined
      }
    });

    return res.json(updatedStudent);
  } catch (error) {
    console.error("Update student error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
  }
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  async (req, res) => {
    try {
    const id = Number(req.params.id);

    await prisma.student.delete({
      where: { id }
    });

    return res.json({ message: "Student deleted successfully." });
  } catch (error) {
    console.error("Delete student error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
  }
);


module.exports = router;