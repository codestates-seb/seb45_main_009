package com.mainproject.server.userprofile.repository;

import com.mainproject.server.user.entity.User;
import com.mainproject.server.userprofile.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserProfileRepository extends JpaRepository<UserProfile,Long> {
    UserProfile findByUser(User user);


}