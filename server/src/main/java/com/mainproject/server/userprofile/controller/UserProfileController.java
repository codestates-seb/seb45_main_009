    package com.mainproject.server.userprofile.controller;


    import com.mainproject.server.userprofile.dto.UserProfileDto;
    import com.mainproject.server.userprofile.service.UserProfileService;
    import lombok.RequiredArgsConstructor;
    import lombok.extern.slf4j.Slf4j;
    import org.springframework.http.ResponseEntity;
    import org.springframework.validation.annotation.Validated;
    import org.springframework.web.bind.annotation.GetMapping;
    import org.springframework.web.bind.annotation.PathVariable;
    import org.springframework.web.bind.annotation.RequestMapping;
    import org.springframework.web.bind.annotation.RestController;

    @RestController
    @RequestMapping("/profile")
    @Validated
    @Slf4j
    @RequiredArgsConstructor
    public class UserProfileController {

        private final UserProfileService userProfileService;

        @GetMapping("/{userId}")
        public ResponseEntity<UserProfileDto> getUserProfileInfo(@PathVariable("userId") long userId) {
            // userId를 사용하여 사용자 프로필 가져온다.
            UserProfileDto userProfileDto = userProfileService.getUserProfileInfo(userId);

            return ResponseEntity.ok(userProfileDto);
        }


    }
