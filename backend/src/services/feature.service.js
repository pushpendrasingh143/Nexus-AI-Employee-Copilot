const getFeatureRegistry = () => {
  return {
    project: {
      name: "Nexus AI Employee Copilot",
      category: "AI-powered Enterprise Productivity Platform",
      status: "University Final Demo Ready",
      mode: "AI SaaS Demo + Production-ready Architecture",
    },

    coreFeatures: [
      "Secure Login & Authentication",
      "Role-based Access Control",
      "Employee Management",
      "Department Management",
      "Document Upload",
      "PDF Text Extraction",
      "RAG-based Document Q&A",
      "AI Chat History",
      "Document Summary",
      "Analytics Dashboard",
      "PostgreSQL + Prisma Database",
      "Live Deployment Ready",
    ],

    aiAgents: [
      {
        name: "HR Agent",
        status: "ready",
        features: ["Leave Policy", "HR Policy Assistant", "Employee Support"],
      },
      {
        name: "Email Agent",
        status: "ready",
        features: ["Email Draft Generation", "Smart Reply Drafts"],
      },
      {
        name: "Meeting Scheduler Agent",
        status: "ready",
        features: ["Meeting Agenda", "Participants", "Follow-up Tasks"],
      },
      {
        name: "Task Manager Agent",
        status: "ready",
        features: ["Task Planning", "Priority", "Execution Steps"],
      },
      {
        name: "Report Generator Agent",
        status: "ready",
        features: ["AI Usage Report", "Project Report", "Analytics Report"],
      },
      {
        name: "Knowledge Agent",
        status: "ready",
        features: ["Enterprise Search", "Document-based Answers", "Sources"],
      },
      {
        name: "Voice Assistant",
        status: "demo_ready",
        features: ["Transcript Processing", "Voice-friendly AI Response"],
      },
    ],

    integrations: [
      {
        name: "Google Workspace",
        status: "demo_ready",
        apps: ["Gmail", "Google Calendar", "Google Drive", "Google Docs"],
        realExecution: false,
      },
      {
        name: "Microsoft 365",
        status: "demo_ready",
        apps: ["Outlook", "Microsoft Teams", "OneDrive", "Word"],
        realExecution: false,
      },
      {
        name: "Slack & Microsoft Teams",
        status: "demo_ready",
        apps: ["Slack", "Microsoft Teams"],
        realExecution: false,
      },
    ],

    techStack: {
      frontend: ["React", "Vite"],
      backend: ["Node.js", "Express.js"],
      database: ["PostgreSQL", "Neon", "Prisma ORM"],
      ai: ["Google Gemini", "LangChain", "RAG"],
      security: ["JWT", "bcrypt", "Role Middleware"],
    },
  };
};

const getFinalRoadmap = () => {
  return {
    completedPhases: [
      "Phase 14 - AI Chat History",
      "Phase 15 - Advanced RAG Sources",
      "Phase 16 - Document Summary",
      "Phase 17 - Analytics Dashboard",
      "Phase 18 - HR Agent",
      "Phase 19 - Email Agent",
      "Phase 20 - Meeting Scheduler Agent",
      "Phase 21 - Task Manager Agent",
      "Phase 22 - Report Generator Agent",
      "Phase 23 - Knowledge Agent",
      "Phase 24 - Voice Assistant",
      "Phase 25 - Google Workspace Demo",
      "Phase 26 - Microsoft 365 Demo",
      "Phase 27 - Slack & Teams Demo",
    ],

    productionFutureScope: [
      "Real Google OAuth Integration",
      "Real Microsoft Graph API Integration",
      "Real Slack Bot Integration",
      "Real-time Notifications",
      "Advanced Admin Audit Logs",
      "Multi-tenant Company Workspace",
      "Vector Search Optimization",
      "Voice Input from Frontend",
    ],

    finalSubmissionNote:
      "The project is demo-ready with production-style backend architecture. Real third-party integrations are implemented in demo mode and require OAuth authorization for production execution.",
  };
};

module.exports = {
  getFeatureRegistry,
  getFinalRoadmap,
};