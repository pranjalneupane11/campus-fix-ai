package com.campusfix.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AssignTechnicianRequest {
    @NotBlank(message = "Technician name is required")
    @Size(max = 150)
    private String technicianName;
}
