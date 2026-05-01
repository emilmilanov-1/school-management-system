import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AddStudent() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    schoolName: "",
    schoolClass: "",
    level: "",
    studyType: "GROUP",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/students", form);
      navigate("/students");
    } catch (err) {
      setError(err.response?.data?.message || "Could not create student.");
    }
  };

  return (
    <div className="form-page">
      <h1>Add Student</h1>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="form">
        <input name="firstName" placeholder="First name" value={form.firstName} onChange={handleChange} />
        <input name="lastName" placeholder="Last name" value={form.lastName} onChange={handleChange} />
        <input name="birthDate" type="date" value={form.birthDate} onChange={handleChange} />
        <input name="schoolName" placeholder="School name" value={form.schoolName} onChange={handleChange} />
        <input name="schoolClass" placeholder="Class" value={form.schoolClass} onChange={handleChange} />
        <input name="level" placeholder="Level" value={form.level} onChange={handleChange} />

        <select name="studyType" value={form.studyType} onChange={handleChange}>
          <option value="GROUP">Group</option>
          <option value="INDIVIDUAL">Individual</option>
          <option value="ONLINE">Online</option>
          <option value="OFFLINE">Offline</option>
        </select>

        <button className="btn" type="submit">Create Student</button>
      </form>
    </div>
  );
}

export default AddStudent;