import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  Alert,
  Box,
  Button,
  ButtonBase,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  AssessmentRounded,
  AutoAwesomeRounded,
  BusinessCenterRounded,
  CalendarMonthRounded,
  CheckCircleRounded,
  CloudRounded,
  ContentCopyRounded,
  DnsRounded,
  EmailRounded,
  FactCheckRounded,
  GroupsRounded,
  HubRounded,
  ManageSearchRounded,
  PeopleAltRounded,
  PlayArrowRounded,
  RecordVoiceOverRounded,
  RefreshRounded,
  TaskAltRounded,
  WindowRounded,
} from "@mui/icons-material";

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

const today = new Date().toISOString().split("T")[0];

const initialForm = {
  question: "What is the company leave policy?",
  prompt:
    "Write a professional email to HR asking for 2 days leave due to fever.",
  title: "Nexus AI Project Review Meeting",
  description:
    "Prepare the final demo and project review for the team.",
  recipient: "HR Manager",
  tone: "Professional",
  purpose: "Leave Request",
  date: today,
  time: "11:00",
  participants: "HR Manager, Team Lead, Developer",
  priority: "high",
  dueDate: today,
  reportType: "AI Usage Report",
  period: "July 2026",
  transcript:
    "Summarize the Nexus AI Employee Copilot project progress.",
  actionType: "project_update",
  platform: "Slack",
  channel: "#project-team",
};

const agentOptions = [
  {
    key: "hr",
    title: "HR Agent",
    description:
      "Answer employee questions about leave, HR policies and workplace support.",
    category: "AI Agent",
    Icon: PeopleAltRounded,
    accent: "#4F46E5",
    soft: "#EEF2FF",
  },
  {
    key: "email",
    title: "Email Agent",
    description:
      "Generate professional workplace emails with recipient, tone and purpose.",
    category: "AI Agent",
    Icon: EmailRounded,
    accent: "#2563EB",
    soft: "#EFF6FF",
  },
  {
    key: "meeting",
    title: "Meeting Scheduler",
    description:
      "Prepare meeting schedules, agendas, participants and follow-up actions.",
    category: "AI Agent",
    Icon: CalendarMonthRounded,
    accent: "#0891B2",
    soft: "#ECFEFF",
  },
  {
    key: "task",
    title: "Task Manager",
    description:
      "Create structured execution plans with priorities and deadlines.",
    category: "AI Agent",
    Icon: TaskAltRounded,
    accent: "#16A34A",
    soft: "#F0FDF4",
  },
  {
    key: "report",
    title: "Report Generator",
    description:
      "Generate structured business and project reports using AI.",
    category: "AI Agent",
    Icon: AssessmentRounded,
    accent: "#EA580C",
    soft: "#FFF7ED",
  },
  {
    key: "knowledge",
    title: "Knowledge Agent",
    description:
      "Search organizational knowledge and retrieve relevant information.",
    category: "AI Agent",
    Icon: ManageSearchRounded,
    accent: "#7C3AED",
    soft: "#F5F3FF",
  },
  {
    key: "voice",
    title: "Voice Assistant",
    description:
      "Process voice transcripts and convert commands into useful outputs.",
    category: "AI Agent",
    Icon: RecordVoiceOverRounded,
    accent: "#DB2777",
    soft: "#FDF2F8",
  },
  {
    key: "google",
    title: "Google Workspace",
    description:
      "Demonstrate actions for Gmail, Calendar, Drive and Google Docs.",
    category: "Integration",
    Icon: CloudRounded,
    accent: "#2563EB",
    soft: "#EFF6FF",
  },
  {
    key: "microsoft",
    title: "Microsoft 365",
    description:
      "Demonstrate Outlook, Teams, OneDrive and Microsoft productivity actions.",
    category: "Integration",
    Icon: WindowRounded,
    accent: "#0284C7",
    soft: "#F0F9FF",
  },
  {
    key: "collaboration",
    title: "Slack & Teams",
    description:
      "Generate collaboration messages, reminders and project updates.",
    category: "Integration",
    Icon: GroupsRounded,
    accent: "#9333EA",
    soft: "#FAF5FF",
  },
  {
    key: "system",
    title: "System Status",
    description:
      "Check backend, database, AI services and deployment readiness.",
    category: "System",
    Icon: DnsRounded,
    accent: "#059669",
    soft: "#ECFDF5",
  },
  {
    key: "features",
    title: "Feature Registry",
    description:
      "Review current product features, supported agents and future roadmap.",
    category: "System",
    Icon: FactCheckRounded,
    accent: "#475569",
    soft: "#F8FAFC",
  },
];

const fieldStyles = {
  "& .MuiOutlinedInput-root": {
    color: "#0F172A !important",
    backgroundColor: "#FFFFFF !important",
    borderRadius: 2.5,

    "& fieldset": {
      borderColor: "#CBD5E1",
    },

    "&:hover fieldset": {
      borderColor: "#818CF8",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#4F46E5",
    },
  },

  "& .MuiInputLabel-root": {
    color: "#64748B !important",
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: "#4F46E5 !important",
  },

  "& .MuiInputBase-input": {
    color: "#0F172A !important",
  },

  "& textarea": {
    color: "#0F172A !important",
  },

  "& .MuiSelect-select": {
    color: "#0F172A !important",
  },

  "& .MuiSvgIcon-root": {
    color: "#64748B",
  },
};

const getResponseText = (response) => {
  const payload = response?.data ?? response;

  if (!payload) {
    return "No response received from the server.";
  }

  const nestedPayload = payload.data;

  const mainOutput =
    payload.answer ||
    payload.draft ||
    payload.schedule ||
    payload.plan ||
    payload.report ||
    payload.response ||
    payload.output ||
    nestedPayload?.answer ||
    nestedPayload?.draft ||
    nestedPayload?.schedule ||
    nestedPayload?.plan ||
    nestedPayload?.report ||
    nestedPayload?.response ||
    nestedPayload?.output;

  if (typeof mainOutput === "string") {
    return mainOutput;
  }

  if (mainOutput !== undefined && mainOutput !== null) {
    return JSON.stringify(mainOutput, null, 2);
  }

  if (nestedPayload !== undefined && nestedPayload !== null) {
    if (typeof nestedPayload === "string") {
      return nestedPayload;
    }

    return JSON.stringify(nestedPayload, null, 2);
  }

  if (typeof payload === "string") {
    return payload;
  }

  return JSON.stringify(payload, null, 2);
};

const Agents = () => {
  const [selectedAgent, setSelectedAgent] = useState("hr");
  const [form, setForm] = useState(initialForm);

  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selected = useMemo(
    () =>
      agentOptions.find(
        (agent) => agent.key === selectedAgent
      ) || agentOptions[0],
    [selectedAgent]
  );

  const participantsArray = useMemo(
    () =>
      form.participants
        .split(",")
        .map((participant) => participant.trim())
        .filter(Boolean),
    [form.participants]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleAgentSelect = (agentKey) => {
    setSelectedAgent(agentKey);
    setResult("");
    setError("");
  };

  const validateInput = () => {
    if (
      ["hr", "knowledge"].includes(selectedAgent) &&
      !form.question.trim()
    ) {
      return "Please enter a question.";
    }

    if (
      ["email", "google", "microsoft", "collaboration"].includes(
        selectedAgent
      ) &&
      !form.prompt.trim()
    ) {
      return "Please enter a prompt.";
    }

    if (
      ["meeting", "task", "report"].includes(selectedAgent) &&
      !form.title.trim()
    ) {
      return "Please enter a title.";
    }

    if (
      selectedAgent === "voice" &&
      !form.transcript.trim()
    ) {
      return "Please enter a voice transcript.";
    }

    return "";
  };

  const runAgent = async () => {
    const validationError = validateInput();

    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult("");

      let response;

      switch (selectedAgent) {
        case "hr":
          response = await askHrAgent({
            question: form.question.trim(),
          });
          break;

        case "email":
          response = await generateEmailDraft({
            prompt: form.prompt.trim(),
            recipient: form.recipient.trim(),
            tone: form.tone,
            purpose: form.purpose.trim(),
          });
          break;

        case "meeting":
          response = await generateMeetingSchedule({
            title: form.title.trim(),
            date: form.date,
            time: form.time,
            participants: participantsArray,
            purpose: form.purpose.trim(),
          });
          break;

        case "task":
          response = await generateTaskPlan({
            title: form.title.trim(),
            description: form.description.trim(),
            priority: form.priority,
            dueDate: form.dueDate,
          });
          break;

        case "report":
          response = await generateReport({
            reportType: form.reportType.trim(),
            title: form.title.trim(),
            period: form.period.trim(),
            instructions: form.description.trim(),
            includeAnalytics: true,
          });
          break;

        case "knowledge":
          response = await searchKnowledge({
            question: form.question.trim(),
          });
          break;

        case "voice":
          response = await processVoiceCommand({
            transcript: form.transcript.trim(),
            intent: "project_assistant",
          });
          break;

        case "google":
          response = await googleWorkspaceAction({
            actionType: form.actionType,
            prompt: form.prompt.trim(),
            recipient: form.recipient.trim(),
            date: form.date,
            time: form.time,
            participants: participantsArray,
          });
          break;

        case "microsoft":
          response = await microsoft365Action({
            actionType: form.actionType,
            prompt: form.prompt.trim(),
            recipient: form.recipient.trim(),
            date: form.date,
            time: form.time,
            participants: participantsArray,
            channel: form.channel.trim(),
          });
          break;

        case "collaboration":
          response = await collaborationAction({
            platform: form.platform,
            actionType: form.actionType,
            prompt: form.prompt.trim(),
            channel: form.channel.trim(),
            recipients: participantsArray,
            priority: form.priority,
          });
          break;

        case "system":
          response = await getSystemStatus();
          break;

        case "features":
          response = await getFeatureRegistry();
          break;

        default:
          throw new Error("Unsupported agent selected.");
      }

      const output = getResponseText(response);

      setResult(
        output ||
          "The request completed but no readable output was returned."
      );

      toast.success(`${selected.title} completed`);
    } catch (requestError) {
      console.error("Agent error:", requestError);

      const message =
        requestError.response?.data?.message ||
        requestError.message ||
        "The agent request failed.";

      setError(message);
      setResult("");
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result);
      toast.success("Agent response copied");
    } catch (copyError) {
      console.error("Copy error:", copyError);
      toast.error("Unable to copy response");
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setResult("");
    setError("");
  };

  const renderAgentInputs = () => (
    <Stack spacing={2}>
      {["hr", "knowledge"].includes(selectedAgent) && (
        <TextField
          fullWidth
          multiline
          minRows={4}
          maxRows={8}
          label="Question"
          name="question"
          value={form.question}
          onChange={handleChange}
          placeholder="Enter your workplace question..."
          sx={fieldStyles}
        />
      )}

      {["email", "google", "microsoft", "collaboration"].includes(
        selectedAgent
      ) && (
        <TextField
          fullWidth
          multiline
          minRows={4}
          maxRows={8}
          label="Prompt"
          name="prompt"
          value={form.prompt}
          onChange={handleChange}
          placeholder="Describe what the agent should generate..."
          sx={fieldStyles}
        />
      )}

      {selectedAgent === "voice" && (
        <TextField
          fullWidth
          multiline
          minRows={4}
          maxRows={8}
          label="Voice Transcript"
          name="transcript"
          value={form.transcript}
          onChange={handleChange}
          placeholder="Paste or enter the voice transcript..."
          sx={fieldStyles}
        />
      )}

      {["meeting", "task", "report"].includes(
        selectedAgent
      ) && (
        <TextField
          fullWidth
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          sx={fieldStyles}
        />
      )}

      {["task", "report"].includes(selectedAgent) && (
        <TextField
          fullWidth
          multiline
          minRows={3}
          maxRows={7}
          label="Description / Instructions"
          name="description"
          value={form.description}
          onChange={handleChange}
          sx={fieldStyles}
        />
      )}

      {["email", "google", "microsoft"].includes(
        selectedAgent
      ) && (
        <TextField
          fullWidth
          label="Recipient"
          name="recipient"
          value={form.recipient}
          onChange={handleChange}
          sx={fieldStyles}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PeopleAltRounded fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      )}

      {selectedAgent === "email" && (
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select
              fullWidth
              label="Tone"
              name="tone"
              value={form.tone}
              onChange={handleChange}
              sx={fieldStyles}
            >
              <MenuItem value="Professional">
                Professional
              </MenuItem>
              <MenuItem value="Formal">Formal</MenuItem>
              <MenuItem value="Friendly">Friendly</MenuItem>
              <MenuItem value="Concise">Concise</MenuItem>
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Purpose"
              name="purpose"
              value={form.purpose}
              onChange={handleChange}
              sx={fieldStyles}
            />
          </Grid>
        </Grid>
      )}

      {selectedAgent === "meeting" && (
        <TextField
          fullWidth
          label="Meeting Purpose"
          name="purpose"
          value={form.purpose}
          onChange={handleChange}
          sx={fieldStyles}
        />
      )}

      {["meeting", "google", "microsoft"].includes(
        selectedAgent
      ) && (
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              type="date"
              label="Date"
              name="date"
              value={form.date}
              onChange={handleChange}
              sx={fieldStyles}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              type="time"
              label="Time"
              name="time"
              value={form.time}
              onChange={handleChange}
              sx={fieldStyles}
              InputLabelProps={{
                shrink: true,
              }}
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
          label="Participants / Recipients"
          name="participants"
          value={form.participants}
          onChange={handleChange}
          helperText="Separate multiple people with commas."
          sx={{
            ...fieldStyles,

            "& .MuiFormHelperText-root": {
              color: "#64748B !important",
            },
          }}
        />
      )}

      {["task", "collaboration"].includes(
        selectedAgent
      ) && (
        <TextField
          select
          fullWidth
          label="Priority"
          name="priority"
          value={form.priority}
          onChange={handleChange}
          sx={fieldStyles}
        >
          <MenuItem value="low">Low</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="high">High</MenuItem>
          <MenuItem value="urgent">Urgent</MenuItem>
        </TextField>
      )}

      {selectedAgent === "task" && (
        <TextField
          fullWidth
          type="date"
          label="Due Date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
          sx={fieldStyles}
          InputLabelProps={{
            shrink: true,
          }}
        />
      )}

      {selectedAgent === "report" && (
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Report Type"
              name="reportType"
              value={form.reportType}
              onChange={handleChange}
              sx={fieldStyles}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Reporting Period"
              name="period"
              value={form.period}
              onChange={handleChange}
              sx={fieldStyles}
            />
          </Grid>
        </Grid>
      )}

      {["google", "microsoft", "collaboration"].includes(
        selectedAgent
      ) && (
        <TextField
          select
          fullWidth
          label="Action Type"
          name="actionType"
          value={form.actionType}
          onChange={handleChange}
          sx={fieldStyles}
        >
          <MenuItem value="project_update">
            Project Update
          </MenuItem>
          <MenuItem value="send_message">
            Send Message
          </MenuItem>
          <MenuItem value="create_meeting">
            Create Meeting
          </MenuItem>
          <MenuItem value="create_task">
            Create Task
          </MenuItem>
          <MenuItem value="summary">
            Generate Summary
          </MenuItem>
        </TextField>
      )}

      {selectedAgent === "collaboration" && (
        <TextField
          select
          fullWidth
          label="Platform"
          name="platform"
          value={form.platform}
          onChange={handleChange}
          sx={fieldStyles}
        >
          <MenuItem value="Slack">Slack</MenuItem>
          <MenuItem value="Microsoft Teams">
            Microsoft Teams
          </MenuItem>
        </TextField>
      )}

      {["microsoft", "collaboration"].includes(
        selectedAgent
      ) && (
        <TextField
          fullWidth
          label="Channel"
          name="channel"
          value={form.channel}
          onChange={handleChange}
          sx={fieldStyles}
        />
      )}
    </Stack>
  );

  const SelectedIcon = selected.Icon;

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
        <Stack direction="row" alignItems="center" gap={1.3}>
          <Box
            sx={{
              width: 48,
              height: 48,
              display: "grid",
              placeItems: "center",
              color: "#7C3AED",
              backgroundColor: "#F5F3FF",
              borderRadius: 3,
            }}
          >
            <HubRounded />
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
              AI Agents & Integrations
            </Typography>

            <Typography
              sx={{
                color: "#64748B !important",
                mt: 0.3,
              }}
            >
              Run specialized enterprise agents from one
              intelligent workspace.
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" gap={1}>
          <Chip
            icon={<CheckCircleRounded />}
            label={`${agentOptions.length} Capabilities`}
            sx={{
              color: "#15803D !important",
              backgroundColor: "#F0FDF4 !important",
              border: "1px solid #BBF7D0",
              fontWeight: 800,

              "& .MuiChip-label": {
                color: "#15803D !important",
              },

              "& .MuiChip-icon": {
                color: "#16A34A !important",
              },
            }}
          />

          <Chip
            label="Demo Ready"
            sx={{
              color: "#4338CA !important",
              backgroundColor: "#EEF2FF !important",
              border: "1px solid #C7D2FE",
              fontWeight: 800,

              "& .MuiChip-label": {
                color: "#4338CA !important",
              },
            }}
          />
        </Stack>
      </Stack>

      <Grid container spacing={3} alignItems="flex-start">
        {/* Agent Directory */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Paper
            elevation={0}
            sx={{
              p: {
                xs: 2,
                md: 2.5,
              },
              borderRadius: 4,
              border: "1px solid #E2E8F0",
              color: "#0F172A !important",
              backgroundColor: "#FFFFFF !important",
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              gap={1}
              mb={0.5}
            >
              <BusinessCenterRounded
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
                Agent Directory
              </Typography>
            </Stack>

            <Typography
              sx={{
                color: "#64748B !important",
                fontSize: 13,
                mb: 2,
              }}
            >
              Select an agent or integration to configure and
              run.
            </Typography>

            <Grid container spacing={1.5}>
              {agentOptions.map((agent) => {
                const Icon = agent.Icon;
                const isSelected =
                  selectedAgent === agent.key;

                return (
                  <Grid
                    key={agent.key}
                    size={{
                      xs: 12,
                      sm: 6,
                    }}
                  >
                    <ButtonBase
                      onClick={() =>
                        handleAgentSelect(agent.key)
                      }
                      sx={{
                        width: "100%",
                        height: "100%",
                        display: "block",
                        textAlign: "left",
                        borderRadius: 3,
                      }}
                    >
                      <Paper
                        elevation={0}
                        sx={{
                          height: "100%",
                          p: 1.7,
                          borderRadius: 3,
                          border: isSelected
                            ? `2px solid ${agent.accent}`
                            : "1px solid #E2E8F0",
                          backgroundColor: isSelected
                            ? `${agent.soft} !important`
                            : "#FFFFFF !important",
                          transition: "all 0.2s ease",

                          "&:hover": {
                            borderColor: agent.accent,
                            transform: "translateY(-2px)",
                            boxShadow:
                              "0 8px 20px rgba(15,23,42,0.07)",
                          },
                        }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="flex-start"
                          gap={1}
                        >
                          <Box
                            sx={{
                              width: 38,
                              height: 38,
                              display: "grid",
                              placeItems: "center",
                              color: agent.accent,
                              backgroundColor: agent.soft,
                              borderRadius: 2.3,
                              flexShrink: 0,
                            }}
                          >
                            <Icon fontSize="small" />
                          </Box>

                          {isSelected && (
                            <CheckCircleRounded
                              sx={{
                                color: agent.accent,
                                fontSize: 20,
                              }}
                            />
                          )}
                        </Stack>

                        <Typography
                          fontWeight={900}
                          sx={{
                            color: "#0F172A !important",
                            fontSize: 13,
                            mt: 1.2,
                          }}
                        >
                          {agent.title}
                        </Typography>

                        <Typography
                          sx={{
                            color: "#64748B !important",
                            fontSize: 11,
                            lineHeight: 1.5,
                            mt: 0.5,
                          }}
                        >
                          {agent.description}
                        </Typography>

                        <Chip
                          label={agent.category}
                          size="small"
                          sx={{
                            height: 23,
                            mt: 1.2,
                            color: `${agent.accent} !important`,
                            backgroundColor:
                              `${agent.soft} !important`,
                            border: `1px solid ${agent.accent}33`,
                            fontWeight: 800,
                            fontSize: 10,

                            "& .MuiChip-label": {
                              color:
                                `${agent.accent} !important`,
                              px: 1,
                            },
                          }}
                        />
                      </Paper>
                    </ButtonBase>
                  </Grid>
                );
              })}
            </Grid>
          </Paper>
        </Grid>

        {/* Agent Input */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Paper
            elevation={0}
            sx={{
              p: {
                xs: 2.5,
                md: 3,
              },
              borderRadius: 4,
              border: "1px solid #E2E8F0",
              color: "#0F172A !important",
              backgroundColor: "#FFFFFF !important",
            }}
          >
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
              <Stack
                direction="row"
                alignItems="center"
                gap={1.3}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    display: "grid",
                    placeItems: "center",
                    color: selected.accent,
                    backgroundColor: selected.soft,
                    borderRadius: 2.5,
                  }}
                >
                  <SelectedIcon />
                </Box>

                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={900}
                    sx={{
                      color: "#0F172A !important",
                    }}
                  >
                    {selected.title}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#64748B !important",
                      fontSize: 12,
                    }}
                  >
                    {selected.description}
                  </Typography>
                </Box>
              </Stack>

              <Chip
                label="Ready"
                icon={<CheckCircleRounded />}
                size="small"
                sx={{
                  color: "#15803D !important",
                  backgroundColor: "#F0FDF4 !important",
                  border: "1px solid #BBF7D0",
                  fontWeight: 800,

                  "& .MuiChip-label": {
                    color: "#15803D !important",
                  },

                  "& .MuiChip-icon": {
                    color: "#16A34A !important",
                  },
                }}
              />
            </Stack>

            <Divider
              sx={{
                my: 2.5,
                borderColor: "#E2E8F0",
              }}
            />

            {["system", "features"].includes(
              selectedAgent
            ) ? (
              <Alert
                severity="info"
                icon={<AutoAwesomeRounded />}
                sx={{
                  mb: 2.5,
                  borderRadius: 3,
                }}
              >
                This capability does not require input. Press
                the run button to retrieve the latest project
                information.
              </Alert>
            ) : (
              renderAgentInputs()
            )}

            {error && (
              <Alert
                severity="error"
                sx={{
                  mt: 2.5,
                  borderRadius: 3,
                }}
              >
                {error}
              </Alert>
            )}

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              justifyContent="space-between"
              gap={1.5}
              mt={3}
            >
              <Button
                onClick={handleReset}
                disabled={loading}
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
                Reset
              </Button>

              <Button
                variant="contained"
                size="large"
                onClick={runAgent}
                disabled={loading}
                startIcon={
                  loading ? (
                    <CircularProgress
                      size={18}
                      color="inherit"
                    />
                  ) : (
                    <PlayArrowRounded />
                  )
                }
                sx={{
                  minWidth: 180,
                  py: 1.15,
                  color: "#FFFFFF !important",
                  background:
                    `linear-gradient(135deg, ${selected.accent}, #7C3AED) !important`,
                  borderRadius: 2.5,
                  fontWeight: 800,
                  textTransform: "none",

                  "&:hover": {
                    opacity: 0.92,
                  },
                }}
              >
                {loading
                  ? `${selected.title} is running...`
                  : `Run ${selected.title}`}
              </Button>
            </Stack>
          </Paper>
        </Grid>

        {/* Agent Response */}
        <Grid size={{ xs: 12 }}>
          <Paper
            elevation={0}
            sx={{
              p: {
                xs: 2.5,
                md: 3,
              },
              borderRadius: 4,
              border: "1px solid #E2E8F0",
              color: "#0F172A !important",
              backgroundColor: "#FFFFFF !important",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              gap={2}
            >
              <Stack
                direction="row"
                alignItems="center"
                gap={1.2}
              >
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    display: "grid",
                    placeItems: "center",
                    color: selected.accent,
                    backgroundColor: selected.soft,
                    borderRadius: 2.5,
                  }}
                >
                  <AutoAwesomeRounded />
                </Box>

                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={900}
                    sx={{
                      color: "#0F172A !important",
                    }}
                  >
                    Agent Response
                  </Typography>

                  <Typography
                    sx={{
                      color: "#64748B !important",
                      fontSize: 12,
                    }}
                  >
                    Output generated by {selected.title}
                  </Typography>
                </Box>
              </Stack>

              {result && (
                <Tooltip title="Copy response">
                  <IconButton
                    onClick={handleCopy}
                    sx={{
                      color: "#4F46E5 !important",
                      backgroundColor: "#EEF2FF !important",
                      border: "1px solid #C7D2FE",
                    }}
                  >
                    <ContentCopyRounded fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>

            <Divider
              sx={{
                my: 2.5,
                borderColor: "#E2E8F0",
              }}
            />

            <Box
              sx={{
                minHeight: 190,
                p: {
                  xs: 2,
                  md: 2.5,
                },
                borderRadius: 3,
                border: "1px solid #E2E8F0",
                color: "#0F172A !important",
                backgroundColor: "#F8FAFC !important",
              }}
            >
              {loading ? (
                <Box
                  sx={{
                    minHeight: 140,
                    display: "grid",
                    placeItems: "center",
                    textAlign: "center",
                  }}
                >
                  <Box>
                    <CircularProgress size={34} />

                    <Typography
                      fontWeight={900}
                      sx={{
                        color: "#0F172A !important",
                        mt: 2,
                      }}
                    >
                      {selected.title} is working
                    </Typography>

                    <Typography
                      sx={{
                        color: "#64748B !important",
                        fontSize: 13,
                        mt: 0.5,
                      }}
                    >
                      Processing your request and preparing the
                      response...
                    </Typography>
                  </Box>
                </Box>
              ) : result ? (
                <Typography
                  component="pre"
                  sx={{
                    m: 0,
                    color: "#0F172A !important",
                    fontFamily: "inherit",
                    fontSize: 14,
                    lineHeight: 1.75,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {String(result)}
                </Typography>
              ) : (
                <Box
                  sx={{
                    minHeight: 140,
                    display: "grid",
                    placeItems: "center",
                    textAlign: "center",
                  }}
                >
                  <Box>
                    <AutoAwesomeRounded
                      sx={{
                        color: "#CBD5E1",
                        fontSize: 50,
                      }}
                    />

                    <Typography
                      fontWeight={900}
                      sx={{
                        color: "#334155 !important",
                        mt: 1,
                      }}
                    >
                      No agent response yet
                    </Typography>

                    <Typography
                      sx={{
                        color: "#64748B !important",
                        fontSize: 13,
                        mt: 0.5,
                      }}
                    >
                      Select an agent, configure the input and
                      press Run Agent.
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Agents;