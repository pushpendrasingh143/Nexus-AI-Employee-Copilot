const llm = require("../config/langchain");
const gemini = require("../config/gemini");
const { SYSTEM_PROMPT } = require("../prompts/ai.prompt");
const chatHistory = require("../memory/chat.memory");

class AIService {
  async chat(message) {
    try {
      chatHistory.push(`User: ${message}`);

      const prompt = `
${SYSTEM_PROMPT}

Conversation History:
${chatHistory.join("\n")}

Assistant:
`;

      const response = await llm.invoke(prompt);

      chatHistory.push(`Assistant: ${response.content}`);

      return response.content;
    } catch (error) {
      console.error("LangChain Error:", error.message);
      throw new Error("Failed to generate AI response.");
    }
  }

  async generateEmbedding(text) {
    try {
      const response = await gemini.models.embedContent({
        model: "gemini-embedding-001",
        contents: text,
        config: {
          outputDimensionality: 768,
        },
      });

      return response.embeddings[0].values;
    } catch (error) {
      console.error("Gemini Embedding Error:", error.message);
      throw new Error("Failed to generate embedding.");
    }
  }

  async answerWithContext(question, chunks) {
    try {
      const context = chunks.map((chunk) => chunk.content).join("\n\n");

      const recentHistory = chatHistory.slice(-6).join("\n");

      const prompt = `
You are Nexus AI Employee Copilot.

Answer the user's question using ONLY:
1. Provided document context
2. Recent conversation history

If the answer is not available in the document context or recent conversation history, say:
"I could not find this information in the uploaded documents."

Document Context:
${context}

Recent Conversation History:
${recentHistory}

User Question:
${question}

Answer:
`;

      const response = await llm.invoke(prompt);

      chatHistory.push(`User: ${question}`);
      chatHistory.push(`Assistant: ${response.content}`);

      return response.content;
    } catch (error) {
      console.error("RAG Answer Error:", error.message);
      throw new Error("Failed to generate RAG answer.");
    }
  }

    async generateDocumentSummary(document, chunks) {
    try {
      const context = chunks
        .map((chunk) => `Chunk ${chunk.chunkIndex}:\n${chunk.content}`)
        .join("\n\n")
        .slice(0, 12000);

      const prompt = `
You are Nexus AI Employee Copilot.

Generate a professional document summary for the uploaded enterprise document.

Document Name:
${document.fileName}

Document Type:
${document.fileType}

Document Content:
${context}

Return the response in this exact format:

Summary:
Write a clear 5-7 line summary.

Key Points:
- Point 1
- Point 2
- Point 3
- Point 4
- Point 5

Action Items:
- Action item 1
- Action item 2
- Action item 3

Document Category:
Write one category like HR Policy, Employee Document, Technical Document, Business Report, General Document.
`;

      const response = await llm.invoke(prompt);

      return response.content;
    } catch (error) {
      console.error("Document Summary Error:", error.message);
      throw new Error("Failed to generate document summary.");
    }
  }

    async answerHrQuestion(question, chunks) {
    try {
      const context = chunks.map((chunk) => chunk.content).join("\n\n");

      const prompt = `
You are Nexus HR Agent, an AI-powered HR assistant for employees.

Your job:
- Answer HR-related employee questions
- Use ONLY the provided company document context
- Be professional, clear, and helpful
- If the answer is not found, say:
"I could not find this HR information in the uploaded company documents."

Allowed HR topics:
- Leave policy
- HR policy
- Employee support
- Onboarding
- Work from home
- Attendance
- Company rules
- Employee benefits

Company Document Context:
${context}

Employee Question:
${question}

HR Agent Answer:
`;

      const response = await llm.invoke(prompt);

      return response.content;
    } catch (error) {
      console.error("HR Agent Error:", error.message);
      throw new Error("Failed to generate HR agent response.");
    }
  }
    async generateEmailDraft({ prompt, recipient, tone, purpose }) {
    try {
      const emailPrompt = `
You are Nexus Email Agent, an AI-powered enterprise email assistant.

Generate a professional email draft based on the user's request.

Email Details:
Purpose: ${purpose || "General"}
Recipient: ${recipient || "Not specified"}
Tone: ${tone || "Professional"}

User Request:
${prompt}

Return the email in this exact format:

Subject:
Write a short professional subject.

Email Body:
Dear [Recipient],

Write the email body here.

Regards,
[Your Name]
`;

      const response = await llm.invoke(emailPrompt);

      return response.content;
    } catch (error) {
      console.error("Email Agent Error:", error.message);
      throw new Error("Failed to generate email draft.");
    }
  }
    async generateMeetingSchedule({ title, date, time, participants, purpose }) {
    try {
      const meetingPrompt = `
You are Nexus Meeting Scheduler Agent, an AI-powered enterprise meeting assistant.

Create a professional meeting schedule and agenda.

Meeting Details:
Title: ${title || "Not specified"}
Date: ${date || "Not specified"}
Time: ${time || "Not specified"}
Participants: ${
        participants && participants.length
          ? participants.join(", ")
          : "Not specified"
      }
Purpose: ${purpose || "General meeting"}

Return the response in this exact format:

Meeting Title:
Write the meeting title.

Date & Time:
Write date and time.

Participants:
- Participant 1
- Participant 2

Agenda:
- Agenda point 1
- Agenda point 2
- Agenda point 3

Discussion Points:
- Discussion point 1
- Discussion point 2
- Discussion point 3

Expected Outcome:
Write expected meeting outcome.

Follow-up Tasks:
- Task 1
- Task 2
- Task 3
`;

      const response = await llm.invoke(meetingPrompt);

      return response.content;
    } catch (error) {
      console.error("Meeting Agent Error:", error.message);
      throw new Error("Failed to generate meeting schedule.");
    }
  }
    async generateTaskPlan({ title, description, priority, dueDate }) {
    try {
      const taskPrompt = `
You are Nexus Task Manager Agent, an AI-powered enterprise task planning assistant.

Create a professional task execution plan.

Task Details:
Title: ${title || "Not specified"}
Description: ${description || "Not specified"}
Priority: ${priority || "medium"}
Due Date: ${dueDate || "Not specified"}

Return the response in this exact format:

Task Title:
Write the task title.

Task Summary:
Write a short summary of the task.

Priority:
Write priority level and reason.

Execution Steps:
- Step 1
- Step 2
- Step 3
- Step 4
- Step 5

Estimated Timeline:
Write a realistic timeline.

Risks / Blockers:
- Risk 1
- Risk 2

Follow-up Reminders:
- Reminder 1
- Reminder 2
- Reminder 3

Expected Outcome:
Write the expected final outcome.
`;

      const response = await llm.invoke(taskPrompt);

      return response.content;
    } catch (error) {
      console.error("Task Agent Error:", error.message);
      throw new Error("Failed to generate task plan.");
    }
  }
    async generateReport({ reportType, title, period, instructions, analytics }) {
    try {
      const reportPrompt = `
You are Nexus Report Generator Agent, an AI-powered enterprise reporting assistant.

Create a professional business report using the provided data.

Report Details:
Report Type: ${reportType || "General Report"}
Title: ${title || "Nexus AI Report"}
Period: ${period || "Not specified"}
Instructions: ${instructions || "Create a clear and professional report."}

Analytics Data:
${JSON.stringify(analytics || {}, null, 2)}

Return the response in this exact format:

Report Title:
Write the report title.

Executive Summary:
Write a short professional summary.

Key Metrics:
- Metric 1
- Metric 2
- Metric 3
- Metric 4

Detailed Analysis:
Write a clear detailed analysis based on the analytics data.

Insights:
- Insight 1
- Insight 2
- Insight 3

Recommendations:
- Recommendation 1
- Recommendation 2
- Recommendation 3

Conclusion:
Write a short conclusion.
`;

      const response = await llm.invoke(reportPrompt);

      return response.content;
    } catch (error) {
      console.error("Report Agent Error:", error.message);
      throw new Error("Failed to generate report.");
    }
  }
    async answerKnowledgeQuestion(question, chunks) {
    try {
      const context = chunks
        .map(
          (chunk) =>
            `Source: ${chunk.sourceName || "Unknown Document"} | Chunk ${
              chunk.chunkIndex
            }\n${chunk.content}`
        )
        .join("\n\n");

      const prompt = `
You are Nexus Knowledge Agent, an advanced enterprise knowledge search assistant.

Your job:
- Answer user questions using ONLY uploaded enterprise documents
- Give clear, accurate, professional answers
- Mention source document names when useful
- If information is not found, say:
"I could not find this information in the uploaded enterprise documents."

Enterprise Knowledge Context:
${context}

User Question:
${question}

Knowledge Agent Answer:
`;

      const response = await llm.invoke(prompt);

      return response.content;
    } catch (error) {
      console.error("Knowledge Agent Error:", error.message);
      throw new Error("Failed to generate knowledge agent response.");
    }
  }

    async processVoiceCommand({ transcript, intent }) {
    try {
      const voicePrompt = `
You are Nexus Voice Assistant, an AI-powered enterprise voice assistant.

The user has spoken a command or question. Respond clearly, briefly, and professionally.

Intent:
${intent || "general_assistant"}

Voice Transcript:
${transcript}

Rules:
- Keep the answer voice-friendly
- Use simple language
- Keep response short unless the user asks for detail
- If this is about Nexus AI Employee Copilot, answer as a project assistant
- If the request needs another agent, suggest the correct agent

Voice Assistant Response:
`;

      const response = await llm.invoke(voicePrompt);

      return response.content;
    } catch (error) {
      console.error("Voice Assistant Error:", error.message);
      throw new Error("Failed to process voice command.");
    }
  }

    async generateGoogleWorkspaceAction({
    actionType,
    prompt,
    recipient,
    date,
    time,
    participants,
  }) {
    try {
      const workspacePrompt = `
You are Nexus Google Workspace Integration Agent.

Create a professional Google Workspace action draft based on the user request.

Supported Google Workspace actions:
- Gmail Draft
- Google Calendar Event
- Google Drive Search Plan
- Google Docs Summary Plan
- General Workspace Assistant

Action Type:
${actionType || "general"}

User Request:
${prompt}

Optional Details:
Recipient: ${recipient || "Not specified"}
Date: ${date || "Not specified"}
Time: ${time || "Not specified"}
Participants: ${
        participants && participants.length
          ? participants.join(", ")
          : "Not specified"
      }

Return the response in this exact format:

Integration:
Google Workspace

Action:
Write the action name.

Generated Output:
Write the final draft, event plan, search plan, or document action.

Suggested Google App:
Write Gmail, Google Calendar, Google Drive, Google Docs, or Google Workspace.

Next Steps:
- Step 1
- Step 2
- Step 3

Note:
This is a demo integration draft. Real Google Workspace execution requires OAuth connection.
`;

      const response = await llm.invoke(workspacePrompt);

      return response.content;
    } catch (error) {
      console.error("Google Workspace Agent Error:", error.message);
      throw new Error("Failed to generate Google Workspace action.");
    }
  }

    async generateMicrosoft365Action({
    actionType,
    prompt,
    recipient,
    date,
    time,
    participants,
    channel,
  }) {
    try {
      const microsoftPrompt = `
You are Nexus Microsoft 365 Integration Agent.

Create a professional Microsoft 365 action draft based on the user request.

Supported Microsoft 365 actions:
- Outlook Email Draft
- Outlook Calendar Event
- Microsoft Teams Message
- OneDrive Search Plan
- Word Document Report Plan
- General Microsoft 365 Assistant

Action Type:
${actionType || "general"}

User Request:
${prompt}

Optional Details:
Recipient: ${recipient || "Not specified"}
Date: ${date || "Not specified"}
Time: ${time || "Not specified"}
Participants: ${
        participants && participants.length
          ? participants.join(", ")
          : "Not specified"
      }
Teams Channel: ${channel || "Not specified"}

Return the response in this exact format:

Integration:
Microsoft 365

Action:
Write the action name.

Generated Output:
Write the final email draft, meeting plan, Teams message, OneDrive search plan, or Word document plan.

Suggested Microsoft App:
Write Outlook, Microsoft Teams, OneDrive, Word, or Microsoft 365.

Next Steps:
- Step 1
- Step 2
- Step 3

Note:
This is a demo integration draft. Real Microsoft 365 execution requires Microsoft Graph API and OAuth authorization.
`;

      const response = await llm.invoke(microsoftPrompt);

      return response.content;
    } catch (error) {
      console.error("Microsoft 365 Agent Error:", error.message);
      throw new Error("Failed to generate Microsoft 365 action.");
    }
  }

    async generateCollaborationAction({
    platform,
    actionType,
    prompt,
    channel,
    recipients,
    priority,
  }) {
    try {
      const collaborationPrompt = `
You are Nexus Collaboration Integration Agent.

Create a professional team collaboration action for Slack or Microsoft Teams.

Supported actions:
- Slack channel message
- Microsoft Teams channel message
- Task reminder
- Project update
- Standup update
- Announcement
- Bot response

Platform:
${platform || "Slack / Microsoft Teams"}

Action Type:
${actionType || "general"}

User Request:
${prompt}

Optional Details:
Channel: ${channel || "Not specified"}
Recipients: ${
        recipients && recipients.length ? recipients.join(", ") : "Not specified"
      }
Priority: ${priority || "medium"}

Return the response in this exact format:

Integration:
Slack & Microsoft Teams

Platform:
Write Slack, Microsoft Teams, or Both.

Action:
Write the action name.

Generated Message:
Write the final professional message.

Suggested Channel:
Write the suggested channel or team.

Priority:
Write priority and reason.

Next Steps:
- Step 1
- Step 2
- Step 3

Note:
This is a demo integration draft. Real Slack or Microsoft Teams execution requires bot setup, OAuth authorization, and workspace approval.
`;

      const response = await llm.invoke(collaborationPrompt);

      return response.content;
    } catch (error) {
      console.error("Collaboration Agent Error:", error.message);
      throw new Error("Failed to generate collaboration action.");
    }
  }

}

module.exports = new AIService();