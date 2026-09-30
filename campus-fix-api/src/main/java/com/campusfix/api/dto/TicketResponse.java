package com.campusfix.api.dto;

import com.campusfix.api.model.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class TicketResponse {
    private Long id;
    private String requesterName;
    private String requesterEmail;
    private String building;
    private String room;
    private EquipmentType equipmentType;
    private String description;

    private String aiCategory;
    private String aiSubcategory;
    private Priority aiPriority;
    private String aiSummary;
    private String aiSuggestedResponse;
    private boolean aiAnalysisFailed;

    private String assignedTechnician;
    private TicketStatus status;
    private String resolutionNotes;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static TicketResponse fromEntity(Ticket t) {
        return TicketResponse.builder()
                .id(t.getId())
                .requesterName(t.getRequesterName())
                .requesterEmail(t.getRequesterEmail())
                .building(t.getBuilding())
                .room(t.getRoom())
                .equipmentType(t.getEquipmentType())
                .description(t.getDescription())
                .aiCategory(t.getAiCategory())
                .aiSubcategory(t.getAiSubcategory())
                .aiPriority(t.getAiPriority())
                .aiSummary(t.getAiSummary())
                .aiSuggestedResponse(t.getAiSuggestedResponse())
                .aiAnalysisFailed(t.isAiAnalysisFailed())
                .assignedTechnician(t.getAssignedTechnician())
                .status(t.getStatus())
                .resolutionNotes(t.getResolutionNotes())
                .createdAt(t.getCreatedAt())
                .updatedAt(t.getUpdatedAt())
                .build();
    }
}
