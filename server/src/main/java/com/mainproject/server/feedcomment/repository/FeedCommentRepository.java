package com.mainproject.server.feedcomment.repository;

import com.mainproject.server.feed.entity.Feed;
import com.mainproject.server.feedcomment.entity.FeedComment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeedCommentRepository extends JpaRepository<FeedComment, Long> {
    Page<FeedComment> findByFeed(Feed feed, PageRequest pageRequest);
}
