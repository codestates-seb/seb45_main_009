package com.mainproject.server.userprofile.dto;



import com.mainproject.server.feed.dto.FeedResponseDto;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileDto {
    private String nickname;
    private String profileimg;
    private Long feedCount;
    private Long followerCount;
    private Long followCount;
    private List<FeedResponseDto> feedList;
}