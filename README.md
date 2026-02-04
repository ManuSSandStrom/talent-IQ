<h1 align="center">✨ AiHire: A Full-Stack Interview Platform ✨</h1>

![Demo App](/frontend/public/screenshot-for-readme.png)

## 📖 About the Project

AiHire is a comprehensive, full-stack platform designed for conducting remote technical interviews. It provides a real-time, interactive environment where interviewers can assess candidates' coding skills, problem-solving abilities, and communication. The platform integrates live video, a shared code editor, and chat functionalities to simulate an in-person interview experience.

## ✨ Key Features

- **🧑‍💻 VSCode-Powered Code Editor:** A feature-rich code editor based on Monaco Editor (the engine behind VSCode) for a familiar coding experience.
- **🔐 Secure Authentication:** User authentication and management powered by Clerk, ensuring secure access for both interviewers and candidates.
- **🎥 1-on-1 Video Interview Rooms:** High-quality, real-time video and audio communication using the Stream.io SDK.
- **🖥️ Screen Sharing & Recording:** Functionality for screen sharing and recording sessions for later review.
- **💬 Real-time Chat:** A built-in chat for seamless communication during the interview.
- **⚙️ Secure Code Execution:** Code is executed in a secure, isolated environment using the Piston API, supporting multiple programming languages.
- **🎯 Automated Feedback:** The system can run test cases against the candidate's code and provide instant success or failure feedback.
- **🎉 Interactive Experience:** Includes user-friendly features like confetti on successful problem-solving and toast notifications.
- **🧩 Practice Problems:** A dedicated page with a variety of coding problems for candidates to practice in a solo coding mode.
- **🔒 Room Locking:** Interview rooms are locked to a maximum of two participants to ensure a private session.
- **🧭 Dashboard with Live Stats:** A dashboard for interviewers to view statistics and manage interview sessions.
- **🧠 Asynchronous Task Processing:** Background jobs are managed with Inngest for tasks like post-interview analysis or sending notifications.
- **🧰 Robust REST API:** A backend built with Node.js and Express, providing a scalable and maintainable API.
- **⚡ Efficient Data Handling:** Frontend data fetching, caching, and state management are handled by TanStack Query (React Query).

## 🚀 How It Works

1.  **Create a Session:** An interviewer starts by creating a new interview session and selects a coding problem.
2.  **Share the Link:** A unique link for the session is generated and shared with the candidate.
3.  **Join the Interview:** Both the interviewer and candidate join the session, entering a private room with video, chat, and a shared code editor.
4.  **Solve the Problem:** The candidate writes and executes code to solve the given problem, with the output displayed in real-time.
5.  **Collaborate and Assess:** The interviewer observes the candidate's work, communicates via video and chat, and provides guidance or asks questions.
6.  **Review and Analyze:** Session data, including the code and chat history, is saved for future review and analysis.

## 🛠️ Technology Stack

### Backend

- **Framework:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** Clerk
- **Real-time Communication:** Stream.io (Video & Chat)
- **Background Jobs:** Inngest
- **AI Integration:** OpenAI
- **Deployment:** Sevalla

### Frontend

- **Framework:** React, Vite
- **Styling:** Tailwind CSS, DaisyUI
- **Routing:** React Router
- **State Management:** TanStack Query (React Query)
  -- **Real-time Communication:** Stream.io (Video & Chat)
- **Code Editor:** Monaco Editor
- **Deployment:** Sevalla

---

## 🔧 Getting Started

### Prerequisites

- Node.js and npm
- A MongoDB database
- API keys for Clerk, Stream.io, and Inngest

### .env Setup

#### Backend (`/backend`)

```bash
PORT=3000
NODE_ENV=development

DB_URL=your_mongodb_connection_url

INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key

STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret

CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

CLIENT_URL=http://localhost:5173
```

#### Frontend (`/frontend`)

```bash
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

VITE_API_URL=http://localhost:3000/api

VITE_STREAM_API_KEY=your_stream_api_key
```

---

## 🏃‍♀️ Run the Application

### Run the Backend

```bash
cd backend
npm install
npm run dev
```

### Run the Frontend

```bash
cd frontend
npm install
npm run dev
```
