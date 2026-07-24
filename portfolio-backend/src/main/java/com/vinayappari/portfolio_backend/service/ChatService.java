package com.vinayappari.portfolio_backend.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import java.time.Duration;

@Service
public class ChatService {

    private final ChatClient chatClient;

    public ChatService(ChatClient chatClient) {
        this.chatClient = chatClient;
    }

    public Flux<String> streamChat(String message, String conversationId) {
        String chatId = (conversationId != null && !conversationId.isBlank())
                ? conversationId
                : "default-session";

        return this.chatClient.prompt()
                .user(message)
                // Use the updated constant from the ChatMemory interface
                .advisors(a -> a.param(ChatMemory.CONVERSATION_ID, chatId))
                .stream()
                .content();
    }
}
