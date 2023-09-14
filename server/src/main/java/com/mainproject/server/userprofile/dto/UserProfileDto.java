package com.mainproject.server.userprofile.dto;



import com.fasterxml.jackson.annotation.JsonInclude;
import com.mainproject.server.feed.dto.FeedResponseDto;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserProfileDto {
    private String nickname;
    private String profileimg;
    private String bio;
    private String price;
    private Integer height;
    private Integer weight;
    private Long feedCount;
    private Long followerCount;
    private Long followCount;
    private List<FeedResponseDto> feedList;
    private List<String> roles;
}