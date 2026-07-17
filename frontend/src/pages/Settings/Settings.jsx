import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Paper,
  Stack,
  Switch,
  Typography,
} from "@mui/material";

import {
  AccountCircleRounded,
  AutoAwesomeRounded,
  DarkModeRounded,
  EmailRounded,
  LockRounded,
  LogoutRounded,
  NotificationsActiveRounded,
  PersonRounded,
  RefreshRounded,
  SaveRounded,
  SecurityRounded,
  SettingsRounded,
  VerifiedUserRounded,
} from "@mui/icons-material";

import { useThemeMode } from "../../theme/ThemeModeProvider";

const defaultPreferences = {
  emailNotifications: true,
  aiSuggestions: true,
  activityUpdates: true,
};

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("user");

    return storedUser ? JSON.parse(storedUser) : {};
  } catch (error) {
    console.error("Stored user parse error:", error);
    return {};
  }
};

const getStoredPreferences = () => {
  try {
    const storedPreferences = localStorage.getItem(
      "nexus_preferences"
    );

    return storedPreferences
      ? {
          ...defaultPreferences,
          ...JSON.parse(storedPreferences),
        }
      : defaultPreferences;
  } catch (error) {
    console.error("Preferences parse error:", error);
    return defaultPreferences;
  }
};

const Settings = () => {
  const navigate = useNavigate();
  const { mode, setMode } = useThemeMode();

  const [user] = useState(getStoredUser);
  const [preferences, setPreferences] = useState(
    getStoredPreferences
  );

  const [logoutOpen, setLogoutOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const token = localStorage.getItem("token");

  const userName = user?.name || "Nexus User";
  const userEmail = user?.email || "Email unavailable";
  const userRole = user?.role || "employee";

  const initials = useMemo(() => {
    const words = userName
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (words.length === 0) return "NU";

    return words
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  }, [userName]);

  const roleStyle = useMemo(() => {
    const normalizedRole = userRole.toLowerCase();

    if (normalizedRole === "admin") {
      return {
        color: "#B91C1C",
        background: "#FEF2F2",
        border: "#FECACA",
      };
    }

    if (normalizedRole === "hr") {
      return {
        color: "#B45309",
        background: "#FFFBEB",
        border: "#FDE68A",
      };
    }

    return {
      color: "#4338CA",
      background: "#EEF2FF",
      border: "#C7D2FE",
    };
  }, [userRole]);

  const handlePreferenceChange = (preferenceName) => {
    setPreferences((currentPreferences) => ({
      ...currentPreferences,
      [preferenceName]:
        !currentPreferences[preferenceName],
    }));
  };

  const savePreferences = () => {
    localStorage.setItem(
      "nexus_preferences",
      JSON.stringify(preferences)
    );

    toast.success("Preferences saved successfully");
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    setMode("light");

    localStorage.setItem(
      "nexus_preferences",
      JSON.stringify(defaultPreferences)
    );

    toast.success("Preferences reset");
  };

  const handleLogout = () => {
    try {
      setLoggingOut(true);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      toast.success("Logged out successfully");

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Unable to log out");
    } finally {
      setLoggingOut(false);
      setLogoutOpen(false);
    }
  };

  const PreferenceRow = ({
    icon,
    title,
    description,
    checked,
    onChange,
    disabled = false,
    badge,
  }) => (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      gap={2}
      sx={{
        py: 2,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        gap={1.5}
        sx={{
          minWidth: 0,
        }}
      >
        <Box
          sx={{
            width: 42,
            height: 42,
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
            color: disabled ? "#94A3B8" : "#4F46E5",
            backgroundColor: disabled
              ? "#F1F5F9"
              : "#EEF2FF",
            borderRadius: 2.5,
          }}
        >
          {icon}
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Stack
            direction="row"
            alignItems="center"
            gap={1}
            flexWrap="wrap"
          >
            <Typography
              fontWeight={800}
              sx={{
                color: disabled
                  ? "#64748B !important"
                  : "#0F172A !important",
              }}
            >
              {title}
            </Typography>

            {badge && (
              <Chip
                label={badge}
                size="small"
                sx={{
                  height: 23,
                  color: "#7C3AED !important",
                  backgroundColor: "#F5F3FF !important",
                  border: "1px solid #DDD6FE",
                  fontSize: 10,
                  fontWeight: 800,

                  "& .MuiChip-label": {
                    color: "#7C3AED !important",
                  },
                }}
              />
            )}
          </Stack>

          <Typography
            sx={{
              color: "#64748B !important",
              fontSize: 12,
              lineHeight: 1.5,
              mt: 0.3,
            }}
          >
            {description}
          </Typography>
        </Box>
      </Stack>

      <Switch
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        color="primary"
      />
    </Stack>
  );

  return (
    <Box
      sx={{
        width: "100%",
        color: "#0F172A",
      }}
    >
      {/* Header */}
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
        <Stack
          direction="row"
          alignItems="center"
          gap={1.3}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              display: "grid",
              placeItems: "center",
              color: "#475569",
              backgroundColor: "#F1F5F9",
              borderRadius: 3,
            }}
          >
            <SettingsRounded />
          </Box>

          <Box>
            <Typography
              variant="h4"
              fontWeight={900}
              sx={{
                color: "#0F172A !important",
                fontSize: {
                  xs: "1.8rem",
                  md: "2.15rem",
                },
              }}
            >
              Settings
            </Typography>

            <Typography
              sx={{
                color: "#64748B !important",
                mt: 0.3,
              }}
            >
              Manage your account, preferences and session.
            </Typography>
          </Box>
        </Stack>

        <Chip
          icon={<VerifiedUserRounded />}
          label={token ? "Secure Session Active" : "No Active Session"}
          sx={{
            color: token
              ? "#15803D !important"
              : "#B91C1C !important",
            backgroundColor: token
              ? "#F0FDF4 !important"
              : "#FEF2F2 !important",
            border: token
              ? "1px solid #BBF7D0"
              : "1px solid #FECACA",
            fontWeight: 800,

            "& .MuiChip-label": {
              color: token
                ? "#15803D !important"
                : "#B91C1C !important",
            },

            "& .MuiChip-icon": {
              color: token
                ? "#16A34A !important"
                : "#DC2626 !important",
            },
          }}
        />
      </Stack>

      <Grid container spacing={3}>
        {/* Account Profile */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              border: "1px solid #E2E8F0",
              backgroundColor: "#FFFFFF !important",
              color: "#0F172A !important",
            }}
          >
            <CardContent
              sx={{
                p: {
                  xs: 2.5,
                  md: 3,
                },

                "&:last-child": {
                  pb: {
                    xs: 2.5,
                    md: 3,
                  },
                },
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                gap={1}
                mb={2.5}
              >
                <AccountCircleRounded
                  sx={{
                    color: "#4F46E5",
                  }}
                />

                <Typography
                  variant="h6"
                  fontWeight={900}
                  sx={{
                    color: "#0F172A !important",
                  }}
                >
                  Account Profile
                </Typography>
              </Stack>

              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  textAlign: "center",
                  borderRadius: 3,
                  border: "1px solid #E2E8F0",
                  background:
                    "linear-gradient(135deg, #F8FAFC, #EEF2FF) !important",
                }}
              >
                <Avatar
                  sx={{
                    width: 78,
                    height: 78,
                    mx: "auto",
                    mb: 1.5,
                    color: "#FFFFFF",
                    background:
                      "linear-gradient(135deg, #4F46E5, #7C3AED)",
                    fontSize: 25,
                    fontWeight: 900,
                  }}
                >
                  {initials}
                </Avatar>

                <Typography
                  variant="h6"
                  fontWeight={900}
                  sx={{
                    color: "#0F172A !important",
                  }}
                >
                  {userName}
                </Typography>

                <Typography
                  sx={{
                    color: "#64748B !important",
                    fontSize: 13,
                    mt: 0.4,
                    wordBreak: "break-word",
                  }}
                >
                  {userEmail}
                </Typography>

                <Chip
                  label={userRole.toUpperCase()}
                  size="small"
                  sx={{
                    mt: 1.5,
                    color: `${roleStyle.color} !important`,
                    backgroundColor:
                      `${roleStyle.background} !important`,
                    border: `1px solid ${roleStyle.border}`,
                    fontWeight: 900,

                    "& .MuiChip-label": {
                      color: `${roleStyle.color} !important`,
                    },
                  }}
                />
              </Paper>

              <Divider
                sx={{
                  my: 2.5,
                  borderColor: "#E2E8F0",
                }}
              />

              <Stack spacing={1.5}>
                <Stack
                  direction="row"
                  alignItems="center"
                  gap={1.2}
                >
                  <PersonRounded
                    sx={{
                      color: "#64748B",
                      fontSize: 20,
                    }}
                  />

                  <Box>
                    <Typography
                      sx={{
                        color: "#94A3B8 !important",
                        fontSize: 10,
                        fontWeight: 800,
                        textTransform: "uppercase",
                      }}
                    >
                      Account name
                    </Typography>

                    <Typography
                      sx={{
                        color: "#0F172A !important",
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      {userName}
                    </Typography>
                  </Box>
                </Stack>

                <Stack
                  direction="row"
                  alignItems="center"
                  gap={1.2}
                >
                  <EmailRounded
                    sx={{
                      color: "#64748B",
                      fontSize: 20,
                    }}
                  />

                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        color: "#94A3B8 !important",
                        fontSize: 10,
                        fontWeight: 800,
                        textTransform: "uppercase",
                      }}
                    >
                      Email address
                    </Typography>

                    <Typography
                      noWrap
                      sx={{
                        color: "#0F172A !important",
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      {userEmail}
                    </Typography>
                  </Box>
                </Stack>

                <Stack
                  direction="row"
                  alignItems="center"
                  gap={1.2}
                >
                  <SecurityRounded
                    sx={{
                      color: "#64748B",
                      fontSize: 20,
                    }}
                  />

                  <Box>
                    <Typography
                      sx={{
                        color: "#94A3B8 !important",
                        fontSize: 10,
                        fontWeight: 800,
                        textTransform: "uppercase",
                      }}
                    >
                      Access level
                    </Typography>

                    <Typography
                      sx={{
                        color: "#0F172A !important",
                        fontSize: 13,
                        fontWeight: 700,
                        textTransform: "capitalize",
                      }}
                    >
                      {userRole}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Preferences */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper
            elevation={0}
            sx={{
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
              direction="row"
              alignItems="center"
              gap={1}
            >
              <NotificationsActiveRounded
                sx={{
                  color: "#4F46E5",
                }}
              />

              <Box>
                <Typography
                  variant="h6"
                  fontWeight={900}
                  sx={{
                    color: "#0F172A !important",
                  }}
                >
                  Application Preferences
                </Typography>

                <Typography
                  sx={{
                    color: "#64748B !important",
                    fontSize: 12,
                    mt: 0.2,
                  }}
                >
                  Personalize your Nexus AI workspace.
                </Typography>
              </Box>
            </Stack>

            <Divider
              sx={{
                mt: 2.5,
                borderColor: "#E2E8F0",
              }}
            />

            <PreferenceRow
              icon={<EmailRounded />}
              title="Email Notifications"
              description="Receive important workplace and account notifications."
              checked={preferences.emailNotifications}
              onChange={() =>
                handlePreferenceChange(
                  "emailNotifications"
                )
              }
            />

            <Divider
              sx={{
                borderColor: "#E2E8F0",
              }}
            />

            <PreferenceRow
              icon={<AutoAwesomeRounded />}
              title="AI Suggestions"
              description="Show helpful AI prompts and workflow recommendations."
              checked={preferences.aiSuggestions}
              onChange={() =>
                handlePreferenceChange("aiSuggestions")
              }
            />

            <Divider
              sx={{
                borderColor: "#E2E8F0",
              }}
            />

            <PreferenceRow
              icon={<NotificationsActiveRounded />}
              title="Activity Updates"
              description="Display updates when documents, employees or agents change."
              checked={preferences.activityUpdates}
              onChange={() =>
                handlePreferenceChange("activityUpdates")
              }
            />

            <Divider
              sx={{
                borderColor: "#E2E8F0",
              }}
            />

            <PreferenceRow
              icon={<DarkModeRounded />}
              title="Dark Mode"
              description="Switch the Nexus AI workspace between light and dark mode."
              checked={mode === "dark"}
              onChange={() =>
                setMode(mode === "dark" ? "light" : "dark")
              }
            />

            <Divider
              sx={{
                mb: 2.5,
                borderColor: "#E2E8F0",
              }}
            />

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              justifyContent="flex-end"
              gap={1.5}
            >
              <Button
                onClick={resetPreferences}
                startIcon={<RefreshRounded />}
                sx={{
                  color: "#475569 !important",
                  border: "1px solid #CBD5E1",
                  borderRadius: 2.5,
                  px: 2,
                  fontWeight: 800,
                  textTransform: "none",
                }}
              >
                Reset Preferences
              </Button>

              <Button
                variant="contained"
                onClick={savePreferences}
                startIcon={<SaveRounded />}
                sx={{
                  color: "#FFFFFF !important",
                  background:
                    "linear-gradient(135deg, #4F46E5, #7C3AED) !important",
                  borderRadius: 2.5,
                  px: 2.5,
                  fontWeight: 800,
                  textTransform: "none",
                }}
              >
                Save Preferences
              </Button>
            </Stack>
          </Paper>

          {/* Security */}
          <Paper
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
              direction="row"
              alignItems="center"
              gap={1}
            >
              <LockRounded
                sx={{
                  color: "#DC2626",
                }}
              />

              <Box>
                <Typography
                  variant="h6"
                  fontWeight={900}
                  sx={{
                    color: "#0F172A !important",
                  }}
                >
                  Session & Security
                </Typography>

                <Typography
                  sx={{
                    color: "#64748B !important",
                    fontSize: 12,
                    mt: 0.2,
                  }}
                >
                  Manage the current browser login session.
                </Typography>
              </Box>
            </Stack>

            <Divider
              sx={{
                my: 2.5,
                borderColor: "#E2E8F0",
              }}
            />

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              justifyContent="space-between"
              alignItems={{
                xs: "stretch",
                sm: "center",
              }}
              gap={2}
            >
              <Stack
                direction="row"
                alignItems="center"
                gap={1.4}
              >
                <Box
                  sx={{
                    width: 43,
                    height: 43,
                    display: "grid",
                    placeItems: "center",
                    color: token ? "#16A34A" : "#DC2626",
                    backgroundColor: token
                      ? "#F0FDF4"
                      : "#FEF2F2",
                    borderRadius: 2.5,
                  }}
                >
                  <VerifiedUserRounded />
                </Box>

                <Box>
                  <Typography
                    fontWeight={800}
                    sx={{
                      color: "#0F172A !important",
                    }}
                  >
                    Current browser session
                  </Typography>

                  <Typography
                    sx={{
                      color: "#64748B !important",
                      fontSize: 12,
                      mt: 0.3,
                    }}
                  >
                    {token
                      ? "Your JWT authentication session is active."
                      : "No authentication token was found."}
                  </Typography>
                </Box>
              </Stack>

              <Button
                variant="outlined"
                color="error"
                onClick={() => setLogoutOpen(true)}
                startIcon={<LogoutRounded />}
                sx={{
                  color: "#DC2626 !important",
                  borderColor: "#FCA5A5 !important",
                  borderRadius: 2.5,
                  px: 2.2,
                  py: 1,
                  fontWeight: 800,
                  textTransform: "none",

                  "&:hover": {
                    borderColor: "#DC2626 !important",
                    backgroundColor: "#FEF2F2 !important",
                  },
                }}
              >
                Log Out
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Logout Confirmation */}
      <Dialog
        open={logoutOpen}
        onClose={() => {
          if (!loggingOut) {
            setLogoutOpen(false);
          }
        }}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            backgroundColor: "#FFFFFF !important",
            color: "#0F172A !important",
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "#0F172A !important",
            fontWeight: 900,
          }}
        >
          Log Out of Nexus AI?
        </DialogTitle>

        <DialogContent>
          <Alert
            severity="warning"
            sx={{
              borderRadius: 2.5,
            }}
          >
            Your current browser session will end. You will need
            to enter your email and password again to continue.
          </Alert>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 3,
          }}
        >
          <Button
            onClick={() => setLogoutOpen(false)}
            disabled={loggingOut}
            sx={{
              color: "#475569 !important",
              fontWeight: 800,
              textTransform: "none",
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleLogout}
            disabled={loggingOut}
            startIcon={
              loggingOut ? (
                <RefreshRounded />
              ) : (
                <LogoutRounded />
              )
            }
            sx={{
              color: "#FFFFFF !important",
              backgroundColor: "#DC2626 !important",
              borderRadius: 2,
              fontWeight: 800,
              textTransform: "none",

              "&:hover": {
                backgroundColor: "#B91C1C !important",
              },
            }}
          >
            {loggingOut ? "Logging Out..." : "Log Out"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings;