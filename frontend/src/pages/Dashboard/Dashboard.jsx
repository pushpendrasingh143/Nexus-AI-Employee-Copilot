import { useEffect, useState } from "react";

import {
  Grid,
  Paper,
  Typography,
} from "@mui/material";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import DashboardCard from "../../components/layout/DashboardCard";
import { getDashboardStats } from "../../services/dashboard.service";

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#ea580c",
  "#7c3aed",
];

const Dashboard = () => {
  const [stats, setStats] = useState({
    employees: 0,
    departments: 0,
    documents: 0,
    aiRequests: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await getDashboardStats();

      setStats({
        ...data,
        aiRequests: 0,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const chartData = [
    {
      name: "Employees",
      value: stats.employees,
    },
    {
      name: "Departments",
      value: stats.departments,
    },
    {
      name: "Documents",
      value: stats.documents,
    },
    {
      name: "AI",
      value: stats.aiRequests,
    },
  ];

  return (
    <>
      <Typography variant="h4" fontWeight="bold">
        Dashboard
      </Typography>

      <Typography
        color="text.secondary"
        mb={4}
      >
        Welcome to Nexus AI Employee Copilot
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 3 }}>
          <DashboardCard
            title="Employees"
            value={stats.employees}
            color="#2563eb"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <DashboardCard
            title="Departments"
            value={stats.departments}
            color="#16a34a"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <DashboardCard
            title="Documents"
            value={stats.documents}
            color="#ea580c"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <DashboardCard
            title="AI Requests"
            value={stats.aiRequests}
            color="#7c3aed"
          />
        </Grid>
      </Grid>

      <Grid
        container
        spacing={3}
        mt={2}
      >
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 4,
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
            >
              Analytics
            </Typography>

            <ResponsiveContainer
              width="100%"
              height={320}
            >
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />

                <Bar
                  dataKey="value"
                  fill="#2563eb"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 4,
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
            >
              Distribution
            </Typography>

            <ResponsiveContainer
              width="100%"
              height={320}
            >
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  outerRadius={110}
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={
                        COLORS[
                          index %
                            COLORS.length
                        ]
                      }
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;