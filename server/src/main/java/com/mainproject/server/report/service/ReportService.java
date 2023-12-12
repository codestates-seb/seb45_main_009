package com.mainproject.server.report.service;

import com.mainproject.server.exception.BusinessLogicException;
import com.mainproject.server.exception.ExceptionCode;
import com.mainproject.server.feed.entity.Feed;
import com.mainproject.server.feed.repository.FeedRepository;
import com.mainproject.server.report.entity.Report;
import com.mainproject.server.report.repository.ReportRepository;
import com.mainproject.server.user.entity.User;
import com.mainproject.server.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Service
public class ReportService {
    private final ReportRepository reportRepository;
    private final FeedRepository feedRepository;
    private final UserRepository userRepository;

    // 특정 피드에 대한 신고를 처리하는 메서드
    public Report submitReport(Long feedId, Long userId, String reason) {

        // 피드 ID로 피드를 조회
        Optional<Feed> feedOptional = feedRepository.findById(feedId);
        if (feedOptional.isPresent()) {
            // 사용자 ID로 사용자를 조회
            Optional<User> userOptional = userRepository.findById(userId);

            if (userOptional.isPresent()) {
                // 신고한 userId와 해당 feedId를 사용하여 Report 엔티티를 생성
                Report report = new Report();
                report.setFeed(feedOptional.get());
                report.setUser(userOptional.get());
                report.setReason(reason);
                // 생성한 Report 엔티티를 저장하고 반환
                return reportRepository.save(report);
            } else {
                throw new BusinessLogicException(ExceptionCode.USER_NOT_FOUND);
            }
        } else {
            throw new BusinessLogicException(ExceptionCode.FEED_NOT_FOUND);
        }
    }

    // 사용자가 이미 해당 피드를 신고했는지 확인하는 메서드
    public boolean hasUserAlreadyReportedFeed(User user, Feed feed) {
        // 사용자와 피드를 기반으로 이미 신고한 신고 내용을 조회
        Optional<Report> existingReport = reportRepository.findByUserAndFeed(user, feed);
        return existingReport.isPresent();
    }

    // 모든 신고를 조회하는 메서드
    public List<Report> getAllReports() {
        // 데이터베이스에서 모든 신고 내용을 조회하고 반환
        return reportRepository.findAll();
    }

}
