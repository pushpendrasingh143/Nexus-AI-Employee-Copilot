import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import {
  PeopleAltRounded,
  AccountTreeRounded,
  DescriptionRounded,
  SmartToyRounded,
  ArrowForwardRounded,
  AutoAwesomeRounded,
  RefreshRounded,
  CheckCircleRounded,
} from "@mui/icons-material";

import { getDashboardStats } from "../../services/dashboard.service";

const Dashboard = () => {
  const [stats, setStats] = useState({
    employees: 0,
    departments: 0,
    documents: 0,
    aiRequests: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDashboardStats();

      setStats({
        employees: data?.employees ?? 0,
        departments: data?.departments ?? 0,
        documents: data?.documents ?? 0,
        aiRequests: data?.aiRequests ?? 0,
      });
    } catch (err) {
      console.error("Dashboard stats error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load dashboard statistics."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const statCards = useMemo(
    () => [
      {
        title: "Total Employees",
        value: stats.employees,
        icon: PeopleAltRounded,
        color: "#2563EB",
        background: "#EFF6FF",
        description: "Registered workforce",
      },
      {
        title: "Departments",
        value: stats.departments,
        icon: AccountTreeRounded,
        color: "#16A34A",
        background: "#F0FDF4",
        description: "Active departments",
      },
      {
        title: "Documents",
        value: stats.documents,
        icon: DescriptionRounded,
        color: "#EA580C",
        background: "#FFF7ED",
        description: "Knowledge-base files",
      },
      {
        title: "AI Requests",
        value: stats.aiRequests,
        icon: SmartToyRounded,
        color: "#7C3AED",
        background: "#F5F3FF",
        description: "AI interactions",
      },
    ],
    [stats]
  );

  const chartData = statCards.map((item) => ({
    name: item.title.replace("Total ", ""),
    value: item.value,
    color: item.color,
  }));

  const quickActions = [
    {
      title: "Manage Employees",
      description: "Add and organize workforce records",
      path: "/employees",
      icon: PeopleAltRounded,
    },
    {
      title: "Manage Departments",
      description: "Structure teams and departments",
      path: "/departments",
      icon: AccountTreeRounded,
    },
    {
      title: "Upload Documents",
      description: "Expand the organizational knowledge base",
      path: "/documents",
      icon: DescriptionRounded,
    },
    {
      title: "Ask Nexus AI",
      description: "Search documents and chat with AI",
      path: "/ai",
      icon: SmartToyRounded,
    },
  ];

  return (
    <Box
      sx={{
        color: "#0F172A",
        "& .dashboard-white-panel": {
          backgroundColor: "#FFFFFF !important",
          color: "#0F172A !important",
        },
      }}
    >
      {/* Hero Section */}
      <Paper
        elevation={0}
        sx={{
          position: "relative",
          overflow: "hidden",
          p: {
            xs: 3,
            md: 4,
          },
          mb: 3,
          borderRadius: 4,
          color: "#FFFFFF !important",
          background:
            "linear-gradient(135deg, #1E3A8A 0%, #4F46E5 55%, #7C3AED 100%) !important",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: 240,
            height: 240,
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.08)",
            right: -70,
            top: -100,
          }}
        />

        <Box
          sx={{
            position: "absolute",
            width: 140,
            height: 140,
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.06)",
            right: 130,
            bottom: -90,
          }}
        />

        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            justifyContent="space-between"
            alignItems={{
              xs: "flex-start",
              sm: "center",
            }}
            gap={2}
          >
            <Box>
              <Chip
                icon={
                  <AutoAwesomeRounded
                    sx={{
                      color: "#FFFFFF !important",
                    }}
                  />
                }
                label="AI-Powered Enterprise Workspace"
                sx={{
                  mb: 2,
                  color: "#FFFFFF !important",
                  fontWeight: 700,
                  backgroundColor:
                    "rgba(255,255,255,0.16) !important",
                  border:
                    "1px solid rgba(255,255,255,0.24)",
                  "& .MuiChip-label": {
                    color: "#FFFFFF !important",
                  },
                }}
              />

              <Typography
                variant="h4"
                fontWeight={800}
                sx={{
                  color: "#FFFFFF !important",
                  fontSize: {
                    xs: "1.8rem",
                    md: "2.3rem",
                  },
                }}
              >
                Welcome to Nexus AI
              </Typography>

              <Typography
                sx={{
                  mt: 1,
                  maxWidth: 650,
                  color:
                    "rgba(255,255,255,0.88) !important",
                }}
              >
                Manage employees, organize company knowledge and
                automate workplace tasks from one intelligent
                platform.
              </Typography>
            </Box>

            <Button
              component={Link}
              to="/agents"
              variant="contained"
              endIcon={<ArrowForwardRounded />}
              sx={{
                flexShrink: 0,
                px: 3,
                py: 1.2,
                color: "#312E81 !important",
                backgroundColor: "#FFFFFF !important",
                fontWeight: 800,
                textTransform: "none",
                borderRadius: 2.5,
                boxShadow:
                  "0 8px 20px rgba(15, 23, 42, 0.14)",
                "&:hover": {
                  color: "#312E81 !important",
                  backgroundColor: "#F8FAFC !important",
                },
              }}
            >
              Explore AI Agents
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* Dashboard Header */}
      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        justifyContent="space-between"
        alignItems={{
          xs: "flex-start",
          sm: "center",
        }}
        gap={2}
        mb={3}
      >
        <Box>
          <Typography
            variant="h5"
            fontWeight={800}
            sx={{
              color: "#0F172A !important",
            }}
          >
            Workspace Overview
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              color: "#64748B !important",
            }}
          >
            Live summary of your organization and AI activity.
          </Typography>
        </Box>

        <Button
          onClick={loadDashboard}
          disabled={loading}
          startIcon={
            loading ? (
              <CircularProgress size={17} />
            ) : (
              <RefreshRounded />
            )
          }
          sx={{
            color: "#4F46E5 !important",
            textTransform: "none",
            fontWeight: 700,
            borderRadius: 2,
            "&:hover": {
              backgroundColor: "#EEF2FF !important",
            },
          }}
        >
          Refresh Data
        </Button>
      </Stack>

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 3,
          }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={loadDashboard}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Statistic Cards */}
      <Grid container spacing={3}>
        {statCards.map((item) => {
          const Icon = item.icon;

          return (
            <Grid
              key={item.title}
              size={{
                xs: 12,
                sm: 6,
                lg: 3,
              }}
            >
              <Paper
                className="dashboard-white-panel"
                elevation={0}
                sx={{
                  height: "100%",
                  minHeight: 190,
                  p: 2.5,
                  borderRadius: 3.5,
                  border: "1px solid #E2E8F0",
                  backgroundColor: "#FFFFFF !important",
                  color: "#0F172A !important",
                  transition:
                    "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow:
                      "0 12px 30px rgba(15, 23, 42, 0.10)",
                  },
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  gap={2}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        color: "#475569 !important",
                        fontSize: 14,
                        fontWeight: 700,
                      }}
                    >
                      {item.title}
                    </Typography>

                    <Typography
                      sx={{
                        color: "#0F172A !important",
                        fontSize: {
                          xs: "2rem",
                          md: "2.35rem",
                        },
                        fontWeight: 800,
                        mt: 1.2,
                        lineHeight: 1.1,
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={28} />
                      ) : (
                        item.value
                      )}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      display: "grid",
                      placeItems: "center",
                      borderRadius: 3,
                      color: `${item.color} !important`,
                      backgroundColor:
                        `${item.background} !important`,
                      flexShrink: 0,
                    }}
                  >
                    <Icon
                      sx={{
                        color: `${item.color} !important`,
                      }}
                    />
                  </Box>
                </Stack>

                <Typography
                  sx={{
                    color: "#64748B !important",
                    fontSize: 13,
                    mt: 2.5,
                    fontWeight: 500,
                  }}
                >
                  {item.description}
                </Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* Analytics and Quick Actions */}
      <Grid container spacing={3} mt={0}>
        <Grid
          size={{
            xs: 12,
            lg: 7,
          }}
        >
          <Paper
            className="dashboard-white-panel"
            elevation={0}
            sx={{
              height: "100%",
              p: {
                xs: 2.5,
                md: 3,
              },
              borderRadius: 4,
              border: "1px solid #E2E8F0",
              backgroundColor: "#FFFFFF !important",
              color: "#0F172A !important",
            }}
          >
            <Box mb={3}>
              <Typography
                variant="h6"
                fontWeight={800}
                sx={{
                  color: "#0F172A !important",
                }}
              >
                Platform Analytics
              </Typography>

              <Typography
                sx={{
                  color: "#64748B !important",
                  fontSize: 14,
                  mt: 0.5,
                }}
              >
                Current activity across major product modules.
              </Typography>
            </Box>

            <Box sx={{ width: "100%", height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -15,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="4 4"
                    vertical={false}
                    stroke="#E2E8F0"
                  />

                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#64748B",
                      fontSize: 12,
                    }}
                  />

                  <YAxis
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#64748B",
                      fontSize: 12,
                    }}
                  />

                  <Tooltip
                    cursor={{
                      fill: "#F8FAFC",
                    }}
                    contentStyle={{
                      color: "#0F172A",
                      backgroundColor: "#FFFFFF",
                      borderRadius: 12,
                      border: "1px solid #E2E8F0",
                      boxShadow:
                        "0 8px 24px rgba(15, 23, 42, 0.08)",
                    }}
                    labelStyle={{
                      color: "#0F172A",
                      fontWeight: 700,
                    }}
                    itemStyle={{
                      color: "#0F172A",
                    }}
                  />

                  <Bar
                    dataKey="value"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={60}
                  >
                    {chartData.map((item) => (
                      <Cell
                        key={item.name}
                        fill={item.color}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid
          size={{
            xs: 12,
            lg: 5,
          }}
        >
          <Paper
            className="dashboard-white-panel"
            elevation={0}
            sx={{
              height: "100%",
              p: {
                xs: 2.5,
                md: 3,
              },
              borderRadius: 4,
              border: "1px solid #E2E8F0",
              backgroundColor: "#FFFFFF !important",
              color: "#0F172A !important",
            }}
          >
            <Typography
              variant="h6"
              fontWeight={800}
              sx={{
                color: "#0F172A !important",
              }}
            >
              Quick Actions
            </Typography>

            <Typography
              sx={{
                color: "#64748B !important",
                fontSize: 14,
                mt: 0.5,
                mb: 2.5,
              }}
            >
              Access the most important workflows.
            </Typography>

            <Stack spacing={1.5}>
              {quickActions.map((action) => {
                const Icon = action.icon;

                return (
                  <Button
                    key={action.title}
                    component={Link}
                    to={action.path}
                    fullWidth
                    sx={{
                      justifyContent: "flex-start",
                      p: 1.7,
                      borderRadius: 3,
                      border: "1px solid #E2E8F0",
                      color: "#0F172A !important",
                      backgroundColor: "#FFFFFF !important",
                      textAlign: "left",
                      textTransform: "none",
                      "&:hover": {
                        color: "#0F172A !important",
                        borderColor: "#A5B4FC",
                        backgroundColor:
                          "#F8FAFF !important",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        mr: 1.7,
                        display: "grid",
                        placeItems: "center",
                        color: "#4F46E5 !important",
                        borderRadius: 2.5,
                        backgroundColor:
                          "#EEF2FF !important",
                        flexShrink: 0,
                      }}
                    >
                      <Icon
                        fontSize="small"
                        sx={{
                          color: "#4F46E5 !important",
                        }}
                      />
                    </Box>

                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography
                        sx={{
                          color: "#0F172A !important",
                          fontWeight: 700,
                          fontSize: 14,
                        }}
                      >
                        {action.title}
                      </Typography>

                      <Typography
                        sx={{
                          color: "#64748B !important",
                          fontSize: 12,
                          mt: 0.2,
                        }}
                      >
                        {action.description}
                      </Typography>
                    </Box>

                    <ArrowForwardRounded
                      sx={{
                        ml: 1,
                        color: "#94A3B8 !important",
                      }}
                    />
                  </Button>
                );
              })}
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* System Status */}
      <Paper
        className="dashboard-white-panel"
        elevation={0}
        sx={{
          mt: 3,
          p: {
            xs: 2.5,
            md: 3,
          },
          borderRadius: 4,
          border: "1px solid #E2E8F0",
          backgroundColor: "#FFFFFF !important",
          color: "#0F172A !important",
        }}
      >
        <Stack
          direction={{
            xs: "column",
            md: "row",
          }}
          justifyContent="space-between"
          alignItems={{
            xs: "flex-start",
            md: "center",
          }}
          gap={2}
        >
          <Box>
            <Stack direction="row" alignItems="center" gap={1}>
              <CheckCircleRounded
                sx={{
                  color: "#16A34A !important",
                }}
              />

              <Typography
                variant="h6"
                fontWeight={800}
                sx={{
                  color: "#0F172A !important",
                }}
              >
                MVP System Ready
              </Typography>
            </Stack>

            <Typography
              sx={{
                color: "#64748B !important",
                fontSize: 14,
                mt: 0.7,
              }}
            >
              Authentication, document intelligence, RAG search,
              workforce management and AI agents are available.
            </Typography>
          </Box>

          <Chip
            label="Live & Deployed"
            variant="outlined"
            sx={{
              color: "#15803D !important",
              borderColor: "#86EFAC !important",
              backgroundColor: "#F0FDF4 !important",
              fontWeight: 800,
              "& .MuiChip-label": {
                color: "#15803D !important",
              },
            }}
          />
        </Stack>
      </Paper>
    </Box>
  );
};

export default Dashboard;