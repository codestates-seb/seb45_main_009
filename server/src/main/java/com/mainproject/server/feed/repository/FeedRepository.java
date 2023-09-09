package com.mainproject.server.feed.repository;

import com.mainproject.server.feed.enitiy.Feed;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedRepository extends JpaRepository<Feed, Long> {
    @Query("SELECT f FROM Feed f WHERE 'USER' MEMBER OF f.user.roles")
    List<Feed> findUserFeeds();

    @Query("SELECT f FROM Feed f WHERE 'STORE' MEMBER OF f.user.roles")
    List<Feed> findStoreFeeds();
}
