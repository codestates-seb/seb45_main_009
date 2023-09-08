package com.mainproject.server.feed.repository;

import com.mainproject.server.feed.enitiy.Feed;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedRepository extends JpaRepository<Feed, Long> {
//    List<Feed> findByUsertype(boolean userType);
    Feed findByFeedId(Long feedId);
}
