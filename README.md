# Nexus AI Employee Copilot

An AI-powered enterprise productivity platform that helps employees and HR teams manage organizational information, search company documents, and automate repetitive workplace tasks.

## Team

**Team Name:** Ultra Legends  
**Team Size:** 4 Members  

### Team Members

1. Pushpendra Singh
2. Rahuk kumar jha
3. Ibran ansari
4. Chhote kumar

## Team Contributions

| Team Member | Responsibility |
|---|---|
| Pushpendra Singh | Backend Development, Database and Deployment |
| Rahul kumar jha | Frontend Development and UI |
| Ibran ansari | AI, RAG and Gemini Integration |
| Chhote kumar | Testing, Documentation and Presentation |


## Live Application

[Open Nexus AI Employee Copilot](<img width="1251" height="664" alt="WhatsApp Image 2026-07-15 at 4 32 54 PM" src="https://github.com/user-attachments/assets/0724b1b4-4515-40e5-868a-3674530c46bb" /><img width="1251" height="664" alt="WhatsApp Image 2026-07-15 at 4 32 54 PM" src="https://github.com/user-attachments/assets/e59a9c9a-95b0-44de-8ceb-73d0f4119577" />
)

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
- Access HR-related assistance

The platform uses Retrieval-Augmented Generation, or RAG, to generate answers using information retrieved from uploaded company documents.

## Key Features

### Authentication and Authorization

- Secure user registration and login
- JWT-based authentication
- Role-based access control
- Employee, HR, and Admin roles

### Employee Management

- Create and manage employees
- Assign employees to departments
- View employee information

### Department Management

- Create organizational departments
- View department information
- Connect employees with departments

### Document Management

- Upload PDF documents
- Extract text from PDF files
- Split documents into searchable chunks
- Store document information in PostgreSQL
- Delete and view uploaded documents

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

### HR Agent

- Assist with common HR-related questions
- Provide workplace information through AI

### Dashboard and Analytics

- Employee statistics
- Department statistics
- Document statistics
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

## Application Screenshots

### Login Page
<img width="1251" height="664" alt="WhatsApp Image 2026-07-15 at 4 32 54 PM" src="https://github.com/user-attachments/assets/11af193e-763c-4322-bf30-38583ef21c9a" />
### Dashboard
<img width="1366" height="728" alt="WhatsApp Image 2026-07-15 at 4 34 02 PM" src="https://github.com/user-attachments/assets/a68194f1-68b4-4339-92a5-d2ad61c740c3" />
### Document Management
<img width="1366" height="735" alt="WhatsApp Image 2026-07-15 at 4 40 05 PM" src="https://github.com/user-attachments/assets/763b9f54-3674-419c-b0f1-ff6b4ac80a11" />

### AI Document Assistant
<img width="1366" height="684" alt="WhatsApp Image 2026-07-15 at 4 42 29 PM" src="https://github.com/user-attachments/assets/eaaaf8a6-61e4-4bdf-b79a-78364977d4c4" />
