package com.vinayappari.portfoliobackendmain.dto;

import jakarta.validation.constraints.NotBlank;

public record ChatRequest(
    @NotBlank(message = "Message cannot be blank") 
    String message,
    String conversationId
) {}
