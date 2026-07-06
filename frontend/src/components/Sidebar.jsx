import {
  Dashboard,
  People,
  Apartment,
  Description,
  SmartToy,
  Logout,
} from "@mui/icons-material";

import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";

import { NavLink, useNavigate } from "react-router-dom";

const drawerWidth = 250;

const menuItems = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: <Dashboard />,
  },
  {
    title: "Employees",
    path: "/employees",
    icon: <People />,
  },
  {
    title: "Departments",
    path: "/departments",
    icon: <Apartment />,
  },
  {
    title: "Documents",
    path: "/documents",
    icon: <Description />,
  },
  {
    title: "AI Assistant",
    path: "/ai",
    icon: <SmartToy />,
  },
];

const Sidebar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,

        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          background: "#111827",
          color: "#fff",
        },
      }}
    >
      <Toolbar>
        <Typography
          variant="h5"
          fontWeight="bold"
        >
          Nexus AI
        </Typography>
      </Toolbar>

      <Box sx={{ overflow: "auto" }}>
        <List>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              {({ isActive }) => (
                <ListItemButton
                  selected={isActive}
                  sx={{
                    mx: 1,
                    my: 0.5,
                    borderRadius: 2,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: "#fff",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  <ListItemText primary={item.title} />
                </ListItemButton>
              )}
            </NavLink>
          ))}

          <ListItemButton
            onClick={logout}
            sx={{
              mx: 1,
              mt: 3,
              borderRadius: 2,
            }}
          >
            <ListItemIcon
              sx={{
                color: "#fff",
              }}
            >
              <Logout />
            </ListItemIcon>

            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;