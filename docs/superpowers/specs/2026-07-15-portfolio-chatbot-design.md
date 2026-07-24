# Portfolio Chatbot API Design

## Overview
A Spring Boot backend feature to provide an AI-powered chatbot for a personal portfolio website. The chatbot will answer questions about the user's professional background, skills, and projects based on a provided knowledge base.

## Architecture & Components

### 1. Configuration (`ChatConfiguration.java`)
- Configures a `ChatClient` bean using Spring AI.
- Injects system prompts and context from local resources (`portfolio.md`, `SystemPrompt.md`, `FaqAndGuardrails.md`).
- Sets up default system text to define the chatbot's persona, guardrails, and knowledge boundaries. By reading these from files at runtime, the prompt can be tweaked without recompiling the application.

### 2. Service Layer (`ChatService.java`)
- Handles the core business logic of communicating with the LLM via Spring AI's `ChatClient`.
- Takes a user message as input.
- Requests a streamed response (`Flux<String>`) to provide real-time token generation back to the caller.

### 3. API Layer (`ChatController.java`)
- Exposes a POST endpoint at `/api/chat/stream`.
- Accepts a JSON payload containing the user's message.
- Produces a `text/event-stream` response (Server-Sent Events) to stream the AI's response back to the frontend.
- Global CORS configuration will be applied to allow requests from the future frontend application.

## Data Flow
1. Frontend sends a POST request with the user's query to `/api/chat/stream`.
2. `ChatController` receives the request and delegates to `ChatService`.
3. `ChatService` uses the pre-configured `ChatClient` (which already has the system prompt and context injected).
4. Spring AI connects to the Gemini API and begins streaming the response.
5. The token stream is piped back through the `ChatService` and `ChatController` to the frontend as Server-Sent Events.

## Error Handling
- Invalid JSON payloads will be handled by standard Spring MVC validation, returning a 400 Bad Request.
- Upstream AI provider errors (e.g., rate limits, API key issues) will be caught and translated into appropriate HTTP error responses (e.g., 503 Service Unavailable or 500 Internal Server Error) with a fallback message.

## Testing
- Unit tests for the `ChatService` using mock `ChatClient` responses.
- Integration tests for the API endpoint using `WebMvcTest` or `SpringBootTest` to ensure the streaming endpoint is correctly mapped and accessible.
