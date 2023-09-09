//package com.mainproject.server.auth.utils;
//
//import com.mainproject.server.auth.jwt.JwtTokenizer;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Component;
//
//import javax.servlet.http.HttpServletRequest;
//import java.util.Map;
//
//@Component
//@RequiredArgsConstructor
//public class jwtUtils {
//    private final JwtTokenizer jwtTokenizer;
//
//    public Map<String, Object> getJwsClaimsFromRequest(HttpServletRequest request) {
//        String jws = request.getHeader("Authorization").replace("Bearer ","");
//        String base64EncodedSecretKey = jwtTokenizer.encodeBase64SecretKey(jwtTokenizer.getSecretKey());
//        Map<String, Object> claims = jwtTokenizer.getClaims(jws, base64EncodedSecretKey).getBody();
//
//        return claims;
//    }
//}
