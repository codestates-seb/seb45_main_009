package com.mainproject.server.feedcomment.repository;

import com.mainproject.server.feedcomment.entity.FeedComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeedCommentRepository extends JpaRepository<FeedComment, Long> {
//    FeedComment findByFeedCommentId(Long feedCommentId);

    Page<FeedComment> findByFeed(Feed feed, PageRequest pageRequest);
}
