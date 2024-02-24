package com.mainproject.server.user.repository;

import com.mainproject.server.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByNickname(String nickname);

    boolean existsByEmail(String email);

    // nickname으로 사용자 검색
    List<User> findByNicknameContaining(String keyword);
}
