package com.mainproject.server.auth.handler;

import com.mainproject.server.auth.jwt.JwtTokenizer;
import com.mainproject.server.auth.utils.CustomAuthorityUtils;
import com.mainproject.server.image.entity.Image;
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

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        // OAuth2 인증이 성공했을 때 호출되는 메서드

        // OAuth2User 객체를 가져옵니다.
        var oAuth2User = (OAuth2User)authentication.getPrincipal();

        // 사용자의 이메일 및 프로필 이미지 URL을 추출합니다.
        String email = String.valueOf(oAuth2User.getAttributes().get("email"));
        String profileimg = (String) oAuth2User.getAttributes().get("picture");
        if (profileimg == null) {
            profileimg = (String) oAuth2User.getAttributes().get("profile_image");
        }

        // 사용자의 권한을 생성하고 사용자 정보를 빌드합니다.
        List<String> authorities = authorityUtils.createRoles(email);
        User user = buildOAuth2User(email, profileimg);

        // 사용자가 데이터베이스에 존재하지 않으면 새로운 사용자를 저장하고 리디렉션합니다.
        if (!userService.existsByEmail(user.getEmail())) {
            User savedUser = saveUser(user);
            redirect(request, response, savedUser, authorities);
        } else {
            // 이미 존재하는 사용자인 경우, 기존 사용자 정보를 가져와 리디렉션합니다.
            User findUser = userService.findVerifiedUser(user.getEmail());
            redirect(request, response, findUser, authorities);
        }
    }

    private User buildOAuth2User(String email, String image) {
        // OAuth2User에서 추출한 정보를 사용하여 User 객체를 빌드합니다.
        User user = new User();
        user.setEmail(email+"1");

        // 프로필 이미지 URL을 문자열로 저장
        Image profileimg = new Image();
        profileimg.setImageUrl(image);
        profileimg.setUser(user);
        user.setProfileimg(profileimg);

        return user;
    }

    private User saveUser(User user) {
        // 사용자 정보를 저장하고 반환합니다.
        return userService.createUserOAuth2(user);
    }

    private void redirect(HttpServletRequest request, HttpServletResponse response, User user, List<String> authorities) throws IOException {
        // 사용자를 리디렉션하고 인증 토큰 및 리프레시 토큰을 설정합니다.

        // 액세스 토큰 및 리프레시 토큰을 생성하고 설정합니다.
        String accessToken = delegateAccessToken(user, authorities);
        String refreshToken = delegateRefreshToken(user);

        // 리디렉션 URI를 생성합니다.
        String uri = createURI(request, accessToken, refreshToken).toString();

        // HTTP 응답 헤더에 토큰 정보를 설정합니다.
        String headerValue = "Bearer " + accessToken;
        response.setHeader("Authorization", headerValue);
        response.setHeader("Refresh", refreshToken);

        // 클라이언트를 리디렉션합니다.
        getRedirectStrategy().sendRedirect(request, response, uri);
    }

    private String delegateAccessToken(User user, List<String> authorities) {
        // 액세스 토큰을 위한 클레임과 정보를 사용하여 액세스 토큰을 생성합니다.

        // 클레임을 설정합니다.
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getUserId());
        claims.put("roles", authorities);

        // 액세스 토큰의 주제와 만료 날짜를 설정합니다.
        String subject = user.getEmail();
        Date expiration = jwtTokenizer.getTokenExpiration(jwtTokenizer.getAccessTokenExpirationMinutes());

        // 액세스 토큰을 생성합니다.
        String base64EncodedSecretKey = jwtTokenizer.encodeBase64SecretKey(jwtTokenizer.getSecretKey());
        String accessToken = jwtTokenizer.generateAccessToken(claims, subject, expiration, base64EncodedSecretKey);

        return accessToken;
    }

    private String delegateRefreshToken(User user) {
        // 리프레시 토큰을 생성합니다.

        // 리프레시 토큰의 주제와 만료 날짜를 설정합니다.
        String subject = user.getEmail();
        Date expiration = jwtTokenizer.getTokenExpiration(jwtTokenizer.getRefreshTokenExpirationMinutes());
        String base64EncodedSecretKey = jwtTokenizer.encodeBase64SecretKey(jwtTokenizer.getSecretKey());

        // 리프레시 토큰을 생성합니다.
        String refreshToken = jwtTokenizer.generateRefreshToken(subject, expiration, base64EncodedSecretKey);

        return refreshToken;
    }

    private URI createURI(HttpServletRequest request, String accessToken, String refreshToken) {
        // 리디렉션 URI를 생성합니다.

        // 쿼리 매개변수를 설정합니다.
        MultiValueMap<String, String> queryParams = new LinkedMultiValueMap<>();
        queryParams.add("access_token", accessToken);
        queryParams.add("refresh_token", refreshToken);

        // URI를 생성하여 반환합니다.
        return UriComponentsBuilder
                .newInstance()
                .scheme("http")
                .host("http://localhost:3000")
                .port(80)
                .path("/oauthloading")
                .queryParams(queryParams)
                .build()
                .toUri();
    }
}
