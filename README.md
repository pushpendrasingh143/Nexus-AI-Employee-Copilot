# Nexus AI Employee Copilot

An AI-powered enterprise productivity platform that helps employees and HR teams manage organizational information, search company documents, and automate repetitive workplace tasks.

## Team

**Team Name:** Ultra Legends  
**Team Size:** 4 Members

### Team Members

1. Pushpendra Singh
2. Rahul Kumar Jha
3. Ibran Ansari
4. Chhote Kumar

## Team Contributions

| Team Member | Responsibility |
|---|---|
| Pushpendra Singh | Backend Development, Database and Deployment |
| Rahul Kumar Jha | Frontend Development and UI |
| Ibran Ansari | AI, RAG and Gemini Integration |
| Chhote Kumar | Testing, Documentation and Presentation |

## Live Application

[Open Nexus AI Employee Copilot](https://nexus-ai-employee-copilot.vercel.app/login)

## 🔐 Demo Account

Use the following demo credentials to explore the application:

- **Live Website:** https://nexus-ai-employee-copilot.vercel.app/login
- **Email:** `instructor.demo@nexusai.com`
- **Password:** `NexusDemo@2026`
- **Role:** Admin

 This account is created only for project evaluation and demonstration purposes.


## GitHub Repository

[View Source Code](https://github.com/pushpendrasingh143/Nexus-AI-Employee-Copilot)

## Problem Statement

Employees and HR teams spend significant time searching company documents, managing employee information, and completing repetitive administrative tasks across disconnected systems.

This reduces productivity, creates information delays, and makes organizational knowledge difficult to access.

## Our Solution

Nexus AI Employee Copilot provides a centralized AI-powered platform where organizations can:

- Manage employees and departments
- Upload organizational PDF documents
- Search company knowledge using AI
- Ask questions based on uploaded documents
- Maintain previous AI conversations
- View dashboard and analytics data
- Access specialized AI agents
- Use voice commands through a browser microphone
- Personalize the application using Light and Dark Mode

The platform uses Retrieval-Augmented Generation, or RAG, to generate answers using information retrieved from uploaded company documents.

## Key Features

### Authentication and Authorization

- Secure user registration and login
- JWT-based authentication
- Role-based access control
- Employee, HR and Admin roles
- Protected frontend routes
- Secure browser sessions

### Employee Management

- Create and manage employees
- Assign employees to departments
- View employee information
- Manage organizational user records

### Department Management

- Create organizational departments
- View department information
- Connect employees with departments

### Document Management

- Upload PDF documents
- Extract text from PDF files
- Split documents into searchable chunks
- Generate document embeddings
- Store document information in PostgreSQL
- View, summarize and delete uploaded documents

### AI Document Assistant

- Ask questions about uploaded documents
- Retrieve relevant document sections
- Generate context-aware answers
- Reduce AI hallucination using RAG
- Display document-based responses

### Chat History

- Create AI chat sessions
- Store user questions and AI responses
- View previous conversations
- Continue workplace AI interactions

### AI Agents and Integrations

- HR Agent
- Email Agent
- Meeting Scheduler
- Task Manager
- Report Generator
- Knowledge Agent
- Voice Assistant
- Google Workspace integration demo
- Microsoft 365 integration demo
- Slack and Microsoft Teams collaboration
- System Status
- Feature Registry

### Voice Assistant

- Browser microphone support
- Convert spoken commands into text
- Start and stop voice recognition
- Review and edit generated transcripts
- Process voice commands using AI
- Generate structured workplace responses
- Display microphone permission and speech recognition errors

### Settings and Theme

- User account and session information
- Application preference management
- Complete Light and Dark Mode
- Saved theme preference using localStorage
- Theme remains active after page refresh
- Reset application preferences
- Secure logout confirmation

### Dashboard and Analytics

- Employee statistics
- Department statistics
- Document statistics
- Document chunk statistics
- Application activity overview

## Target Users

- Employees
- HR Teams
- Department Managers
- Organization Administrators
- Small and Medium-Sized Businesses

## User Flow

1. User registers or logs in.
2. User opens the dashboard.
3. HR or Admin uploads a company document.
4. The backend extracts and processes its content.
5. The document is divided into smaller chunks.
6. Embeddings are generated and stored.
7. The employee asks a question.
8. Relevant document chunks are retrieved.
9. Google Gemini generates a context-aware answer.
10. The conversation is stored in chat history.

## System Architecture

```text
User
  ↓
React + Vite Frontend
  ↓
Node.js + Express Backend
  ↓
Authentication and Business Logic
  ↓
Prisma ORM
  ↓
Neon PostgreSQL + Vector Data
  ↓
Google Gemini AI
  ↓
RAG-Based Response
```

## Technology Stack

### Frontend

- React
- Vite
- Material UI
- React Router
- Axios
- React Hot Toast
- Web Speech API

### Backend

- Node.js
- Express.js
- CommonJS architecture
- JWT Authentication
- Multer
- PDF text extraction

### Database and ORM

- PostgreSQL
- Neon PostgreSQL
- Prisma ORM
- Vector embeddings

### Artificial Intelligence

- Google Gemini
- LangChain
- Retrieval-Augmented Generation
- Document chunking
- Semantic knowledge search

### Deployment

- Vercel for frontend
- Render for backend
- Neon for production database
- GitHub for source control

## Application Screenshots

### Login Page

<img width="1362" height="728" alt="WhatsApp Image 2026-07-17 at 5 25 09 PM" src="https://github.com/user-attachments/assets/11796f61-26af-48a3-a1d8-e54767467ff3" />


### Dashboard

<img width="1366" height="729" alt="WhatsApp Image 2026-07-17 at 5 26 14 PM" src="https://github.com/user-attachments/assets/dec8ee8d-a580-4e6f-a08c-dd9ed870dcdb" />


### Document Management

<img width="1366" height="719" alt="WhatsApp Image 2026-07-17 at 5 26 51 PM" src="https://github.com/user-attachments/assets/d91bf1d4-3169-432a-8652-e9bc0dc940c0" />


### AI Document Assistant

<img width="1366" height="728" alt="WhatsApp Image 2026-07-17 at 5 27 25 PM" src="https://github.com/user-attachments/assets/efadf43a-8f24-4cf3-85f1-02c85562b2e3" />

## Recent Updates

- Added browser microphone support to the Voice Assistant
- Added complete Light and Dark Mode support
- Added Settings navigation and preference management
- Added persistent theme preference using localStorage
- Improved sidebar navigation
- Improved dashboard and AI Agents user interface
- Added protected and public route handling
- Improved authentication session handling

## Future Enhancements

- Real Gmail and Google Calendar integration
- Real Microsoft Outlook and Teams integration
- Real Slack workspace integration
- Advanced role-based permissions
- Real-time employee notifications
- Mobile navigation improvements
- Multiple voice input languages
- Advanced AI usage analytics
- Automated workplace workflows

## Project Status

**Version:** 1.0.0  
**Status:** Demo Ready  
**Category:** AI-Powered Enterprise Productivity Platform
