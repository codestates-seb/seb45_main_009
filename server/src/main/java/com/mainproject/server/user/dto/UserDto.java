package com.mainproject.server.user.dto;


import com.fasterxml.jackson.annotation.JsonInclude;
import com.mainproject.server.image.entity.Image;
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

        private String location;

        private Image profileimg;

        @Size(max = 200)
        private String price;

        @Size(max = 200)
        private String bio;

        @Max(value = 300, message = "키는 300보다 작거나 같아야 합니다.")
        private Integer height;

        @Max(value = 300, message = "몸무게는 300보다 작거나 같아야 합니다.")
        private Integer weight;

        private String sport;

    }




    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PatchDto{
        private Long userId;
        private String nickname;
        private Image profileimg;
        private String price;
        private String bio;
        private int height;
        private int weight;
        private String location;
        private String password;
<<<<<<< be-feat/follow
        private String sport;
=======

        private String sport;

>>>>>>> dev-be

    }


    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ResponseDto {
        private Long userId;
        private String nickname;
        private String email;
        private LocalDateTime createdAt;
        private LocalDateTime modifiedAt;
        private String bio;
        private String profileimg;
        private String price;
        private int height;
        private int weight;
        private String location;
        private String sport;
        private List<String> roles = new ArrayList<>();
//        private List<Long> followerList; // 팔로워 리스트
//        private List<Long> followList;   // 팔로우 리스트

    }



}
