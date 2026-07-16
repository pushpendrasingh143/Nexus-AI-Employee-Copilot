import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  Chip,
  Divider,
} from "@mui/material";

import SmartToyIcon from "@mui/icons-material/SmartToy";
import SendIcon from "@mui/icons-material/Send";
import HistoryIcon from "@mui/icons-material/History";
import RefreshIcon from "@mui/icons-material/Refresh";

import {
  chatWithAI,
  askDocumentAI,
} from "../../services/ai.service";

import {
  getChatSessions,
  getChatSessionById,
} from "../../services/chat.service";

const AI = () => {
  const [mode, setMode] = useState("rag");
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);

  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  const loadSessions = async () => {
    try {
      setHistoryLoading(true);

      const data = await getChatSessions();

      setSessions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("History load error:", error);

      toast.error(
        error.response?.data?.message || "Failed to load chat history"
      );
    } finally {
      setHistoryLoading(false);
    }
  };

  const loadSession = async (sessionId) => {
    try {
      setHistoryLoading(true);
      setSelectedSessionId(sessionId);

      const data = await getChatSessionById(sessionId);

      setSelectedSession(data);
      setReply("");
      setSources([]);
    } catch (error) {
      console.error("Session load error:", error);

      toast.error(
        error.response?.data?.message || "Failed to open chat"
      );
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage || loading) return;

    setLoading(true);
    setReply("");
    setSources([]);
    setSelectedSession(null);
    setSelectedSessionId(null);

    try {
      if (mode === "rag") {
        const response = await askDocumentAI(trimmedMessage);

        setReply(response.answer || "No answer received.");
        setSources(response.sources || []);
      } else {
        const response = await chatWithAI(trimmedMessage);

        setReply(response || "No response received.");
        setSources([]);
      }

      setMessage("");

      // Database se updated history dobara load karega
      await loadSessions();
    } catch (error) {
      console.error("AI error:", error);

      toast.error(
        error.response?.data?.message || "AI Error"
      );
    } finally {
      setLoading(false);
    }
  };

  const historyMessages = selectedSession?.messages || [];

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={1}>
        Nexus AI Assistant
      </Typography>

      <Typography color="text.secondary" mb={3}>
        Chat with AI or ask questions from uploaded documents.
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 3,
          alignItems: "flex-start",
          flexDirection: {
            xs: "column",
            lg: "row",
          },
        }}
      >
        {/* Chat History */}
        <Paper
          sx={{
            width: {
              xs: "100%",
              lg: 290,
            },
            p: 2,
            borderRadius: 3,
            maxHeight: 650,
            overflowY: "auto",
            flexShrink: 0,
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={1}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <HistoryIcon color="primary" />

              <Typography fontWeight="bold">
                Chat History
              </Typography>
            </Box>

            <Button
              size="small"
              onClick={loadSessions}
              disabled={historyLoading}
              sx={{ minWidth: 35 }}
            >
              {historyLoading ? (
                <CircularProgress size={18} />
              ) : (
                <RefreshIcon fontSize="small" />
              )}
            </Button>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {sessions.length === 0 && !historyLoading ? (
            <Typography color="text.secondary" fontSize={14}>
              No saved conversations found.
            </Typography>
          ) : (
            sessions.map((session) => (
              <Button
                key={session.id}
                fullWidth
                onClick={() => loadSession(session.id)}
                sx={{
                  display: "block",
                  textAlign: "left",
                  textTransform: "none",
                  color: "#111827",
                  mb: 1,
                  p: 1.5,
                  borderRadius: 2,
                  border:
                    selectedSessionId === session.id
                      ? "2px solid #4f46e5"
                      : "1px solid #d1d5db",
                  backgroundColor:
                    selectedSessionId === session.id
                      ? "#eef2ff"
                      : "#ffffff",
                }}
              >
                <Typography
                  fontWeight={600}
                  fontSize={14}
                  noWrap
                >
                  {session.title || "Untitled Chat"}
                </Typography>

                {session.createdAt && (
                  <Typography
                    fontSize={11}
                    color="text.secondary"
                    mt={0.5}
                  >
                    {new Date(
                      session.createdAt
                    ).toLocaleString()}
                  </Typography>
                )}
              </Button>
            ))
          )}
        </Paper>

        {/* AI Main Section */}
        <Box sx={{ flex: 1, width: "100%", minWidth: 0 }}>
          <ToggleButtonGroup
            exclusive
            value={mode}
            onChange={(e, value) => {
              if (value) {
                setMode(value);
                setReply("");
                setSources([]);
                setSelectedSession(null);
                setSelectedSessionId(null);
              }
            }}
            sx={{
              mb: 3,
              backgroundColor: "#e5e7eb",
              borderRadius: "12px",
              padding: "6px",
              gap: "8px",
              "& .MuiToggleButton-root": {
                color: "#111827",
                backgroundColor: "#ffffff",
                border: "1px solid #cbd5e1",
                borderRadius: "10px",
                px: 3,
                py: 1,
                fontWeight: 700,
                textTransform: "none",
              },
              "& .MuiToggleButton-root.Mui-selected": {
                color: "#ffffff !important",
                backgroundColor: "#4f46e5 !important",
              },
            }}
          >
            <ToggleButton value="rag">
              Ask Documents
            </ToggleButton>

            <ToggleButton value="chat">
              Normal Chat
            </ToggleButton>
          </ToggleButtonGroup>

          <Paper sx={{ p: 3, borderRadius: 4 }}>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                multiline
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  mode === "rag"
                    ? "Ask questions from uploaded PDFs..."
                    : "Ask anything..."
                }
              />

              <Button
                type="submit"
                variant="contained"
                startIcon={
                  loading ? (
                    <CircularProgress
                      color="inherit"
                      size={18}
                    />
                  ) : (
                    <SendIcon />
                  )
                }
                disabled={loading || !message.trim()}
                sx={{ mt: 2, px: 4 }}
              >
                {loading
                  ? "Thinking..."
                  : mode === "rag"
                  ? "Ask Documents"
                  : "Send"}
              </Button>
            </Box>
          </Paper>

          {/* Saved conversation */}
          {selectedSession && (
            <Paper sx={{ mt: 4, p: 3, borderRadius: 4 }}>
              <Typography variant="h6" fontWeight="bold">
                {selectedSession.title || "Saved Conversation"}
              </Typography>

              <Divider sx={{ my: 2 }} />

              {historyMessages.length === 0 ? (
                <Typography color="text.secondary">
                  No messages found.
                </Typography>
              ) : (
                historyMessages.map((item, index) => {
                  const role = String(
                    item.role || ""
                  ).toLowerCase();

                  const isUser =
                    role === "user" || role === "human";

                  return (
                    <Box
                      key={item.id || index}
                      sx={{
                        mb: 2,
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: isUser
                          ? "#eef2ff"
                          : "#f8fafc",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <Typography
                        fontWeight="bold"
                        fontSize={13}
                        color={
                          isUser
                            ? "primary"
                            : "text.secondary"
                        }
                      >
                        {isUser ? "You" : "AI Assistant"}
                      </Typography>

                      <Typography
                        mt={0.5}
                        sx={{ whiteSpace: "pre-wrap" }}
                      >
                        {item.content}
                      </Typography>
                    </Box>
                  );
                })
              )}
            </Paper>
          )}

          {/* Latest AI response */}
          {!selectedSession && reply && (
            <Paper sx={{ mt: 4, p: 3, borderRadius: 4 }}>
              <Box display="flex" gap={2} mb={2}>
                <SmartToyIcon color="primary" />

                <Box sx={{ width: "100%" }}>
                  <Typography fontWeight="bold" mb={1}>
                    AI Response
                  </Typography>

                  <Typography sx={{ whiteSpace: "pre-wrap" }}>
                    {reply}
                  </Typography>
                </Box>
              </Box>

              {sources.length > 0 && (
                <>
                  <Divider sx={{ my: 3 }} />

                  <Typography variant="h6" gutterBottom>
                    Sources
                  </Typography>

                  {sources.map((source, index) => (
                    <Paper
                      key={index}
                      variant="outlined"
                      sx={{ p: 2, mb: 2 }}
                    >
                      <Chip
                        label={`Chunk #${source.chunkIndex}`}
                        color="primary"
                        size="small"
                      />

                      {source.score !== undefined && (
                        <Chip
                          label={`Score ${Number(
                            source.score
                          ).toFixed(2)}`}
                          color="success"
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      )}

                      <Typography mt={2}>
                        {source.preview}
                      </Typography>
                    </Paper>
                  ))}
                </>
              )}
            </Paper>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AI;