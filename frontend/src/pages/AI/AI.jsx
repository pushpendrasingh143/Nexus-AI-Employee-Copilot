import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  Alert,
  Box,
  Button,
  ButtonBase,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  AddCommentRounded,
  AutoAwesomeRounded,
  ContentCopyRounded,
  DeleteOutlineRounded,
  DescriptionRounded,
  HistoryRounded,
  RefreshRounded,
  SendRounded,
  SmartToyRounded,
} from "@mui/icons-material";

import {
  chatWithAI,
  askDocumentAI,
} from "../../services/ai.service";

import {
  getChatSessions,
  getChatSessionById,
  deleteChatSession,
} from "../../services/chat.service";

const fieldStyles = {
  "& .MuiOutlinedInput-root": {
    color: "#0F172A !important",
    backgroundColor: "#FFFFFF !important",
    borderRadius: 3,

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

  "& .MuiInputBase-input": {
    color: "#0F172A !important",
  },

  "& textarea": {
    color: "#0F172A !important",
  },
};

const formatDate = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatScore = (score) => {
  const numericScore = Number(score);

  if (!Number.isFinite(numericScore)) {
    return null;
  }

  const percentage =
    numericScore <= 1
      ? numericScore * 100
      : numericScore;

  return `${Math.min(
    Math.max(percentage, 0),
    100
  ).toFixed(0)}% match`;
};

const AI = () => {
  const [mode, setMode] = useState("rag");
  const [message, setMessage] = useState("");
  const [lastQuestion, setLastQuestion] = useState("");
  const [reply, setReply] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);

  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] =
    useState(null);
  const [selectedSessionId, setSelectedSessionId] =
    useState(null);

  const [historyLoading, setHistoryLoading] =
    useState(false);
  const [sessionLoading, setSessionLoading] =
    useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] =
    useState(null);
  const [deleting, setDeleting] = useState(false);

  const sortedSessions = useMemo(() => {
    return [...sessions].sort((first, second) => {
      const firstDate = new Date(
        first.updatedAt || first.createdAt || 0
      ).getTime();

      const secondDate = new Date(
        second.updatedAt || second.createdAt || 0
      ).getTime();

      return secondDate - firstDate;
    });
  }, [sessions]);

  const loadSessions = async () => {
    try {
      setHistoryLoading(true);

      const data = await getChatSessions();

      setSessions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("History load error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load chat history"
      );
    } finally {
      setHistoryLoading(false);
    }
  };

  const loadSession = async (sessionId) => {
    try {
      setSessionLoading(true);
      setSelectedSessionId(sessionId);

      const data = await getChatSessionById(sessionId);

      setSelectedSession(data);
      setReply("");
      setLastQuestion("");
      setSources([]);
    } catch (error) {
      console.error("Session load error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to open conversation"
      );

      setSelectedSessionId(null);
    } finally {
      setSessionLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleNewChat = () => {
    setSelectedSession(null);
    setSelectedSessionId(null);
    setLastQuestion("");
    setReply("");
    setSources([]);
    setMessage("");
  };

  const handleModeChange = (event, value) => {
    if (!value) return;

    setMode(value);
    handleNewChat();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage || loading) return;

    try {
      setLoading(true);
      setLastQuestion(trimmedMessage);
      setReply("");
      setSources([]);
      setSelectedSession(null);
      setSelectedSessionId(null);

      if (mode === "rag") {
        const response =
          await askDocumentAI(trimmedMessage);

        setReply(
          response?.answer || "No answer received."
        );

        setSources(
          Array.isArray(response?.sources)
            ? response.sources
            : []
        );
      } else {
        const response =
          await chatWithAI(trimmedMessage);

        setReply(response || "No response received.");
        setSources([]);
      }

      setMessage("");

      await loadSessions();
    } catch (error) {
      console.error("AI request error:", error);

      toast.error(
        error.response?.data?.message ||
          "AI request failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyboardSubmit = (event) => {
    if (
      event.key === "Enter" &&
      (event.ctrlKey || event.metaKey)
    ) {
      handleSubmit(event);
    }
  };

  const handleCopy = async (content) => {
    if (!content) return;

    try {
      await navigator.clipboard.writeText(content);
      toast.success("Answer copied");
    } catch (error) {
      console.error("Copy error:", error);
      toast.error("Unable to copy answer");
    }
  };

  const openDeleteDialog = (event, session) => {
    event.stopPropagation();

    setSessionToDelete(session);
    setDeleteOpen(true);
  };

  const closeDeleteDialog = () => {
    if (deleting) return;

    setDeleteOpen(false);
    setSessionToDelete(null);
  };

  const handleDeleteSession = async () => {
    if (!sessionToDelete?.id || deleting) return;

    try {
      setDeleting(true);

      await deleteChatSession(sessionToDelete.id);

      toast.success("Conversation deleted");

      if (selectedSessionId === sessionToDelete.id) {
        handleNewChat();
      }

      setDeleteOpen(false);
      setSessionToDelete(null);

      await loadSessions();
    } catch (error) {
      console.error("Delete session error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete conversation"
      );
    } finally {
      setDeleting(false);
    }
  };

  const historyMessages =
    selectedSession?.messages || [];

  return (
    <Box
      sx={{
        width: "100%",
        color: "#0F172A",
      }}
    >
      {/* Page Header */}
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
              color: "#4F46E5",
              backgroundColor: "#EEF2FF",
              borderRadius: 3,
            }}
          >
            <SmartToyRounded />
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
              Nexus AI Assistant
            </Typography>

            <Typography
              sx={{
                color: "#64748B !important",
                mt: 0.3,
              }}
            >
              Search company knowledge or use the
              general workplace assistant.
            </Typography>
          </Box>
        </Stack>

        <Button
          onClick={handleNewChat}
          startIcon={<AddCommentRounded />}
          sx={{
            color: "#FFFFFF !important",
            background:
              "linear-gradient(135deg, #4F46E5, #7C3AED) !important",
            borderRadius: 2.5,
            px: 2.3,
            py: 1,
            fontWeight: 800,
            textTransform: "none",

            "&:hover": {
              background:
                "linear-gradient(135deg, #4338CA, #6D28D9) !important",
            },
          }}
        >
          New Chat
        </Button>
      </Stack>

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
        {/* History Panel */}
        <Paper
          elevation={0}
          sx={{
            width: {
              xs: "100%",
              lg: 310,
            },
            p: 2,
            borderRadius: 4,
            border: "1px solid #E2E8F0",
            color: "#0F172A !important",
            backgroundColor: "#FFFFFF !important",
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={1.5}
          >
            <Stack
              direction="row"
              alignItems="center"
              gap={1}
            >
              <HistoryRounded
                sx={{
                  color: "#4F46E5",
                }}
              />

              <Box>
                <Typography
                  fontWeight={900}
                  sx={{
                    color: "#0F172A !important",
                  }}
                >
                  Chat History
                </Typography>

                <Typography
                  sx={{
                    color: "#64748B !important",
                    fontSize: 11,
                  }}
                >
                  {sessions.length} saved conversations
                </Typography>
              </Box>
            </Stack>

            <Tooltip title="Refresh history">
              <IconButton
                onClick={loadSessions}
                disabled={historyLoading}
                size="small"
                sx={{
                  color: "#4F46E5 !important",
                  backgroundColor: "#EEF2FF !important",
                }}
              >
                {historyLoading ? (
                  <CircularProgress size={17} />
                ) : (
                  <RefreshRounded fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          </Stack>

          <Divider
            sx={{
              mb: 1.5,
              borderColor: "#E2E8F0",
            }}
          />

          <Box
            sx={{
              maxHeight: {
                xs: 310,
                lg: 610,
              },
              overflowY: "auto",
              pr: 0.5,
            }}
          >
            {historyLoading &&
            sessions.length === 0 ? (
              <Box
                sx={{
                  py: 5,
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <CircularProgress size={28} />
              </Box>
            ) : sortedSessions.length === 0 ? (
              <Box
                sx={{
                  py: 5,
                  px: 2,
                  textAlign: "center",
                }}
              >
                <HistoryRounded
                  sx={{
                    color: "#CBD5E1",
                    fontSize: 45,
                  }}
                />

                <Typography
                  fontWeight={800}
                  sx={{
                    color: "#334155 !important",
                    mt: 1,
                  }}
                >
                  No saved conversations
                </Typography>

                <Typography
                  sx={{
                    color: "#64748B !important",
                    fontSize: 12,
                    mt: 0.5,
                  }}
                >
                  Start a new chat and it will appear
                  here.
                </Typography>
              </Box>
            ) : (
              <Stack spacing={1}>
                {sortedSessions.map((session) => {
                  const isSelected =
                    selectedSessionId === session.id;

                  return (
                    <Paper
                      key={session.id}
                      elevation={0}
                      sx={{
                        display: "flex",
                        alignItems: "stretch",
                        overflow: "hidden",
                        borderRadius: 2.5,
                        border: isSelected
                          ? "1px solid #818CF8"
                          : "1px solid #E2E8F0",
                        backgroundColor: isSelected
                          ? "#EEF2FF !important"
                          : "#FFFFFF !important",
                      }}
                    >
                      <ButtonBase
                        onClick={() =>
                          loadSession(session.id)
                        }
                        sx={{
                          flex: 1,
                          minWidth: 0,
                          p: 1.4,
                          textAlign: "left",
                          display: "block",

                          "&:hover": {
                            backgroundColor:
                              "#F8FAFF !important",
                          },
                        }}
                      >
                        <Typography
                          noWrap
                          sx={{
                            color: isSelected
                              ? "#4338CA !important"
                              : "#0F172A !important",
                            fontWeight: 800,
                            fontSize: 13,
                          }}
                        >
                          {session.title ||
                            "Untitled Conversation"}
                        </Typography>

                        <Typography
                          noWrap
                          sx={{
                            color: "#64748B !important",
                            fontSize: 10,
                            mt: 0.5,
                          }}
                        >
                          {formatDate(
                            session.updatedAt ||
                              session.createdAt
                          )}
                        </Typography>
                      </ButtonBase>

                      <Tooltip title="Delete conversation">
                        <IconButton
                          onClick={(event) =>
                            openDeleteDialog(
                              event,
                              session
                            )
                          }
                          size="small"
                          sx={{
                            width: 39,
                            borderRadius: 0,
                            color: "#DC2626 !important",

                            "&:hover": {
                              backgroundColor:
                                "#FEF2F2 !important",
                            },
                          }}
                        >
                          <DeleteOutlineRounded fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Paper>
                  );
                })}
              </Stack>
            )}
          </Box>
        </Paper>

        {/* Main Assistant */}
        <Box
          sx={{
            flex: 1,
            width: "100%",
            minWidth: 0,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: {
                xs: 2,
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
                xs: "stretch",
                sm: "center",
              }}
              gap={2}
              mb={2.5}
            >
              <ToggleButtonGroup
                exclusive
                value={mode}
                onChange={handleModeChange}
                sx={{
                  p: 0.6,
                  gap: 0.7,
                  borderRadius: 3,
                  backgroundColor: "#F1F5F9",

                  "& .MuiToggleButton-root": {
                    px: {
                      xs: 1.5,
                      sm: 2.5,
                    },
                    py: 0.9,
                    color: "#475569 !important",
                    backgroundColor:
                      "#FFFFFF !important",
                    border:
                      "1px solid #E2E8F0 !important",
                    borderRadius:
                      "10px !important",
                    fontWeight: 800,
                    textTransform: "none",
                  },

                  "& .MuiToggleButton-root.Mui-selected":
                    {
                      color: "#FFFFFF !important",
                      backgroundColor:
                        "#4F46E5 !important",
                      borderColor:
                        "#4F46E5 !important",
                    },

                  "& .MuiToggleButton-root.Mui-selected:hover":
                    {
                      backgroundColor:
                        "#4338CA !important",
                    },
                }}
              >
                <ToggleButton value="rag">
                  <DescriptionRounded
                    sx={{
                      mr: 0.8,
                      fontSize: 19,
                    }}
                  />
                  Ask Documents
                </ToggleButton>

                <ToggleButton value="chat">
                  <SmartToyRounded
                    sx={{
                      mr: 0.8,
                      fontSize: 19,
                    }}
                  />
                  Normal Chat
                </ToggleButton>
              </ToggleButtonGroup>

              <Chip
                icon={<AutoAwesomeRounded />}
                label={
                  mode === "rag"
                    ? "RAG Knowledge Search"
                    : "Gemini Workplace Assistant"
                }
                sx={{
                  alignSelf: {
                    xs: "flex-start",
                    sm: "center",
                  },
                  color: "#4338CA !important",
                  backgroundColor:
                    "#EEF2FF !important",
                  border: "1px solid #C7D2FE",
                  fontWeight: 800,

                  "& .MuiChip-label": {
                    color: "#4338CA !important",
                  },

                  "& .MuiChip-icon": {
                    color: "#4F46E5 !important",
                  },
                }}
              />
            </Stack>

            <Box
              component="form"
              onSubmit={handleSubmit}
            >
              <TextField
                fullWidth
                multiline
                minRows={5}
                maxRows={10}
                value={message}
                onChange={(event) =>
                  setMessage(event.target.value)
                }
                onKeyDown={handleKeyboardSubmit}
                placeholder={
                  mode === "rag"
                    ? "Ask a question from your uploaded company documents..."
                    : "Ask Nexus AI to help with workplace tasks..."
                }
                sx={fieldStyles}
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
                gap={1.5}
                mt={2}
              >
                <Typography
                  sx={{
                    color: "#94A3B8 !important",
                    fontSize: 11,
                  }}
                >
                  Press Ctrl + Enter to send
                </Typography>

                <Button
                  type="submit"
                  variant="contained"
                  disabled={
                    loading || !message.trim()
                  }
                  startIcon={
                    loading ? (
                      <CircularProgress
                        color="inherit"
                        size={18}
                      />
                    ) : (
                      <SendRounded />
                    )
                  }
                  sx={{
                    minWidth: 160,
                    py: 1.1,
                    color: "#FFFFFF !important",
                    background:
                      "linear-gradient(135deg, #4F46E5, #7C3AED) !important",
                    borderRadius: 2.5,
                    fontWeight: 800,
                    textTransform: "none",

                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #4338CA, #6D28D9) !important",
                    },
                  }}
                >
                  {loading
                    ? "Nexus is thinking..."
                    : mode === "rag"
                    ? "Ask Documents"
                    : "Send Message"}
                </Button>
              </Stack>
            </Box>
          </Paper>

          {/* Loading Response */}
          {loading && (
            <Paper
              elevation={0}
              sx={{
                mt: 3,
                p: 3,
                borderRadius: 4,
                border: "1px solid #E2E8F0",
                backgroundColor: "#FFFFFF !important",
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                gap={1.5}
              >
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    display: "grid",
                    placeItems: "center",
                    color: "#4F46E5",
                    backgroundColor: "#EEF2FF",
                    borderRadius: 2.5,
                  }}
                >
                  <SmartToyRounded />
                </Box>

                <Box>
                  <Typography
                    fontWeight={900}
                    sx={{
                      color: "#0F172A !important",
                    }}
                  >
                    Nexus AI is preparing your answer
                  </Typography>

                  <Typography
                    sx={{
                      color: "#64748B !important",
                      fontSize: 13,
                      mt: 0.3,
                    }}
                  >
                    Searching knowledge and generating a
                    relevant response...
                  </Typography>
                </Box>

                <CircularProgress
                  size={22}
                  sx={{
                    ml: "auto",
                  }}
                />
              </Stack>
            </Paper>
          )}

          {/* Selected Saved Conversation */}
          {selectedSession && !loading && (
            <Paper
              elevation={0}
              sx={{
                mt: 3,
                p: {
                  xs: 2,
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
                alignItems="flex-start"
                gap={2}
              >
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={900}
                    sx={{
                      color: "#0F172A !important",
                    }}
                  >
                    {selectedSession.title ||
                      "Saved Conversation"}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#64748B !important",
                      fontSize: 12,
                      mt: 0.3,
                    }}
                  >
                    {formatDate(
                      selectedSession.updatedAt ||
                        selectedSession.createdAt
                    )}
                  </Typography>
                </Box>

                {sessionLoading && (
                  <CircularProgress size={22} />
                )}
              </Stack>

              <Divider
                sx={{
                  my: 2.5,
                  borderColor: "#E2E8F0",
                }}
              />

              {sessionLoading ? (
                <Box
                  sx={{
                    py: 6,
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : historyMessages.length === 0 ? (
                <Alert
                  severity="info"
                  sx={{
                    borderRadius: 3,
                  }}
                >
                  No messages were found in this
                  conversation.
                </Alert>
              ) : (
                <Stack spacing={2}>
                  {historyMessages.map(
                    (item, index) => {
                      const role = String(
                        item.role || ""
                      ).toLowerCase();

                      const isUser =
                        role === "user" ||
                        role === "human";

                      return (
                        <Box
                          key={item.id || index}
                          sx={{
                            display: "flex",
                            justifyContent: isUser
                              ? "flex-end"
                              : "flex-start",
                          }}
                        >
                          <Box
                            sx={{
                              width: "fit-content",
                              maxWidth: {
                                xs: "94%",
                                md: "82%",
                              },
                              p: 2,
                              borderRadius: isUser
                                ? "18px 18px 4px 18px"
                                : "18px 18px 18px 4px",
                              backgroundColor: isUser
                                ? "#4F46E5 !important"
                                : "#F8FAFC !important",
                              border: isUser
                                ? "1px solid #4F46E5"
                                : "1px solid #E2E8F0",
                            }}
                          >
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                              gap={2}
                              mb={0.7}
                            >
                              <Typography
                                sx={{
                                  color: isUser
                                    ? "rgba(255,255,255,0.78) !important"
                                    : "#4F46E5 !important",
                                  fontSize: 11,
                                  fontWeight: 900,
                                }}
                              >
                                {isUser
                                  ? "You"
                                  : "Nexus AI"}
                              </Typography>

                              {!isUser && (
                                <Tooltip title="Copy answer">
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      handleCopy(
                                        item.content
                                      )
                                    }
                                    sx={{
                                      width: 26,
                                      height: 26,
                                      color:
                                        "#64748B !important",
                                    }}
                                  >
                                    <ContentCopyRounded
                                      sx={{
                                        fontSize: 15,
                                      }}
                                    />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Stack>

                            <Typography
                              sx={{
                                color: isUser
                                  ? "#FFFFFF !important"
                                  : "#0F172A !important",
                                fontSize: 14,
                                lineHeight: 1.7,
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-word",
                              }}
                            >
                              {item.content}
                            </Typography>
                          </Box>
                        </Box>
                      );
                    }
                  )}
                </Stack>
              )}
            </Paper>
          )}

          {/* Latest Response */}
          {!selectedSession &&
            !loading &&
            reply && (
              <Paper
                elevation={0}
                sx={{
                  mt: 3,
                  p: {
                    xs: 2,
                    md: 3,
                  },
                  borderRadius: 4,
                  border: "1px solid #E2E8F0",
                  color: "#0F172A !important",
                  backgroundColor:
                    "#FFFFFF !important",
                }}
              >
                {lastQuestion && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: {
                          xs: "94%",
                          md: "82%",
                        },
                        p: 2,
                        borderRadius:
                          "18px 18px 4px 18px",
                        backgroundColor:
                          "#4F46E5 !important",
                      }}
                    >
                      <Typography
                        sx={{
                          color:
                            "rgba(255,255,255,0.76) !important",
                          fontSize: 11,
                          fontWeight: 900,
                          mb: 0.6,
                        }}
                      >
                        You
                      </Typography>

                      <Typography
                        sx={{
                          color: "#FFFFFF !important",
                          lineHeight: 1.65,
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                        }}
                      >
                        {lastQuestion}
                      </Typography>
                    </Box>
                  </Box>
                )}

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      maxWidth: {
                        xs: "100%",
                        md: "92%",
                      },
                      p: 2.2,
                      borderRadius:
                        "18px 18px 18px 4px",
                      border: "1px solid #E2E8F0",
                      backgroundColor:
                        "#F8FAFC !important",
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      gap={2}
                      mb={1}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        gap={1}
                      >
                        <SmartToyRounded
                          sx={{
                            color: "#4F46E5",
                          }}
                        />

                        <Typography
                          fontWeight={900}
                          sx={{
                            color:
                              "#0F172A !important",
                          }}
                        >
                          Nexus AI
                        </Typography>
                      </Stack>

                      <Tooltip title="Copy answer">
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleCopy(reply)
                          }
                          sx={{
                            color:
                              "#64748B !important",
                            backgroundColor:
                              "#FFFFFF !important",
                            border:
                              "1px solid #E2E8F0",
                          }}
                        >
                          <ContentCopyRounded fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>

                    <Typography
                      sx={{
                        color: "#0F172A !important",
                        whiteSpace: "pre-wrap",
                        lineHeight: 1.75,
                        wordBreak: "break-word",
                      }}
                    >
                      {reply}
                    </Typography>
                  </Box>
                </Box>

                {sources.length > 0 && (
                  <>
                    <Divider
                      sx={{
                        my: 3,
                        borderColor: "#E2E8F0",
                      }}
                    />

                    <Stack
                      direction="row"
                      alignItems="center"
                      gap={1}
                      mb={2}
                    >
                      <DescriptionRounded
                        sx={{
                          color: "#EA580C",
                        }}
                      />

                      <Box>
                        <Typography
                          variant="h6"
                          fontWeight={900}
                          sx={{
                            color:
                              "#0F172A !important",
                          }}
                        >
                          Retrieved Sources
                        </Typography>

                        <Typography
                          sx={{
                            color:
                              "#64748B !important",
                            fontSize: 12,
                          }}
                        >
                          Document sections used to
                          generate this answer.
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack spacing={1.5}>
                      {sources.map(
                        (source, index) => {
                          const score =
                            formatScore(
                              source.score
                            );

                          const documentName =
                            source.fileName ||
                            source.documentName ||
                            source.document?.fileName ||
                            "Uploaded document";

                          return (
                            <Paper
                              key={`${source.chunkIndex}-${index}`}
                              elevation={0}
                              sx={{
                                p: 2,
                                borderRadius: 3,
                                border:
                                  "1px solid #E2E8F0",
                                color:
                                  "#0F172A !important",
                                backgroundColor:
                                  "#FFFFFF !important",
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
                                gap={1}
                              >
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  gap={1}
                                >
                                  <Chip
                                    label={`Chunk #${
                                      source.chunkIndex ??
                                      index
                                    }`}
                                    size="small"
                                    sx={{
                                      color:
                                        "#4338CA !important",
                                      backgroundColor:
                                        "#EEF2FF !important",
                                      border:
                                        "1px solid #C7D2FE",
                                      fontWeight: 800,

                                      "& .MuiChip-label":
                                        {
                                          color:
                                            "#4338CA !important",
                                        },
                                    }}
                                  />

                                  <Typography
                                    noWrap
                                    sx={{
                                      maxWidth: 240,
                                      color:
                                        "#64748B !important",
                                      fontSize: 12,
                                      fontWeight: 700,
                                    }}
                                  >
                                    {documentName}
                                  </Typography>
                                </Stack>

                                {score && (
                                  <Chip
                                    label={score}
                                    size="small"
                                    sx={{
                                      color:
                                        "#15803D !important",
                                      backgroundColor:
                                        "#F0FDF4 !important",
                                      border:
                                        "1px solid #BBF7D0",
                                      fontWeight: 800,

                                      "& .MuiChip-label":
                                        {
                                          color:
                                            "#15803D !important",
                                        },
                                    }}
                                  />
                                )}
                              </Stack>

                              <Typography
                                sx={{
                                  color:
                                    "#334155 !important",
                                  mt: 1.5,
                                  fontSize: 13,
                                  lineHeight: 1.65,
                                  whiteSpace: "pre-wrap",
                                  wordBreak: "break-word",
                                }}
                              >
                                {source.preview ||
                                  source.content ||
                                  "Source preview unavailable."}
                              </Typography>
                            </Paper>
                          );
                        }
                      )}
                    </Stack>
                  </>
                )}
              </Paper>
            )}
        </Box>
      </Box>

      {/* Delete Session Dialog */}
      <Dialog
        open={deleteOpen}
        onClose={closeDeleteDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            color: "#0F172A",
            backgroundColor: "#FFFFFF !important",
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "#0F172A !important",
            fontWeight: 900,
          }}
        >
          Delete Conversation?
        </DialogTitle>

        <DialogContent>
          <Alert
            severity="warning"
            sx={{
              borderRadius: 2.5,
            }}
          >
            This will permanently delete{" "}
            <strong>
              {sessionToDelete?.title ||
                "this conversation"}
            </strong>{" "}
            and all of its messages.
          </Alert>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 3,
          }}
        >
          <Button
            onClick={closeDeleteDialog}
            disabled={deleting}
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
            onClick={handleDeleteSession}
            disabled={deleting}
            startIcon={
              deleting ? (
                <CircularProgress
                  size={17}
                  color="inherit"
                />
              ) : (
                <DeleteOutlineRounded />
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
            {deleting
              ? "Deleting..."
              : "Delete Conversation"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AI;