package com.mainproject.server.report.reportDto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ReportResponse {
    private Long id;
    private String reason;
    private Long userId;
    private Long feedId;


}

