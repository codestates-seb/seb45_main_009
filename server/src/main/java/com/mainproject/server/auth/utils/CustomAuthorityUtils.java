package com.mainproject.server.auth.utils;

import com.mainproject.server.user.role.UserRole;
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

    private final List<UserRole> ADMIN_USER_ROLES = List.of(UserRole.ADMIN, UserRole.USER, UserRole.STORE);
    private final List<UserRole> USER_USER_ROLES = List.of(UserRole.USER, UserRole.STORE);

    public List<GrantedAuthority> createAuthorities(List<UserRole> roles) {
        List<GrantedAuthority> authorities =
                roles.stream()
                        .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                        .collect(Collectors.toList());

        return authorities;
    }

    public List<UserRole> createRoles(String email) {
        // 이메일을 기반으로 사용자의 기본 역할을 설정
        if (email.equals(adminMailAddress)) {
            return ADMIN_USER_ROLES;
        }
        return USER_USER_ROLES; // 기본 역할을 USER로 설정
    }
}

