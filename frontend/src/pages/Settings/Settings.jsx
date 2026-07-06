import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  Divider,
} from "@mui/material";

const Settings = () => {
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={1}>
        Settings
      </Typography>

      <Typography color="text.secondary" mb={4}>
        Manage your application preferences.
      </Typography>

      <Card sx={{ borderRadius: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            General
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Box
            display="flex"
            justifyContent="space-between"
            mb={2}
          >
            <Typography>Dark Mode</Typography>

            <Switch />
          </Box>

          <Box
            display="flex"
            justifyContent="space-between"
            mb={2}
          >
            <Typography>Email Notifications</Typography>

            <Switch defaultChecked />
          </Box>

          <Box
            display="flex"
            justifyContent="space-between"
          >
            <Typography>AI Suggestions</Typography>

            <Switch defaultChecked />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Settings;