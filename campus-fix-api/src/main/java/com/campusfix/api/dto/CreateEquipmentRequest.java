package com.campusfix.api.dto;

import com.campusfix.api.model.EquipmentType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateEquipmentRequest {
    @NotBlank(message = "Asset ID is required")
    @Size(max = 50)
    private String assetId;

    @NotBlank(message = "Equipment name is required")
    @Size(max = 150)
    private String name;

    @NotNull(message = "Equipment type is required")
    private EquipmentType type;

    @NotBlank(message = "Building is required")
    @Size(max = 100)
    private String building;

    @Size(max = 50)
    private String room;
}
