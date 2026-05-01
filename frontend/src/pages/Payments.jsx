import { useEffect, useState } from "react";
import api from "../services/api";

function Payments() {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    studentId: "",
    amount: "",
    status: "PENDING",
    method: "MANUAL",
    dueDate: "",
  });

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const isAdmin = user?.role === "ADMIN";
  const canSeePaymentTable = user?.role === "ADMIN" || user?.role === "TEACHER";
  const canCreatePayment =
    user?.role === "ADMIN" || user?.role === "TEACHER" || user?.role === "PARENT";

  const loadPayments = async () => {
    try {
      const response = await api.get("/payments");
      setPayments(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load payments.");
    }
  };

  useEffect(() => {
    if (canSeePaymentTable) {
      loadPayments();
    }
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const createPayment = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/payments", {
        ...form,
        studentId: Number(form.studentId),
        amount: Number(form.amount),
      });

      setForm({
        studentId: "",
        amount: "",
        status: "PENDING",
        method: "MANUAL",
        dueDate: "",
      });

      if (canSeePaymentTable) {
        loadPayments();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Could not create payment.");
    }
  };

  const updatePaymentStatus = async (paymentId, newStatus) => {
    try {
      await api.patch(`/payments/${paymentId}/status`, {
        status: newStatus,
      });

      loadPayments();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update payment status.");
    }
  };

  return (
    <div className="page">
      <h1>Payments</h1>

      {error && <p className="error">{error}</p>}

      {canCreatePayment && (
        <form onSubmit={createPayment} className="form card">
          <h2>Create Payment</h2>

          <input
            name="studentId"
            placeholder="Student ID"
            value={form.studentId}
            onChange={handleChange}
          />

          <input
            name="amount"
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
          />

          <select name="status" value={form.status} onChange={handleChange}>
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="OVERDUE">Overdue</option>
            <option value="FAILED">Failed</option>
          </select>

          <select name="method" value={form.method} onChange={handleChange}>
            <option value="MANUAL">Manual</option>
            <option value="ONLINE">Online</option>
          </select>

          <input
            name="dueDate"
            type="date"
            value={form.dueDate}
            onChange={handleChange}
          />

          <button className="btn" type="submit">
            Create Payment
          </button>
        </form>
      )}

      {user?.role === "PARENT" && (
        <p className="card">
          You can submit a payment, but you cannot view other payment records.
        </p>
      )}

      {canSeePaymentTable && (
        <div className="table">
          <div className="table-row table-header">
            <span>Student</span>
            <span>Amount</span>
            <span>Status</span>
            <span>Method</span>
          </div>

          {payments.map((payment) => (
            <div className="table-row" key={payment.id}>
              <span>
                {payment.student?.firstName} {payment.student?.lastName}
              </span>

              <span>
                {payment.amount} {payment.currency}
              </span>

              <span>
                {isAdmin ? (
                  <select
                    value={payment.status}
                    onChange={(e) =>
                      updatePaymentStatus(payment.id, e.target.value)
                    }
                  >
                    <option value="PENDING">Pending</option>
                    <option value="PAID">Paid</option>
                    <option value="OVERDUE">Overdue</option>
                    <option value="FAILED">Failed</option>
                  </select>
                ) : (
                  payment.status
                )}
              </span>

              <span>{payment.method}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Payments;