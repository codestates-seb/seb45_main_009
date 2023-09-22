package com.mainproject.server.user.mapper;



import com.mainproject.server.image.entity.Image;
import com.mainproject.server.user.dto.AuthLoginDto;
import com.mainproject.server.user.dto.UserDto;
import com.mainproject.server.user.entity.User;
import org.mapstruct.*;

import java.util.List;
import java.util.stream.Collectors;


@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {

     User postToUser(UserDto.PostDto postDto);

     User patchToUser(UserDto.PatchDto patchDto);


     @Mapping(source = "profileimg.imageUrl", target = "profileimg")
     UserDto.ResponseDto userToResponse(User user);

     List<UserDto.ResponseDto> UsersToResponses(List<User> users);

     @Mapping(source = "profileimg", target = "profileimg" ,qualifiedByName = "stringToImage")
     User AuthLoginDtoUser(AuthLoginDto authLoginDto);

     @Named("stringToImage")
     default Image stringToImage(String profileimg) {
          if (profileimg == null || profileimg.isEmpty()) {
               return null; // Handle null or empty string appropriately, or return a default Image if needed
          }

          // Implement the conversion logic here, e.g., parse the string and create an Image object
          Image image = new Image();
          image.setImageUrl(profileimg); // Assuming there's a setter for the image URL

          return image;
     }
}
