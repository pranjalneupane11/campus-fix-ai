package com.campusfix.api.dto;

import com.campusfix.api.model.TicketStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateStatusRequest {
    @NotNull(message = "Status is required")
    private TicketStatus status;
}
