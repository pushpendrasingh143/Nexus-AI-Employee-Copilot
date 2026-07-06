const DashboardCard = ({ title, value, color }) => {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "18px",
        padding: "24px",
        boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
        border: "1px solid #E5E7EB",
        transition: "all 0.3s ease",
        cursor: "pointer",
        height: "100%",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow =
          "0 18px 40px rgba(79,70,229,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow =
          "0 8px 24px rgba(15,23,42,0.08)";
      }}
    >
      <div
        style={{
          width: "55px",
          height: "55px",
          borderRadius: "14px",
          background: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: "24px",
          marginBottom: "18px",
        }}
      >
        📊
      </div>

      <p
        style={{
          color: "#6B7280",
          margin: 0,
          fontSize: "15px",
          fontWeight: 500,
        }}
      >
        {title}
      </p>

      <h2
        style={{
          margin: "10px 0 8px",
          fontSize: "34px",
          color: "#111827",
        }}
      >
        {value}
      </h2>

      <span
        style={{
          color: "#10B981",
          fontWeight: 600,
          fontSize: "14px",
        }}
      >
        ▲ Updated just now
      </span>
    </div>
  );
};

export default DashboardCard;