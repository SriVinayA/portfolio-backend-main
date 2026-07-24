package com.vinayappari.portfolio_backend.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.ai.chat.client.ChatClient;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class ChatConfigurationTest {
    @Autowired(required = false)
    private ChatClient chatClient;

    @Test
    void chatClientBeanIsLoaded() {
        assertThat(chatClient).isNotNull();
    }
}
