package com.campusfix.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Maps directly to the structured JSON the OpenAI API is prompted to return.
 * Any unexpected/extra fields from the model are ignored rather than causing failures.
 */
@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIAnalysisResult {
    private String category;
    private String subcategory;
    private String priority;
    private String summary;
    private String suggestedResponse;
}
