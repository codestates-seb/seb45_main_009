package com.mainproject.server.feed.repository;

import com.mainproject.server.feed.dto.FeedResponseDto;
import com.mainproject.server.feed.enitiy.Feed;
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


    // relatedTags로 피드 검색
    @Query("SELECT DISTINCT f FROM Feed f JOIN f.relatedTags t WHERE t LIKE %:keyword%")
    List<Feed> findFeedsByRelatedTagsContaining(String keyword);

    @Query("SELECT DISTINCT f FROM Feed f JOIN f.relatedTags t WHERE t LIKE %:keyword%")
    List<Feed> findFeedsByRelatedTags(@Param("keyword") String keyword);

    // 특정 태그와 위치를 기반으로 피드를 필터링하는 페이징 쿼리
    Page<Feed> findByRelatedTagsInAndLocationIn(List<String> relatedTags, List<String> location, Pageable pageable);


    // Location 값으로 피드를 필터링하는 메서드
    Page<Feed> findByLocationIn(List<String> location, Pageable pageable);

    // RelatedTags 값으로 피드를 필터링하는 메서드
    Page<Feed> findByRelatedTagsIn(List<String> relatedTags, Pageable pageable);


}


