import { useState } from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import {
  askHrAgent,
  generateEmailDraft,
  generateMeetingSchedule,
  generateTaskPlan,
  generateReport,
  searchKnowledge,
  processVoiceCommand,
  googleWorkspaceAction,
  microsoft365Action,
  collaborationAction,
  getSystemStatus,
  getFeatureRegistry,
} from "../../services/agent.service";

const agentOptions = [
  {
    key: "hr",
    title: "HR Agent",
    description: "Leave policy, HR policy, employee support",
  },
  {
    key: "email",
    title: "Email Agent",
    description: "Professional email draft generation",
  },
  {
    key: "meeting",
    title: "Meeting Scheduler Agent",
    description: "Meeting agenda, participants, follow-up tasks",
  },
  {
    key: "task",
    title: "Task Manager Agent",
    description: "Task plan, priority, execution steps",
  },
  {
    key: "report",
    title: "Report Generator Agent",
    description: "AI-powered business reports",
  },
  {
    key: "knowledge",
    title: "Knowledge Agent",
    description: "Advanced enterprise document search",
  },
  {
    key: "voice",
    title: "Voice Assistant",
    description: "Transcript-based voice assistant demo",
  },
  {
    key: "google",
    title: "Google Workspace Demo",
    description: "Gmail, Calendar, Drive, Docs demo actions",
  },
  {
    key: "microsoft",
    title: "Microsoft 365 Demo",
    description: "Outlook, Teams, OneDrive, Word demo actions",
  },
  {
    key: "collaboration",
    title: "Slack & Teams Demo",
    description: "Slack/Teams messages, reminders, updates",
  },
  {
    key: "system",
    title: "System Status",
    description: "Backend, database, AI and demo readiness",
  },
  {
    key: "features",
    title: "Feature Registry",
    description: "Complete project features and roadmap",
  },
];

const Agents = () => {
  const [selectedAgent, setSelectedAgent] = useState("hr");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    question: "What is the leave policy?",
    prompt: "Write a professional email to HR asking for 2 days leave due to fever.",
    title: "Nexus AI Project Review Meeting",
    description: "Prepare final demo and presentation for university-level project evaluation.",
    recipient: "HR Manager",
    tone: "Professional",
    purpose: "Leave Request",
    date: "2026-07-12",
    time: "11:00 AM",
    participants: "HR Manager, Team Lead, Developer",
    priority: "high",
    dueDate: "2026-07-12",
    reportType: "AI Usage Report",
    period: "July 2026",
    transcript: "Summarize Nexus AI Employee Copilot project progress in short.",
    actionType: "project_update",
    platform: "Slack",
    channel: "#project-team",
  });

  const [result, setResult] = useState("");

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const participantsArray = form.participants
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const getResponseText = (response) => {
  const payload = response?.data;

  if (!payload) {
    return "No response received from server.";
  }

  const mainOutput =
    payload.answer ||
    payload.draft ||
    payload.schedule ||
    payload.plan ||
    payload.report ||
    payload.response ||
    payload.output;

  if (mainOutput) {
    return mainOutput;
  }

  if (payload.data) {
    return JSON.stringify(payload.data, null, 2);
  }

  return JSON.stringify(payload, null, 2);
};

  const runAgent = async () => {

    try {
      setLoading(true);
      setError("");
      setResult("Agent is running... please wait.");
      setResult("");

      let response;

      if (selectedAgent === "hr") {
        response = await askHrAgent({
          question: form.question,
        });
      }

      if (selectedAgent === "email") {
        response = await generateEmailDraft({
          prompt: form.prompt,
          recipient: form.recipient,
          tone: form.tone,
          purpose: form.purpose,
        });
      }

      if (selectedAgent === "meeting") {
        response = await generateMeetingSchedule({
          title: form.title,
          date: form.date,
          time: form.time,
          participants: participantsArray,
          purpose: form.purpose,
        });
      }

      if (selectedAgent === "task") {
        response = await generateTaskPlan({
          title: form.title,
          description: form.description,
          priority: form.priority,
          dueDate: form.dueDate,
        });
      }

      if (selectedAgent === "report") {
        response = await generateReport({
          reportType: form.reportType,
          title: form.title,
          period: form.period,
          instructions: form.description,
          includeAnalytics: true,
        });
      }

      if (selectedAgent === "knowledge") {
        response = await searchKnowledge({
          question: form.question,
        });
      }

      if (selectedAgent === "voice") {
        response = await processVoiceCommand({
          transcript: form.transcript,
          intent: "project_assistant",
        });
      }

      if (selectedAgent === "google") {
        response = await googleWorkspaceAction({
          actionType: form.actionType,
          prompt: form.prompt,
          recipient: form.recipient,
          date: form.date,
          time: form.time,
          participants: participantsArray,
        });
      }

      if (selectedAgent === "microsoft") {
        response = await microsoft365Action({
          actionType: form.actionType,
          prompt: form.prompt,
          recipient: form.recipient,
          date: form.date,
          time: form.time,
          participants: participantsArray,
          channel: form.channel,
        });
      }

      if (selectedAgent === "collaboration") {
        response = await collaborationAction({
          platform: form.platform,
          actionType: form.actionType,
          prompt: form.prompt,
          channel: form.channel,
          recipients: participantsArray,
          priority: form.priority,
        });
      }

      if (selectedAgent === "system") {
        response = await getSystemStatus();
      }

      if (selectedAgent === "features") {
        response = await getFeatureRegistry();
      }


const finalText = getResponseText(response);

setResult(finalText || "Response received but no readable output found.");
    }
    
    catch (err) {
  console.error("Agent Error:", err);

  const message =
    err.response?.data?.message ||
    err.message ||
    "Something went wrong";

  setError(message);
  setResult(`Error: ${message}`);
}
 finally {
      setLoading(false);
    }
  };

  const selected = agentOptions.find((agent) => agent.key === selectedAgent);

  return (
    <>
      <Typography variant="h4" fontWeight="bold">
        AI Agents & Integrations
      </Typography>

      <Typography color="text.secondary" mb={4}>
        Demo all Nexus AI Employee Copilot agents from one place.
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h6" mb={2}>
              Select Agent
            </Typography>

            <TextField
              select
              fullWidth
              label="Agent"
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
            >
              {agentOptions.map((agent) => (
                <MenuItem key={agent.key} value={agent.key}>
                  {agent.title}
                </MenuItem>
              ))}
            </TextField>

            <Box mt={3}>
              <Typography fontWeight="bold">{selected?.title}</Typography>
              <Typography color="text.secondary">
                {selected?.description}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h6" mb={2}>
              Agent Input
            </Typography>

            {(selectedAgent === "hr" || selectedAgent === "knowledge") && (
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Question"
                name="question"
                value={form.question}
                onChange={handleChange}
              />
            )}

            {[
              "email",
              "google",
              "microsoft",
              "collaboration",
            ].includes(selectedAgent) && (
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Prompt"
                name="prompt"
                value={form.prompt}
                onChange={handleChange}
              />
            )}

            {selectedAgent === "voice" && (
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Voice Transcript"
                name="transcript"
                value={form.transcript}
                onChange={handleChange}
              />
            )}

            {["meeting", "task", "report"].includes(selectedAgent) && (
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={form.title}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
            )}

            {["task", "report"].includes(selectedAgent) && (
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description / Instructions"
                name="description"
                value={form.description}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
            )}

            {["email", "google", "microsoft"].includes(selectedAgent) && (
              <TextField
                fullWidth
                label="Recipient"
                name="recipient"
                value={form.recipient}
                onChange={handleChange}
                sx={{ mt: 2 }}
              />
            )}

            {selectedAgent === "email" && (
              <TextField
                fullWidth
                label="Tone"
                name="tone"
                value={form.tone}
                onChange={handleChange}
                sx={{ mt: 2 }}
              />
            )}

            {["email", "meeting"].includes(selectedAgent) && (
              <TextField
                fullWidth
                label="Purpose"
                name="purpose"
                value={form.purpose}
                onChange={handleChange}
                sx={{ mt: 2 }}
              />
            )}

            {["meeting", "google", "microsoft"].includes(selectedAgent) && (
              <Grid container spacing={2} mt={1}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Time"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            )}

            {[
              "meeting",
              "google",
              "microsoft",
              "collaboration",
            ].includes(selectedAgent) && (
              <TextField
                fullWidth
                label="Participants / Recipients comma separated"
                name="participants"
                value={form.participants}
                onChange={handleChange}
                sx={{ mt: 2 }}
              />
            )}

            {["task", "collaboration"].includes(selectedAgent) && (
              <TextField
                fullWidth
                label="Priority"
                name="priority"
                value={form.priority}
                onChange={handleChange}
                sx={{ mt: 2 }}
              />
            )}

            {selectedAgent === "task" && (
              <TextField
                fullWidth
                label="Due Date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                sx={{ mt: 2 }}
              />
            )}

            {selectedAgent === "report" && (
              <>
                <TextField
                  fullWidth
                  label="Report Type"
                  name="reportType"
                  value={form.reportType}
                  onChange={handleChange}
                  sx={{ mt: 2 }}
                />

                <TextField
                  fullWidth
                  label="Period"
                  name="period"
                  value={form.period}
                  onChange={handleChange}
                  sx={{ mt: 2 }}
                />
              </>
            )}

            {["google", "microsoft", "collaboration"].includes(
              selectedAgent
            ) && (
              <TextField
                fullWidth
                label="Action Type"
                name="actionType"
                value={form.actionType}
                onChange={handleChange}
                sx={{ mt: 2 }}
              />
            )}

            {selectedAgent === "collaboration" && (
              <TextField
                fullWidth
                label="Platform"
                name="platform"
                value={form.platform}
                onChange={handleChange}
                sx={{ mt: 2 }}
              />
            )}

            {["microsoft", "collaboration"].includes(selectedAgent) && (
              <TextField
                fullWidth
                label="Channel"
                name="channel"
                value={form.channel}
                onChange={handleChange}
                sx={{ mt: 2 }}
              />
            )}

            <Button
              variant="contained"
              size="large"
              onClick={runAgent}
              disabled={loading}
              sx={{ mt: 3 }}
            >
              {loading ? <CircularProgress size={24} /> : "Run Agent"}
            </Button>

            {error && (
              <Alert severity="error" sx={{ mt: 3 }}>
                {error}
              </Alert>
            )}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h6" mb={2}>
              Agent Response
            </Typography>

            <Box
  component="pre"
  sx={{
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    background: "#f8fafc",
    color: "#111827",
    p: 2,
    borderRadius: 3,
    minHeight: 160,
    fontFamily: "inherit",
    border: "1px solid #e5e7eb",
  }}
>
  {result ? String(result) : "Run any agent to see response here."}
</Box>

          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default Agents;