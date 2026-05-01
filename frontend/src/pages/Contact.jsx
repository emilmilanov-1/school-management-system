import { useState } from "react";
import api from "../services/api";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    try {
      await api.post("/contact", form);
      setSuccess("Your message was sent successfully.");
      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Could not send message.");
    }
  };

  return (
    <div className="page">
      <h1>Contact Us</h1>

      <div className="grid">
        <form onSubmit={handleSubmit} className="form card">
          {success && <p className="success">{success}</p>}
          {error && <p className="error">{error}</p>}

          <input name="name" placeholder="Your name" value={form.name} onChange={handleChange} />
          <input name="email" type="email" placeholder="Your email" value={form.email} onChange={handleChange} />
          <input name="subject" placeholder="Subject" value={form.subject} onChange={handleChange} />
          <textarea name="message" placeholder="Message" value={form.message} onChange={handleChange}></textarea>

          <button className="btn" type="submit">Send</button>
        </form>

        <div className="card">
          <h2>Location</h2>

          <iframe
            title="Map"
            src="https://www.google.com/maps?q=Sofia%20Bulgaria&output=embed"
            width="100%"
            height="300"
            style={{ border: 0 }}
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default Contact;