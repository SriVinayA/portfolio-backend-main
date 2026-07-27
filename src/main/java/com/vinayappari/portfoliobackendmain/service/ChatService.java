package com.vinayappari.portfoliobackendmain.service;

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

        // Safety-net enforcement: reinforce English-only output on every turn,
        // in case memory dilutes the original system prompt instruction.
        String enforcedMessage = message + "\n\n[SYSTEM NOTE: Respond only in English, regardless of the language of this message.]";

        return this.chatClient.prompt()
                .user(enforcedMessage)
                // Use the updated constant from the ChatMemory interface
                .advisors(a -> a.param(ChatMemory.CONVERSATION_ID, chatId))
                .stream()
                .content();
    }
}