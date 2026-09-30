package com.campusfix.api.service;

import com.campusfix.api.config.OpenAIConfig;
import com.campusfix.api.dto.AIAnalysisResult;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Talks to the OpenAI Chat Completions API server-side only. The API key
 * never leaves the backend. Any failure (network, auth, malformed JSON,
 * unexpected schema) results in Optional.empty() rather than an exception
 * bubbling up and blocking ticket creation.
 */
@Service
public class AIAnalysisService {

    private static final Logger log = LoggerFactory.getLogger(AIAnalysisService.class);
    private static final String OPENAI_URL = "https://api.openai.com/v1/chat/completions";

    private static final List<String> VALID_CATEGORIES = List.of(
            "Hardware", "Software", "Network", "Account/Access", "Classroom Technology", "Other");
    private static final List<String> VALID_PRIORITIES = List.of("Low", "Medium", "High");

    private final RestTemplate restTemplate;
    private final OpenAIConfig openAIConfig;
    private final ObjectMapper objectMapper;

    public AIAnalysisService(RestTemplate openAiRestTemplate, OpenAIConfig openAIConfig, ObjectMapper objectMapper) {
        this.restTemplate = openAiRestTemplate;
        this.openAIConfig = openAIConfig;
        this.objectMapper = objectMapper;
    }

    public Optional<AIAnalysisResult> analyze(String equipmentType, String building, String room, String description) {
        if (openAIConfig.getOpenAiApiKey() == null || openAIConfig.getOpenAiApiKey().isBlank()) {
            log.warn("OPENAI_API_KEY is not configured; skipping AI analysis.");
            return Optional.empty();
        }

        try {
            String systemPrompt = buildSystemPrompt();
            String userPrompt = buildUserPrompt(equipmentType, building, room, description);

            Map<String, Object> body = Map.of(
                    "model", openAIConfig.getOpenAiModel(),
                    "messages", List.of(
                            Map.of("role", "system", "content", systemPrompt),
                            Map.of("role", "user", "content", userPrompt)
                    ),
                    "temperature", 0.2,
                    "response_format", Map.of("type", "json_object")
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(openAIConfig.getOpenAiApiKey());

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            JsonNode response = restTemplate.exchange(OPENAI_URL, HttpMethod.POST, request, JsonNode.class).getBody();

            if (response == null) {
                log.warn("OpenAI returned an empty response body.");
                return Optional.empty();
            }

            String content = response.path("choices").path(0).path("message").path("content").asText(null);
            if (content == null || content.isBlank()) {
                log.warn("OpenAI response did not contain message content.");
                return Optional.empty();
            }

            AIAnalysisResult result = objectMapper.readValue(content, AIAnalysisResult.class);
            return validate(result) ? Optional.of(result) : Optional.empty();

        } catch (Exception ex) {
            // Never let an OpenAI/network/parsing failure block ticket creation.
            log.error("AI analysis failed: {}", ex.getMessage());
            return Optional.empty();
        }
    }

    /**
     * Defends against a model returning free-text categories/priorities that
     * don't match our fixed enums, missing fields, or an empty summary.
     */
    private boolean validate(AIAnalysisResult result) {
        if (result == null) return false;
        if (isBlank(result.getCategory()) || !VALID_CATEGORIES.contains(result.getCategory())) return false;
        if (isBlank(result.getPriority()) || !VALID_PRIORITIES.contains(result.getPriority())) return false;
        if (isBlank(result.getSummary())) return false;
        if (isBlank(result.getSuggestedResponse())) return false;
        return true;
    }

    private boolean isBlank(String s) {
        return s == null || s.isBlank();
    }

    private String buildSystemPrompt() {
        return """
            You are an IT support triage assistant for a university campus helpdesk.
            You will be given details of a reported technology problem.
            Respond ONLY with a single valid JSON object (no markdown, no commentary) with exactly these keys:
            "category": one of ["Hardware","Software","Network","Account/Access","Classroom Technology","Other"]
            "subcategory": a short specific label, e.g. "Projector / HDMI"
            "priority": one of ["Low","Medium","High"]
            "summary": a one-sentence plain-language summary of the issue
            "suggestedResponse": 1-3 sentences of practical troubleshooting steps a technician or the reporter could try first
            """;
    }

    private String buildUserPrompt(String equipmentType, String building, String room, String description) {
        return """
            Equipment type: %s
            Location: %s, Room %s
            Reported problem: %s
            """.formatted(equipmentType, building, room == null ? "N/A" : room, description);
    }
}
