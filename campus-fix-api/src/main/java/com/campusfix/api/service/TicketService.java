package com.campusfix.api.service;

import com.campusfix.api.dto.*;
import com.campusfix.api.exception.ResourceNotFoundException;
import com.campusfix.api.model.Priority;
import com.campusfix.api.model.Ticket;
import com.campusfix.api.model.TicketStatus;
import com.campusfix.api.repository.TicketRepository;
import com.campusfix.api.repository.spec.TicketSpecifications;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final AIAnalysisService aiAnalysisService;

    public TicketService(TicketRepository ticketRepository, AIAnalysisService aiAnalysisService) {
        this.ticketRepository = ticketRepository;
        this.aiAnalysisService = aiAnalysisService;
    }

    @Transactional
    public TicketResponse createTicket(CreateTicketRequest req) {
        Ticket ticket = new Ticket();
        ticket.setRequesterName(req.getRequesterName().trim());
        ticket.setRequesterEmail(req.getRequesterEmail().trim());
        ticket.setBuilding(req.getBuilding().trim());
        ticket.setRoom(req.getRoom() == null ? null : req.getRoom().trim());
        ticket.setEquipmentType(req.getEquipmentType());
        ticket.setDescription(req.getDescription().trim());
        ticket.setStatus(TicketStatus.OPEN);

        // Save first so the ticket exists even if the AI call fails below.
        ticket = ticketRepository.save(ticket);

        Optional<AIAnalysisResult> analysis = aiAnalysisService.analyze(
                ticket.getEquipmentType().name(),
                ticket.getBuilding(),
                ticket.getRoom(),
                ticket.getDescription()
        );

        if (analysis.isPresent()) {
            AIAnalysisResult result = analysis.get();
            ticket.setAiCategory(result.getCategory());
            ticket.setAiSubcategory(result.getSubcategory());
            ticket.setAiPriority(Priority.valueOf(result.getPriority().toUpperCase()));
            ticket.setAiSummary(result.getSummary());
            ticket.setAiSuggestedResponse(result.getSuggestedResponse());
            ticket.setAiAnalysisFailed(false);
        } else {
            ticket.setAiAnalysisFailed(true);
        }

        ticket = ticketRepository.save(ticket);
        return TicketResponse.fromEntity(ticket);
    }

    public List<TicketResponse> getTickets(TicketStatus status, Priority priority, String category) {
        return ticketRepository.findAll(TicketSpecifications.withFilters(status, priority, category))
                .stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(TicketResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public TicketResponse getTicket(Long id) {
        return TicketResponse.fromEntity(findOrThrow(id));
    }

    @Transactional
    public TicketResponse updateStatus(Long id, TicketStatus status) {
        Ticket ticket = findOrThrow(id);
        ticket.setStatus(status);
        return TicketResponse.fromEntity(ticketRepository.save(ticket));
    }

    @Transactional
    public TicketResponse assignTechnician(Long id, String technicianName) {
        Ticket ticket = findOrThrow(id);
        ticket.setAssignedTechnician(technicianName.trim());
        if (ticket.getStatus() == TicketStatus.OPEN) {
            ticket.setStatus(TicketStatus.ASSIGNED);
        }
        return TicketResponse.fromEntity(ticketRepository.save(ticket));
    }

    @Transactional
    public TicketResponse resolveTicket(Long id, String resolutionNotes) {
        Ticket ticket = findOrThrow(id);
        ticket.setResolutionNotes(resolutionNotes.trim());
        ticket.setStatus(TicketStatus.RESOLVED);
        return TicketResponse.fromEntity(ticketRepository.save(ticket));
    }

    public DashboardStatsResponse getStats() {
        long open = ticketRepository.countByStatus(TicketStatus.OPEN)
                + ticketRepository.countByStatus(TicketStatus.ASSIGNED);
        long inProgress = ticketRepository.countByStatus(TicketStatus.IN_PROGRESS);
        long resolved = ticketRepository.countByStatus(TicketStatus.RESOLVED);
        long highPriority = ticketRepository.countByAiPriority(Priority.HIGH);

        String mostCommonCategory = ticketRepository.findAll().stream()
                .filter(t -> t.getAiCategory() != null)
                .collect(Collectors.groupingBy(Ticket::getAiCategory, Collectors.counting()))
                .entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("N/A");

        return DashboardStatsResponse.builder()
                .openCount(open)
                .inProgressCount(inProgress)
                .resolvedCount(resolved)
                .highPriorityCount(highPriority)
                .mostCommonCategory(mostCommonCategory)
                .build();
    }

    private Ticket findOrThrow(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id " + id));
    }
}
