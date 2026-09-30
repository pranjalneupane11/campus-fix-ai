package com.campusfix.api.dto;

import com.campusfix.api.model.EquipmentType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateTicketRequest {

    @NotBlank(message = "Name is required")
    @Size(max = 150)
    private String requesterName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Size(max = 150)
    private String requesterEmail;

    @NotBlank(message = "Building is required")
    @Size(max = 100)
    private String building;

    @Size(max = 50)
    private String room;

    @NotNull(message = "Equipment type is required")
    private EquipmentType equipmentType;

    @NotBlank(message = "Problem description is required")
    @Size(min = 10, max = 4000, message = "Description must be between 10 and 4000 characters")
    private String description;
}
