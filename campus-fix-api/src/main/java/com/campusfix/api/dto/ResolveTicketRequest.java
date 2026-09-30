package com.campusfix.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResolveTicketRequest {
    @NotBlank(message = "Resolution notes are required")
    @Size(max = 4000)
    private String resolutionNotes;
}
