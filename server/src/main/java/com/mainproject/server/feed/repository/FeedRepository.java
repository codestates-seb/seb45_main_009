package com.mainproject.server.feed.repository;

import com.mainproject.server.feed.entity.Feed;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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

    // 이미지 정보를 함께 조회하는 쿼리 메서드 정의
    @Query("SELECT f FROM Feed f LEFT JOIN FETCH f.images WHERE f.feedId = :feedId")
    Feed findFeedWithImages(@Param("feedId") Long feedId);


    // relatedTags로 피드 검색
    @Query("SELECT DISTINCT f FROM Feed f JOIN f.relatedTags t WHERE t LIKE %:keyword%")
    List<Feed> findFeedsByRelatedTagsContaining(String keyword);

    // Store feeds: Filter by related tags and location
    @Query("SELECT f FROM Feed f WHERE 'STORE' MEMBER OF f.user.roles AND f.location IN :location AND EXISTS "
            + "(SELECT t FROM f.relatedTags t WHERE t IN :relatedTags)")
    Page<Feed> findByRelatedTagsInAndLocationInForStore(@Param("relatedTags") List<String> relatedTags, @Param("location") List<String> location, Pageable pageable);

    // Store feeds: Filter by location
    @Query("SELECT f FROM Feed f WHERE 'STORE' MEMBER OF f.user.roles AND f.location IN :location")
    Page<Feed> findByLocationInForStore(@Param("location") List<String> location, Pageable pageable);

    // Store feeds: Filter by related tags
    @Query("SELECT f FROM Feed f WHERE 'STORE' MEMBER OF f.user.roles AND EXISTS "
            + "(SELECT t FROM f.relatedTags t WHERE t IN :relatedTags)")
    Page<Feed> findByRelatedTagsInForStore(@Param("relatedTags") List<String> relatedTags, Pageable pageable);

    // User feeds: Filter by related tags
    @Query("SELECT f FROM Feed f WHERE 'USER' MEMBER OF f.user.roles AND EXISTS "
            + "(SELECT t FROM f.relatedTags t WHERE t IN :relatedTags)")
    Page<Feed> findByRelatedTagsInForUser(@Param("relatedTags") List<String> relatedTags, Pageable pageable);

}


