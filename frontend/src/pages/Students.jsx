import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Students() {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = user?.role === "ADMIN";
  const canManageStudents = user?.role === "ADMIN" || user?.role === "TEACHER";

  const loadStudents = async () => {
    try {
      const response = await api.get("/students");
      setStudents(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load students.");
    }
  };

  const deleteStudent = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/students/${id}`);
      loadStudents();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete student.");
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Students</h1>

        {canManageStudents && (
          <Link to="/students/add" className="btn">
            Add Student
          </Link>
        )}
      </div>

      {error && <p className="error">{error}</p>}

      <div className="table">
        <div className="table-row table-header">
          <span>Name</span>
          <span>Class</span>
          <span>Level</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        {students.map((student) => (
          <div className="table-row" key={student.id}>
            <span>
              {student.firstName} {student.lastName}
            </span>
            <span>{student.schoolClass || "-"}</span>
            <span>{student.level || "-"}</span>
            <span>{student.isActive ? "Active" : "Inactive"}</span>

            <span>
              <Link to={`/students/${student.id}`}>View</Link>

              {isAdmin && (
                <button
                  className="danger-btn"
                  onClick={() => deleteStudent(student.id)}
                  style={{ marginLeft: "10px" }}
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

export default Students;