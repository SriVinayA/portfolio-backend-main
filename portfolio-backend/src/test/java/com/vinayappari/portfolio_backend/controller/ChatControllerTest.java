package com.vinayappari.portfolio_backend.controller;

import com.vinayappari.portfolio_backend.dto.ChatRequest;
import com.vinayappari.portfolio_backend.service.ChatService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import reactor.core.publisher.Flux;
import static org.assertj.core.api.Assertions.assertThat;

class ChatControllerTest {

    @Test
    void testStreamChat() {
        ChatService chatService = Mockito.mock(ChatService.class);

        // Update mock setup to use the new string conversationId
        Mockito.when(chatService.streamChat("hello", "test-session-id"))
                .thenReturn(Flux.just("hi"));

        ChatController controller = new ChatController(chatService);

        // Update ChatRequest creation to pass the conversationId string
        Flux<String> result = controller.streamChat(new ChatRequest("hello", "test-session-id"));

        assertThat(result.blockFirst()).isEqualTo("hi");
    }
}