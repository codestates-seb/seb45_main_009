package com.mainproject.server.user.repository;

import com.mainproject.server.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long>{

    Optional<User> findByEmail(String email);
    Optional<User> findByNickname(String nickname);


    // 비슷한 닉네임을 가진 사용자를 검색하고 Levenshtein 거리로 정렬하는 쿼리
    // 검색어와 닉네임 사이의 유사성을 기반으로 정렬된 사용자 목록을 얻을 수 있도록 해준다.
    @Query("SELECT u FROM User u WHERE u.nickname LIKE %:query% " +
            "ORDER BY FUNCTION('levenshtein', u.nickname, :query) ASC")
    List<User> searchUsersByNickname(@Param("query") String query);

}
