package com.mainproject.server.report.controller;

import com.mainproject.server.auth.loginresolver.LoginUserId;
import com.mainproject.server.exception.BusinessLogicException;
import com.mainproject.server.exception.ExceptionCode;
import com.mainproject.server.feed.entity.Feed;
import com.mainproject.server.feed.service.FeedService;
import com.mainproject.server.report.entity.Report;
import com.mainproject.server.report.reportDto.ReportResponse;
import com.mainproject.server.report.service.ReportService;
import com.mainproject.server.user.entity.User;
import com.mainproject.server.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/")
public class ReportController {
    private final ReportService reportService;
    private final UserService userService;
    private final FeedService feedService;

    // 특정 피드에 대한 신고를 처리
    @PreAuthorize("isAuthenticated()")
    @PostMapping("feed/detail/{feed-id}/report")
    public ResponseEntity<ReportResponse> submitReport(@PathVariable("feed-id") Long feedId, @LoginUserId Long userId,
                                                       @RequestBody Map<String, String> reportRequest) {
        // ID를 기반으로 사용자를 탐색
        User findUser = userService.findUser(userId);

        // 사용자가 유효한지 확인
        if (findUser != null) {

            // 현재 로그인한 사용자를 탐색
            User currentUser = userService.findVerifiedUser(userId);

            // 제공된 feedId를 기반으로 피드를 탐색
            Feed feed = feedService.findFeedId(feedId);

            // 자기 자신을 신고하는 것을 방지 (사용자는 자신의 피드를 신고할 수 없음)
            if (currentUser.getUserId().equals(feed.getUser().getUserId())) {
                log.info("자기자신은 신고할 수 없습니다.");
                throw new BusinessLogicException(ExceptionCode.SELF_REPORT_NOT_ALLOWED);
            }

            // 사용자가 이미 이 피드를 신고했는지 확인 (사용자는 피드를 중복으로 신고할 수 없음)
            boolean hasAlreadyReported = reportService.hasUserAlreadyReportedFeed(currentUser, feed);
            if (hasAlreadyReported) {
                log.info("이미 해당 게시물을 신고했습니다.");
                throw new BusinessLogicException(ExceptionCode.ALREADY_REPORT);
            }

            // 신고 이유를 요청 본문에서 가져옴
            String reason = reportRequest.get("reason");

            // 신고를 제출하고 저장된 신고 객체를 가져옴
            Report savedReport = reportService.submitReport(feedId, userId, reason);

            // 필요한 정보를 포함하는 응답용 DTO를 생성
            ReportResponse reportResponse = new ReportResponse();
            reportResponse.setId(savedReport.getId());
            reportResponse.setReason(savedReport.getReason());
            reportResponse.setUserId(savedReport.getUser().getUserId());
            reportResponse.setFeedId(savedReport.getFeed().getFeedId());

            return new ResponseEntity<>(reportResponse, HttpStatus.CREATED);
        } else {
            throw new BusinessLogicException(ExceptionCode.ACCESS_DENIED);
        }
    }

    // 모든 신고를 검색하고 'ADMIN' 역할을 가진 사용자에게만 접근 권한 존재
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/reports")
    public ResponseEntity<List<ReportResponse>> getAllReports() {
        // 서비스에서 모든 신고를 가져옴
        List<Report> reports = reportService.getAllReports();

        // Report 엔티티를 ReportResponse DTO로 변환
        List<ReportResponse> adminReports = reports.stream()
                .map(report -> {
                    ReportResponse adminReport = new ReportResponse();
                    adminReport.setId(report.getId());
                    adminReport.setReason(report.getReason());
                    adminReport.setUserId(report.getUser().getUserId());
                    adminReport.setFeedId(report.getFeed().getFeedId());
                    return adminReport;
                })
                .collect(Collectors.toList());

        // 신고 DTO 목록을 포함하는 응답을 반환
        return ResponseEntity.ok(adminReports);
    }
}
