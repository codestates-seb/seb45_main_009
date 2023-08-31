package com.mainproject.server.user.dto;

import lombok.*;


import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;


public class UserDto {


    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    @Setter
    public static class PostDto{

        @NotBlank(message = "닉네임을 입력하세요.")
        private String nickname;

        @NotBlank(message = "이메일을 입력하세요.")
        @Email
        private String email;

        @NotBlank(message = "비밀번호를 입력하세요.")
        private String password;

        @NotBlank
        private boolean usertype;

        @NotBlank(message = "성별을 선택하세요")
        private boolean gender;

        @NotBlank(message = "운동 종목을 선택하세요")
        private ArrayList<String> sport;

        private String location;


        private String profileimg;
        private String price;
        private String bio;
        private int height;
        private int weight;
        private LocalDate birth;

    }


    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PatchDto{

        private String nickname;

        private String profileimg;
        private String price;
        private String bio;
        private int height;
        private int weight;

        private String location;

        private String password;


    }


    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResponseDto {
        private Long userId;
        private String nickname;
        private String email;
        private boolean usertype;
        private boolean gender;
        private LocalDateTime createdAt;
        private String bio;
        private String profileimg;
        private String price;
        private int height;
        private int weight;
        private String location;

    }



}
