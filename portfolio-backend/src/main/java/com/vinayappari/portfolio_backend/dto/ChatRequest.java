package com.vinayappari.portfolio_backend.dto;

import jakarta.validation.constraints.NotBlank;

public record ChatRequest(
    @NotBlank(message = "Message cannot be blank") 
    String message,
    String conversationId
) {}
