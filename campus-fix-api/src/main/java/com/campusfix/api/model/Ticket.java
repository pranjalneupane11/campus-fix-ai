package com.campusfix.api.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "tickets")
@Getter
@Setter
@NoArgsConstructor
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "requester_name", nullable = false, length = 150)
    private String requesterName;

    @Column(name = "requester_email", nullable = false, length = 150)
    private String requesterEmail;

    @Column(nullable = false, length = 100)
    private String building;

    @Column(length = 50)
    private String room;

    @Enumerated(EnumType.STRING)
    @Column(name = "equipment_type", nullable = false, length = 50)
    private EquipmentType equipmentType;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    // ---- AI-generated fields (nullable: AI call can fail) ----
    @Column(name = "ai_category", length = 50)
    private String aiCategory;

    @Column(name = "ai_subcategory", length = 100)
    private String aiSubcategory;

    @Enumerated(EnumType.STRING)
    @Column(name = "ai_priority", length = 20)
    private Priority aiPriority;

    @Column(name = "ai_summary", columnDefinition = "TEXT")
    private String aiSummary;

    @Column(name = "ai_suggested_response", columnDefinition = "TEXT")
    private String aiSuggestedResponse;

    @Column(name = "ai_analysis_failed", nullable = false)
    private boolean aiAnalysisFailed = false;

    // ---- Workflow fields ----
    @Column(name = "assigned_technician", length = 150)
    private String assignedTechnician;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TicketStatus status = TicketStatus.OPEN;

    @Column(name = "resolution_notes", columnDefinition = "TEXT")
    private String resolutionNotes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
        if (this.status == null) {
            this.status = TicketStatus.OPEN;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
