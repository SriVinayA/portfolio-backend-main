package com.vinayappari.portfoliobackendmain.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

@Service
public class ChatService {

    private static final Logger log = LoggerFactory.getLogger(ChatService.class);
    private final ChatClient chatClient;

    public ChatService(ChatClient chatClient) {
        this.chatClient = chatClient;
    }

    public Flux<String> streamChat(String message, String conversationId) {
        String chatId = (conversationId != null && !conversationId.isBlank())
                ? conversationId
                : "default-session";

//        log.info("Incoming chat message | conversationId={} | message={}", chatId, message);
        log.info("{}", message);

        String enforcedMessage = message + "\n\n[SYSTEM NOTE: Respond only in English, regardless of the language of this message.]";

        return this.chatClient.prompt()
                .user(enforcedMessage)
                .advisors(a -> a.param(ChatMemory.CONVERSATION_ID, chatId))
                .stream()
                .content();
    }
}