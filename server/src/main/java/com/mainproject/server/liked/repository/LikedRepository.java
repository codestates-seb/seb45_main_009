package com.mainproject.server.liked.repository;

import com.mainproject.server.liked.entity.Liked;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LikedRepository extends JpaRepository<Liked, Long> {
}