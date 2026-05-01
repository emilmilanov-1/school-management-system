import { useEffect, useState } from "react";
import api from "../services/api";
const user = JSON.parse(localStorage.getItem("user") || "null");
const canManage = user?.role === "ADMIN" || user?.role === "TEACHER";

const days = {
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
  7: "Sunday",
};

function Schedules() {
  const [schedules, setSchedules] = useState([]);
  const [form, setForm] = useState({
    groupId: "",
    teacherName: "",
    room: "",
    dayOfWeek: "1",
    startTime: "",
    endTime: "",
  });

  const [error, setError] = useState("");

  const loadSchedules = async () => {
    try {
      const response = await api.get("/schedules");
      setSchedules(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load schedules.");
    }
  };

  useEffect(() => {
    loadSchedules();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const createSchedule = async (e) => {
    e.preventDefault();

    try {
      await api.post("/schedules", {
        ...form,
        groupId: Number(form.groupId),
        dayOfWeek: Number(form.dayOfWeek),
      });

      setForm({
        groupId: "",
        teacherName: "",
        room: "",
        dayOfWeek: "1",
        startTime: "",
        endTime: "",
      });

      loadSchedules();
    } catch (err) {
      setError(err.response?.data?.message || "Could not create schedule.");
    }
  };

  const deleteSchedule = async (id) => {
  const confirmed = window.confirm("Are you sure you want to delete this class?");

  if (!confirmed) return;

  try {
    await api.delete(`/schedules/${id}`);
    loadSchedules();
  } catch (err) {
    setError(err.response?.data?.message || "Could not delete schedule.");
  }
};

  return (
    <div className="page">
      <h1>Schedules</h1>

      {error && <p className="error">{error}</p>}
        {canManage &&(
      <form onSubmit={createSchedule} className="form card">
        <h2>Create Schedule</h2>

        <input
          name="groupId"
          placeholder="Group ID"
          value={form.groupId}
          onChange={handleChange}
        />

        <input
          name="teacherName"
          placeholder="Teacher name"
          value={form.teacherName}
          onChange={handleChange}
        />

        <input
          name="room"
          placeholder="Room"
          value={form.room}
          onChange={handleChange}
        />

        <label>Class day</label>
        <select
          name="dayOfWeek"
          value={form.dayOfWeek}
          onChange={handleChange}
        >
          <option value="1">Monday</option>
          <option value="2">Tuesday</option>
          <option value="3">Wednesday</option>
          <option value="4">Thursday</option>
          <option value="5">Friday</option>
          <option value="6">Saturday</option>
          <option value="7">Sunday</option>
        </select>

        <label>Start time</label>
        <input
          name="startTime"
          type="time"
          value={form.startTime}
          onChange={handleChange}
        />

        <label>End time</label>
        <input
          name="endTime"
          type="time"
          value={form.endTime}
          onChange={handleChange}
        />

        <button className="btn" type="submit">
          Create Schedule
        </button>
      </form>)}

      <div className="table">
        <div className="table-row table-header">
          <span>Group</span>
          <span>Teacher</span>
          <span>Room</span>
          <span>Day</span>
          <span>Time</span>
          <span>Action</span>
        </div>

        {schedules.map((schedule) => (
  <div className="table-row" key={schedule.id}>
    <span>{schedule.group?.name || schedule.groupId}</span>
    <span>{schedule.teacherName}</span>
    <span>{schedule.room || "-"}</span>
    <span>{schedule.dayOfWeek}</span>
    <span>
      {schedule.startTime} - {schedule.endTime}
    </span>

    <span>
      {canManage && (
        <button
          className="danger-btn"
          onClick={() => deleteSchedule(schedule.id)}
        >
          Delete
        </button>
      )}
    </span>
  </div>
))}
      </div>
    </div>
  );
}

export default Schedules;