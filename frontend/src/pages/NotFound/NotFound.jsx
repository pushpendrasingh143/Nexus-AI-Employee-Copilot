import { useNavigate } from "react-router-dom";

import {
  ArrowBackRounded,
  DashboardRounded,
  ErrorOutlineRounded,
  LoginRounded,
} from "@mui/icons-material";

import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import { isTokenValid } from "../../utils/auth";

const NotFound = () => {
  const navigate = useNavigate();
  const authenticated = isTokenValid();

  const destination = authenticated
    ? "/dashboard"
    : "/login";

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        p: 3,
        display: "grid",
        placeItems: "center",
        overflow: "hidden",
        background:
          "radial-gradient(circle at 20% 20%, rgba(99,102,241,0.13), transparent 35%), radial-gradient(circle at 80% 80%, rgba(124,58,237,0.12), transparent 35%), #F8FAFC",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: 620,
          px: {
            xs: 3,
            sm: 6,
          },
          py: {
            xs: 5,
            sm: 7,
          },
          textAlign: "center",
          borderRadius: 6,
          border: "1px solid #E2E8F0",
          color: "#0F172A !important",
          backgroundColor: "#FFFFFF !important",
          boxShadow:
            "0 25px 70px rgba(15,23,42,0.12)",
        }}
      >
        <Chip
          icon={<ErrorOutlineRounded />}
          label="Navigation Error"
          sx={{
            mb: 3,
            color: "#B45309 !important",
            backgroundColor: "#FFFBEB !important",
            border: "1px solid #FDE68A",
            fontWeight: 800,

            "& .MuiChip-label": {
              color: "#B45309 !important",
            },

            "& .MuiChip-icon": {
              color: "#D97706 !important",
            },
          }}
        />

        <Typography
          sx={{
            color: "#4F46E5 !important",
            fontSize: {
              xs: "5rem",
              sm: "7rem",
            },
            fontWeight: 950,
            lineHeight: 0.9,
            letterSpacing: "-0.08em",
          }}
        >
          404
        </Typography>

        <Typography
          variant="h4"
          fontWeight={900}
          sx={{
            mt: 3,
            color: "#0F172A !important",
          }}
        >
          Page Not Found
        </Typography>

        <Typography
          sx={{
            maxWidth: 430,
            mx: "auto",
            mt: 1.5,
            color: "#64748B !important",
            lineHeight: 1.7,
          }}
        >
          The page may have been removed, renamed, or the
          address may be incorrect.
        </Typography>

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          justifyContent="center"
          gap={1.5}
          mt={4}
        >
          <Button
            onClick={() => navigate(-1)}
            startIcon={<ArrowBackRounded />}
            sx={{
              px: 2.5,
              py: 1.1,
              color: "#475569 !important",
              border: "1px solid #CBD5E1",
              borderRadius: 2.5,
              fontWeight: 800,
              textTransform: "none",
            }}
          >
            Go Back
          </Button>

          <Button
            variant="contained"
            onClick={() =>
              navigate(destination, {
                replace: true,
              })
            }
            startIcon={
              authenticated ? (
                <DashboardRounded />
              ) : (
                <LoginRounded />
              )
            }
            sx={{
              px: 2.8,
              py: 1.1,
              color: "#FFFFFF !important",
              background:
                "linear-gradient(135deg, #4F46E5, #7C3AED) !important",
              borderRadius: 2.5,
              fontWeight: 800,
              textTransform: "none",
            }}
          >
            {authenticated
              ? "Back to Dashboard"
              : "Go to Login"}
          </Button>
        </Stack>

        <Typography
          sx={{
            mt: 4,
            color: "#94A3B8 !important",
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          Nexus AI Employee Copilot
        </Typography>
      </Paper>
    </Box>
  );
};

export default NotFound;