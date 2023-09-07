package com.mainproject.server.auth.handler;

import com.mainproject.server.auth.jwt.JwtTokenizer;
import com.mainproject.server.auth.utils.CustomAuthorityUtils;
import com.mainproject.server.user.entity.User;
import com.mainproject.server.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URI;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
public class OAuth2MemberSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final JwtTokenizer jwtTokenizer;
    private final CustomAuthorityUtils authorityUtils;
    private final UserService userService;


    @Autowired
    public OAuth2MemberSuccessHandler(UserService userService,JwtTokenizer jwtTokenizer,CustomAuthorityUtils authorityUtils) {
        this.userService = userService;
        this.jwtTokenizer = jwtTokenizer;
        this.authorityUtils = authorityUtils;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        var oAuth2User = (OAuth2User)authentication.getPrincipal();

        String name = String.valueOf(oAuth2User.getAttributes().get("name"));
        String email = String.valueOf(oAuth2User.getAttributes().get("email"));
        String profileimg = (String) oAuth2User.getAttributes().get("picture");
        if (profileimg == null) {
            profileimg = (String) oAuth2User.getAttributes().get("profile_image");
        }


        List<String> authorities = authorityUtils.createRoles(email);
        User user = buildOAuth2User(name, email, profileimg);

        if (!userService.existsByEmail(user.getEmail())) {
            User savedUser = saveUser(user);
            redirect(request, response, savedUser, authorities);
        } else {
            // 이미 userService 인스턴스가 주입되었으므로 주입된 인스턴스를 사용합니다.
            User findUser = userService.findVerifiedUser(user.getEmail());
            redirect(request, response, findUser, authorities);
        }
    }

    private User buildOAuth2User(String name, String email, String image) {
        User user = new User();
        user.setNickname(name);
        user.setEmail(email+"1");
        user.setProfileimg(image);

        return user;
    }


    private User saveUser(User user) {

        return userService.createUserOAuth2(user);
    }

    private void redirect(HttpServletRequest request, HttpServletResponse response, User user, List<String> authorities) throws IOException {
        String accessToken = delegateAccessToken(user, authorities);
        String refreshToken = delegateRefreshToken(user);

        String uri = createURI(request, accessToken, refreshToken).toString();

        String headerValue = "Bearer " + accessToken;
        response.setHeader("Authorization", headerValue);
        response.setHeader("Refresh", refreshToken);

        getRedirectStrategy().sendRedirect(request, response, uri);
    }

    private String delegateAccessToken(User user, List<String> authorities) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getUserId());
        claims.put("roles", authorities);

        String subject = user.getEmail();
        Date expiration = jwtTokenizer.getTokenExpiration(jwtTokenizer.getAccessTokenExpirationMinutes());

        String base64EncodedSecretKey = jwtTokenizer.encodeBase64SecretKey(jwtTokenizer.getSecretKey());

        String accessToken = jwtTokenizer.generateAccessToken(claims, subject, expiration, base64EncodedSecretKey);

        return accessToken;
    }

    private String delegateRefreshToken(User user) {
        String subject = user.getEmail();
        Date expiration = jwtTokenizer.getTokenExpiration(jwtTokenizer.getRefreshTokenExpirationMinutes());
        String base64EncodedSecretKey = jwtTokenizer.encodeBase64SecretKey(jwtTokenizer.getSecretKey());

        String refreshToken = jwtTokenizer.generateRefreshToken(subject, expiration, base64EncodedSecretKey);

        return refreshToken;
    }

    private URI createURI(HttpServletRequest request, String accessToken, String refreshToken) {
        MultiValueMap<String, String> queryParams = new LinkedMultiValueMap<>();
        queryParams.add("access_token", accessToken);
        queryParams.add("refresh_token", refreshToken);

        return UriComponentsBuilder
                .newInstance()
                .scheme("http")
                .host("localhost")
                .port(8080)
                .path("/join")
                .queryParams(queryParams)
                .build()
                .toUri();
    }
}
