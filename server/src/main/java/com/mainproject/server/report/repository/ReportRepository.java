package com.mainproject.server.report.repository;

import com.mainproject.server.feed.entity.Feed;
import com.mainproject.server.report.entity.Report;
import com.mainproject.server.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    Optional<Report> findByUserAndFeed(User user, Feed feed);
}