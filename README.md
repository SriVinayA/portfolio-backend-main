# Vinay Appari — Personal Portfolio & AI Chatbot

A modern, interactive personal portfolio built with React and Spring Boot. This isn't just a static site—it features a custom AI assistant powered by Spring AI and Google's Gemini API that has been specifically trained on my resume and professional background.

## 🚀 Tech Stack

### Frontend (`/portfolio-frontend`)
*   **Framework:** React 19, Vite, TanStack Router
*   **Styling:** Tailwind CSS v4, native CSS scroll-driven animations (`text-wrap: balance`, `animation-timeline`)
*   **UI Components:** shadcn/ui, Radix UI
*   **Deployment:** Vercel

### Backend (`/portfolio-backend`)
*   **Framework:** Java 21, Spring Boot 3
*   **AI Integration:** Spring AI, Google Gemini 3.1 (600-token response limit)
*   **Real-time Chat:** Server-Sent Events (SSE) for streaming responses
*   **API Protection:** In-memory rate limiting via Bucket4j (7 req/min)
*   **Build Tool:** Gradle
*   **Deployment:** Google Cloud Run (via Docker)

### 💬 Chat Features
*   **Streaming Responses:** AI replies are streamed in real time using Server-Sent Events (SSE)
*   **Prompt Limit:** User messages are limited to **300 characters** for concise, focused questions
*   **Response Limit:** AI responses are capped at **600 tokens** to improve latency and control API usage
*   **Rate Limiting:** 7 requests per minute using Bucket4j

---

## 🛠️ Running Locally

### Prerequisites
*   Node.js v20+
*   Java 21
*   A DeepSeek API Key (API cost is cheap :))

### 1. Start the Backend
The backend serves the AI chatbot. You must provide a DeepSeek API key. By default, AI responses are capped at 600 output tokens.

```bash
cd portfolio-backend
export DEEPSEEK_API_KEY="your_api_key_here"
./gradlew bootRun
```
*The backend will start on `http://localhost:8080`.*

### 2. Start the Frontend
The frontend uses Vite and expects the backend to be running on port 8080 by default.

```bash
cd portfolio-frontend
npm install
npm run dev
```
*The frontend will start on `http://localhost:5173`.*

---

## ☁️ Deployment

This repository is configured for automated, free-tier deployments.

### Backend (Google Cloud Run)
A GitHub Actions workflow is included to automate the Java 21 build and deployment to Google Cloud Run.
1. Create a Google Cloud Project and enable the Cloud Run API.
2. Set up GitHub Repository Secrets for `GCP_CREDENTIALS` (your service account JSON) and `DEEPSEEK_API_KEY`.
3. Pushing to the `main` branch will automatically trigger the `.github/workflows/deploy-portfolio-backend.yml` action to deploy your service.

### Frontend (Vercel)
1. Import the repository into Vercel.
2. Set the Root Directory to `portfolio-frontend`.
3. Add a `VITE_CHAT_API_URL` environment variable pointing to your Cloud Run backend URL (e.g., `https://portfolio-backend-xxxxxx.a.run.app`).
# portfolio-main
