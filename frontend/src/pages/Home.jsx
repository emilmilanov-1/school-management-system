function Home() {
  return (
    <div className="page">
      <section className="hero">
        <h1>School Management System</h1>
        <p>
          A complete platform for student registration, payments,
          schedules, documents, and communication.
        </p>

        <div className="hero-actions">
          <a href="/register" className="btn">Get Started</a>
          <a href="/pricing" className="btn secondary">View Pricing</a>
        </div>
      </section>

      <section className="grid">
        <div className="card">
          <h3>Student Registry</h3>
          <p>Manage student profiles, parent contacts, and enrollment status.</p>
        </div>

        <div className="card">
          <h3>Payments</h3>
          <p>Track paid, unpaid, and overdue student payments.</p>
        </div>

        <div className="card">
          <h3>Documents</h3>
          <p>Upload and organize certificates, notes, and student files.</p>
        </div>
      </section>
    </div>
  );
}

export default Home;