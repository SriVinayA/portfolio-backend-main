package com.vinayappari.portfoliobackendmain.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfiguration implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
//                .allowedOrigins("*") // In production, this should be restricted
                .allowedOrigins(
                "https://portfolio-frontend-main-git-main-sri-vinay-as-projects.vercel.app/",
                "https://portfolio-frontend-main-nu.vercel.app/",
                "https://portfolio-frontend-main-git-main-sri-vinay-as-projects.vercel.app/",
                "https://portfolio-frontend-main-l601bevlw-sri-vinay-as-projects.vercel.app/",
                "http://localhost:3000",
                "http://localhost:5173"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }
}
