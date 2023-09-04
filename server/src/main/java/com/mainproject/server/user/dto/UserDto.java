package com.mainproject.server.user.dto;

import lombok.*;


import javax.validation.Valid;
import javax.validation.constraints.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


public class UserDto {


    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    @Setter
    public static class PostDto{


        @Valid
        @NotBlank(message = "닉네임을 입력하세요.")
        @Size(max = 10)
        private String nickname;

        @Valid
        @NotBlank(message = "이메일을 입력하세요.")
        @Email
        private String email;

        @Valid
        @NotBlank(message = "비밀번호를 입력하세요.")
        @Size(min = 6, message = "비밀번호는 최소 6자 이상이어야 합니다.")
        private String password;

        @NotBlank(message = "usertype을 선택하세요.") // boolean 타입에서는 @NotBlank 대신 @NotNull 사용
        private int usertype;

        @NotNull(message = "성별을 선택하세요")
        private Boolean gender;

        @NotNull(message = "선호 운동 종목을 선택하세요 (최대 5개)")
        @Size(max = 5)
        private ArrayList<String> sport;

        private String location;

        private String profileimg;

        @Size(max = 200)
        private String price;

        @Size(max = 200)
        private String bio;

        @Max(value = 300, message = "키는 300보다 작거나 같아야 합니다.")
        private Integer height;

        @Max(value = 300, message = "몸무게는 300보다 작거나 같아야 합니다.")
        private Integer weight;

        private LocalDate birth;

    }




    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PatchDto{
        private Long userId;

        private String nickname;

        private String profileimg;
        private String price;
        private String bio;
        private int height;
        private int weight;

        private String location;

        private String password;

        private List<String> sport;
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
        private int usertype;
        private boolean gender;
        private LocalDateTime createdAt;
        private LocalDateTime modifiedAt;
        private String bio;
        private String profileimg;
        private String price;
        private int height;
        private int weight;
        private String location;
        private List<String> sport;


    }



}
