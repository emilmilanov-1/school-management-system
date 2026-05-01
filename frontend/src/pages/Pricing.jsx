function Pricing() {
  return (
    <div className="page">
      <h1>Pricing</h1>

      <section className="grid">
        <div className="card">
          <h2>Individual</h2>
          <p className="price">€40 / lesson</p>
          <p>One-on-one lessons with personalized attention.</p>
        </div>

        <div className="card">
          <h2>Group</h2>
          <p className="price">€120 / month</p>
          <p>Group classes organized by level and age.</p>
        </div>

        <div className="card">
          <h2>Online</h2>
          <p className="price">€100 / month</p>
          <p>Remote learning with access to digital materials.</p>
        </div>
      </section>
    </div>
  );
}

export default Pricing;