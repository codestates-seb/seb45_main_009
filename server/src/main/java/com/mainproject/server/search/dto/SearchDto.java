package com.mainproject.server.search.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.mainproject.server.feed.dto.FeedResponseDto;
import com.mainproject.server.user.dto.UserDto;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SearchDto {
    private List<UserDto.UserInfo> users;
    private List<FeedResponseDto> feeds;
}
