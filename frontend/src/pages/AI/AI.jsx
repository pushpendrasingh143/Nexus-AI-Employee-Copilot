import { useState } from "react";
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
import PersonIcon from "@mui/icons-material/Person";
import SendIcon from "@mui/icons-material/Send";

import {
  chatWithAI,
  askDocumentAI,
} from "../../services/ai.service";

const AI = () => {
  const [mode, setMode] = useState("chat");
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    setLoading(true);

    try {
      if (mode === "chat") {
        const response = await chatWithAI(message);

        setReply(response);
        setSources([]);
      } else {
        const response = await askDocumentAI(message);

        setReply(response.answer);
        setSources(response.sources || []);
      }

      setMessage("");
    } catch (error) {
      toast.error(error.response?.data?.message || "AI Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={1}
      >
        Nexus AI Assistant
      </Typography>

      <Typography
        color="text.secondary"
        mb={4}
      >
        Chat with AI or ask questions from uploaded documents.
      </Typography>

      <ToggleButtonGroup
        exclusive
        value={mode}
        onChange={(e, value) => {
          if (value) {
            setMode(value);
            setReply("");
            setSources([]);
          }
        }}
        sx={{ mb: 3 }}
      >
        <ToggleButton value="chat">
          Normal Chat
        </ToggleButton>

        <ToggleButton value="rag">
          Ask Documents
        </ToggleButton>
      </ToggleButtonGroup>

      <Paper
        sx={{
          p: 3,
          borderRadius: 4,
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
        >
          <TextField
            fullWidth
            multiline
            rows={5}
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            placeholder={
              mode === "chat"
                ? "Ask anything..."
                : "Ask questions from uploaded PDFs..."
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
            disabled={loading}
            sx={{
              mt: 2,
              px: 4,
            }}
          >
            {loading
              ? "Thinking..."
              : mode === "chat"
              ? "Send"
              : "Ask AI"}
          </Button>
        </Box>
      </Paper>

      {reply && (
        <Paper
          sx={{
            mt: 4,
            p: 3,
            borderRadius: 4,
          }}
        >
          <Box
            display="flex"
            gap={2}
            mb={2}
          >
            <SmartToyIcon color="primary" />

            <Box>
              <Typography
                fontWeight="bold"
                mb={1}
              >
                AI Response
              </Typography>

              <Typography>
                {reply}
              </Typography>
            </Box>
          </Box>

          {sources.length > 0 && (
            <>
              <Divider sx={{ my: 3 }} />

              <Typography
                variant="h6"
                gutterBottom
              >
                Sources
              </Typography>

              {sources.map(
                (source, index) => (
                  <Paper
                    key={index}
                    variant="outlined"
                    sx={{
                      p: 2,
                      mb: 2,
                    }}
                  >
                    <Chip
                      label={`Chunk #${source.chunkIndex}`}
                      color="primary"
                      size="small"
                    />

                    <Chip
                      label={`Score ${Number(
                        source.score
                      ).toFixed(2)}`}
                      color="success"
                      size="small"
                      sx={{ ml: 1 }}
                    />

                    <Typography
                      mt={2}
                    >
                      {source.preview}
                    </Typography>
                  </Paper>
                )
              )}
            </>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default AI;