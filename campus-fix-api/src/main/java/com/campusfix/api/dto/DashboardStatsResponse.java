package com.campusfix.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class DashboardStatsResponse {
    private long openCount;
    private long inProgressCount;
    private long resolvedCount;
    private long highPriorityCount;
    private String mostCommonCategory;
}
