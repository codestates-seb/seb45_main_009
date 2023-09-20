    package com.mainproject.server.userprofile.controller;


    import com.mainproject.server.userprofile.dto.UserProfileDto;
    import com.mainproject.server.userprofile.service.UserProfileService;
    import lombok.RequiredArgsConstructor;
    import lombok.extern.slf4j.Slf4j;
    import org.springframework.http.ResponseEntity;
    import org.springframework.validation.annotation.Validated;
    import org.springframework.web.bind.annotation.*;

    @RestController
    @RequestMapping("/profile")
    @Validated
    @Slf4j
    @RequiredArgsConstructor
    public class UserProfileController {
     
        private final UserProfileService userProfileService;


        @GetMapping("/{userId}")
        public ResponseEntity<UserProfileDto> getUserProfileInfo(
                @PathVariable("userId") long userId,
                @RequestParam(name = "page", defaultValue = "1") int page,
                @RequestParam(name = "pageSize", defaultValue = "8") int pageSize) {

            log.info("###############start");
            UserProfileDto userProfileDto = userProfileService.getUserProfileInfo(userId, page, pageSize);
            log.info("###############end");
            return ResponseEntity.ok(userProfileDto);
        }


    }
