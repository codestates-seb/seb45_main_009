package com.mainproject.server.follow.repository;

import com.mainproject.server.follow.entity.Follow;
import com.mainproject.server.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FollowRepository extends JpaRepository<Follow,Long> {


    boolean existsByFollowerAndFollow(User follower, User follow);

    // 팔로우 관계 조회를 위한 메서드
    Follow findByFollowerAndFollow(User follower, User follow);



}
