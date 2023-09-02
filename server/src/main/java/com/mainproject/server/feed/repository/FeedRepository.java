package com.mainproject.server.feed.repository;

import com.mainproject.server.feed.enitiy.Feed;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeedRepository extends JpaRepository<Feed, Long> {
    List<Feed> findByUsertype(boolean userType);

}
