package com.mainproject.server.feed.repository;

import com.mainproject.server.feed.enitiy.Feed;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedRepository extends JpaRepository<Feed, Long> {
    @Query("SELECT f FROM Feed f WHERE 'USER' MEMBER OF f.user.roles")
    Page<Feed> findUserFeeds(PageRequest pageRequest);

    @Query("SELECT f FROM Feed f WHERE 'STORE' MEMBER OF f.user.roles")
    Page<Feed> findStoreFeeds(PageRequest pageRequest);

    // relatedTags로 피드 검색
    List<Feed> findByRelatedTagsContainingIgnoreCase(String keyword);

    @Query("SELECT DISTINCT f FROM Feed f JOIN f.relatedTags t WHERE t LIKE %:keyword%")
    List<Feed> findFeedsByRelatedTags(@Param("keyword") String keyword);
}
