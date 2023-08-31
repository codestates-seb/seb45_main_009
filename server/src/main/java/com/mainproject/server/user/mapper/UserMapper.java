package com.mainproject.server.user.mapper;



import com.mainproject.server.user.dto.UserDto;
import com.mainproject.server.user.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.List;


@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {

     User postToUser(UserDto.PostDto postDto);

     User patchToUser(UserDto.PatchDto patchDto);

     UserDto.ResponseDto userToResponse(User user);

     List<UserDto.ResponseDto> UsersToResponses(List<User> users);



}
