const express = require("express");
const prisma = require("../config/prisma");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN", "TEACHER", "PARENT"),
  async (req, res) => {
    try {
    const { studentId, amount, currency, status, method, dueDate, paidAt } = req.body;

    const payment = await prisma.payment.create({
      data: {
        studentId,
        amount,
        currency: currency || "EUR",
        status: status || "PENDING",
        method: method || "MANUAL",
        dueDate: dueDate ? new Date(dueDate) : null,
        paidAt: paidAt ? new Date(paidAt) : null
      }
    });

    return res.status(201).json(payment);
  } catch (error) {
    console.error("Create payment error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
  }
);



router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN", "TEACHER"),
  async (req, res) => {
    try {
      const payments = await prisma.payment.findMany({
        include: {
          student: true,
        },
      });

      return res.json(payments);
    } catch (error) {
      console.error("Get payments error:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  }
);

router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware("ADMIN"),
  async (req, res) => {
    try {
      const id = Number(req.params.id);
      const { status } = req.body;

      const allowedStatuses = ["PENDING", "PAID", "OVERDUE", "FAILED"];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid payment status." });
      }

      const updatedPayment = await prisma.payment.update({
        where: { id },
        data: {
          status,
          paidAt: status === "PAID" ? new Date() : null,
        },
      });

      return res.json(updatedPayment);
    } catch (error) {
      console.error("Update payment status error:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  }
);

module.exports = router;