package com.mainproject.server.user.config;//package com.mainproject.server.user.config;
//
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//
//public class PasswordEncoder {
//
//    private BCryptPasswordEncoder bCryptPasswordEncoder;
//
//
//    public PasswordEncoder() {
//        bCryptPasswordEncoder = new BCryptPasswordEncoder();
//    }
//
//
// //비밀번호를 암호화하여 String 값을 반환
//    public String encode(String password) {
//        return bCryptPasswordEncoder.encode(password);
//    }
//
//
//      // 비밀번호와 암호화된 비밀번호가 일치하는지 확인
//    public boolean matches(String rawPassword, String encodedPassword) {
//        return bCryptPasswordEncoder.matches(rawPassword, encodedPassword);
//    }
//
//
//}
