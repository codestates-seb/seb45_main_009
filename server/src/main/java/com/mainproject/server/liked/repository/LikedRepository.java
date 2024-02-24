package com.mainproject.server.liked.repository;

import com.mainproject.server.feed.entity.Feed;
import com.mainproject.server.liked.entity.Liked;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;

@Repository
public interface LikedRepository extends JpaRepository<Liked, Long> {
    Collection<? extends Liked> findByFeed(Feed feed);
}