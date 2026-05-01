const express = require("express");
const prisma = require("../config/prisma");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { recipientEmail, subject, body } = req.body;

    const message = await prisma.message.create({
      data: {
        senderId: req.user.id,
        recipientEmail,
        subject,
        body
      }
    });

    return res.status(201).json({
      message: "Message saved successfully.",
      data: message
    });
  } catch (error) {
    console.error("Create message error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      include: {
        sender: true
      }
    });

    return res.json(messages);
  } catch (error) {
    console.error("Get messages error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;