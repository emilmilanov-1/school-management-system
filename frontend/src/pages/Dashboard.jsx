function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="page">
      <h1>Dashboard</h1>

      <p>
        Welcome, {user?.firstName || "User"}.
      </p>

      <section className="grid">
        <div className="card">
          <h3>Students</h3>
          <p>Manage student profiles and enrollment data.</p>
        </div>

        <div className="card">
          <h3>Payments</h3>
          <p>Track payments and overdue balances.</p>
        </div>

        <div className="card">
          <h3>Schedules</h3>
          <p>Manage groups, teachers, rooms, and lessons.</p>
        </div>

        <div className="card">
          <h3>Messages</h3>
          <p>Send and view parent-teacher communication.</p>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;