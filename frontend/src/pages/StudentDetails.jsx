import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function StudentDetails() {
  const { id } = useParams();

  const [student, setStudent] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const loadStudent = async () => {
    try {
      const response = await api.get(`/students/${id}`);
      setStudent(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load student.");
    }
  };

  useEffect(() => {
    loadStudent();
  }, [id]);

  const uploadDocument = async (e) => {
    e.preventDefault();

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post(`/documents/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setFile(null);
      loadStudent();
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed.");
    }
  };

  if (!student) {
    return <p>Loading student...</p>;
  }

  return (
    <div className="page">
      <h1>{student.firstName} {student.lastName}</h1>

      {error && <p className="error">{error}</p>}

      <div className="card">
        <p><strong>School:</strong> {student.schoolName || "-"}</p>
        <p><strong>Class:</strong> {student.schoolClass || "-"}</p>
        <p><strong>Level:</strong> {student.level || "-"}</p>
        <p><strong>Study type:</strong> {student.studyType || "-"}</p>
      </div>

      <div className="card">
        <h2>Upload Document</h2>

        <form onSubmit={uploadDocument} className="form">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button className="btn" type="submit">Upload</button>
        </form>
      </div>

      <div className="card">
        <h2>Documents</h2>

        {student.documents?.length === 0 && <p>No documents uploaded.</p>}

        {student.documents?.map((doc) => (
          <p key={doc.id}>
            {doc.fileName}
          </p>
        ))}
      </div>
    </div>
  );
}

export default StudentDetails;