import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const menus = [
    {
      title: "MAIN",
      items: [
        {
          name: "Dashboard",
          path: "/dashboard",
          icon: "🏠",
        },
      ],
    },
    {
      title: "MANAGEMENT",
      items: [
        {
          name: "Employees",
          path: "/employees",
          icon: "👨‍💼",
        },
        {
          name: "Departments",
          path: "/departments",
          icon: "🏢",
        },
        {
          name: "Documents",
          path: "/documents",
          icon: "📄",
        },
      ],
    },
    {
      title: "AI",
      items: [
        {
          name: "AI Assistant",
          path: "/ai",
          icon: "🤖",
        },
      ],
    },
  ];

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside
      className="sidebar"
      style={{
        width: "260px",
        minHeight: "100vh",
        background: "#111827",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "24px 18px",
        boxSizing: "border-box",
      }}
    >
      <div>
        <div
          style={{
            marginBottom: "40px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "28px",
            }}
          >
            🚀 Nexus AI
          </h2>

          <p
            style={{
              color: "#9CA3AF",
              marginTop: "6px",
              fontSize: "14px",
            }}
          >
            Employee Copilot
          </p>
        </div>

        {menus.map((section) => (
          <div
            key={section.title}
            style={{
              marginBottom: "28px",
            }}
          >
            <p
              style={{
                color: "#6B7280",
                fontSize: "12px",
                fontWeight: "bold",
                letterSpacing: "1px",
                marginBottom: "10px",
              }}
            >
              {section.title}
            </p>

            {section.items.map((menu) => (
              <NavLink
                key={menu.path}
                to={menu.path}
                style={{
                  textDecoration: "none",
                }}
              >
                {({ isActive }) => (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      padding: "12px 16px",
                      borderRadius: "12px",
                      marginBottom: "8px",
                      background: isActive
                        ? "#4F46E5"
                        : "transparent",
                      color: "#fff",
                      fontWeight: isActive ? "600" : "500",
                      transition: "0.25s",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "20px",
                      }}
                    >
                      {menu.icon}
                    </span>

                    <span>{menu.name}</span>
                  </div>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </div>

      <div>
        <button
          onClick={logout}
          style={{
            width: "100%",
            padding: "14px",
            border: "none",
            borderRadius: "12px",
            background: "#EF4444",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "15px",
          }}
        >
          🚪 Logout
        </button>

        <p
          style={{
            textAlign: "center",
            marginTop: "18px",
            color: "#6B7280",
            fontSize: "12px",
          }}
        >
          Nexus AI v1.0
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;