const express = require("express");
const multer = require("multer");
const path = require("path");
const prisma = require("../config/prisma");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

router.post("/:studentId", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    const studentId = Number(req.params.studentId);

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const document = await prisma.studentDocument.create({
      data: {
        studentId,
        fileName: req.file.originalname,
        filePath: req.file.path,
        fileType: path.extname(req.file.originalname)
      }
    });

    return res.status(201).json({
      message: "Document uploaded successfully.",
      document
    });
  } catch (error) {
    console.error("Upload document error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

router.get("/:studentId", authMiddleware, async (req, res) => {
  try {
    const studentId = Number(req.params.studentId);

    const documents = await prisma.studentDocument.findMany({
      where: { studentId }
    });

    return res.json(documents);
  } catch (error) {
    console.error("Get documents error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;