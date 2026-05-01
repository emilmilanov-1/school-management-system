import { useEffect, useState } from "react";
import api from "../services/api";

function Messages() {
  const [messages, setMessages] = useState([]);
  const [form, setForm] = useState({
    recipientEmail: "",
    subject: "",
    body: "",
  });

  const [error, setError] = useState("");

  const loadMessages = async () => {
    try {
      const response = await api.get("/messages");
      setMessages(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load messages.");
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    try {
      await api.post("/messages", form);

      setForm({
        recipientEmail: "",
        subject: "",
        body: "",
      });

      loadMessages();
    } catch (err) {
      setError(err.response?.data?.message || "Could not send message.");
    }
  };

  return (
    <div className="page">
      <h1>Messages</h1>

      {error && <p className="error">{error}</p>}

      <form onSubmit={sendMessage} className="form card">
        <h2>Send Message</h2>

        <input name="recipientEmail" placeholder="Recipient email" value={form.recipientEmail} onChange={handleChange} />
        <input name="subject" placeholder="Subject" value={form.subject} onChange={handleChange} />
        <textarea name="body" placeholder="Message" value={form.body} onChange={handleChange}></textarea>

        <button className="btn" type="submit">Send</button>
      </form>

      <div className="grid">
        {messages.map((message) => (
          <div className="card" key={message.id}>
            <h3>{message.subject}</h3>
            <p><strong>To:</strong> {message.recipientEmail}</p>
            <p>{message.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Messages;