package com.mainproject.server.auth.utils;

import com.mainproject.server.user.entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;


@Component
public class CustomAuthorityUtils {
    @Value("${mail.address.admin}")
    private String adminMailAddress;

    private final List<GrantedAuthority> ADMIN_ROLES = AuthorityUtils.createAuthorityList("ROLE_ADMIN", "ROLE_USER");
    private final List<GrantedAuthority> USER_ROLES = AuthorityUtils.createAuthorityList("ROLE_USER");

    private final List<User.UserRole> ADMIN_USER_ROLES = List.of(User.UserRole.ADMIN, User.UserRole.USER, User.UserRole.STORE);
    private final List<User.UserRole> USER_USER_ROLES = List.of(User.UserRole.USER, User.UserRole.STORE);

    public List<GrantedAuthority> createAuthorities(List<User.UserRole> roles) {
        List<GrantedAuthority> authorities =
                roles.stream()
                        .map(role -> new SimpleGrantedAuthority(role.toString())) // "ROLE_" 접두사를 제거
                        .collect(Collectors.toList());

        return authorities;
    }

    public List<User.UserRole> createRoles(String email) {
        // 이메일을 기반으로 사용자의 기본 역할을 설정
        if (email.equals(adminMailAddress)) {
            return ADMIN_USER_ROLES;
        }
        return USER_USER_ROLES; // 기본 역할을 USER로 설정
    }
}
