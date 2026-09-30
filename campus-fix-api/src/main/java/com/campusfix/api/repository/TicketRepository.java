package com.campusfix.api.repository;

import com.campusfix.api.model.Priority;
import com.campusfix.api.model.Ticket;
import com.campusfix.api.model.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface TicketRepository extends JpaRepository<Ticket, Long>, JpaSpecificationExecutor<Ticket> {

    long countByStatus(TicketStatus status);

    long countByAiPriority(Priority priority);
}
