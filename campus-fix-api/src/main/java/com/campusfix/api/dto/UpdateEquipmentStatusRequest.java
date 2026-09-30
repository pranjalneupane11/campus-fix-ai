package com.campusfix.api.dto;

import com.campusfix.api.model.EquipmentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateEquipmentStatusRequest {
    @NotNull(message = "Status is required")
    private EquipmentStatus status;
}
