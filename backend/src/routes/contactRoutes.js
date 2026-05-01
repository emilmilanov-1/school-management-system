const express = require("express");
const prisma = require("../config/prisma");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email, and message are required." });
    }

    const inquiry = await prisma.contactInquiry.create({
      data: {
        name,
        email,
        subject,
        message
      }
    });

    return res.status(201).json({
      message: "Inquiry submitted successfully.",
      inquiry
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;