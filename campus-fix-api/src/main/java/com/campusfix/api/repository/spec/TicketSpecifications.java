package com.campusfix.api.repository.spec;

import com.campusfix.api.model.Priority;
import com.campusfix.api.model.Ticket;
import com.campusfix.api.model.TicketStatus;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

/**
 * Builds a dynamic WHERE clause for GET /api/tickets so status/priority/category
 * filters can be combined freely without a combinatorial explosion of query methods.
 */
public class TicketSpecifications {

    private TicketSpecifications() {
    }

    public static Specification<Ticket> withFilters(TicketStatus status, Priority priority, String category) {
        return (root, query, cb) -> {
            var predicates = cb.conjunction();

            if (status != null) {
                predicates = cb.and(predicates, cb.equal(root.get("status"), status));
            }
            if (priority != null) {
                predicates = cb.and(predicates, cb.equal(root.get("aiPriority"), priority));
            }
            if (StringUtils.hasText(category)) {
                predicates = cb.and(predicates, cb.equal(cb.lower(root.get("aiCategory")), category.toLowerCase()));
            }
            return predicates;
        };
    }
}
