package com.mainproject.server.user.service;


import com.mainproject.server.auth.jwt.JwtTokenizer;
import com.mainproject.server.exception.BusinessLogicException;
import com.mainproject.server.exception.ExceptionCode;

import com.mainproject.server.image.entity.Image;
import com.mainproject.server.image.service.ImageService;

import com.mainproject.server.user.entity.User;
import com.mainproject.server.user.repository.UserRepository;
import com.mainproject.server.userprofile.entity.UserProfile;
import com.mainproject.server.userprofile.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;


@Service
@Transactional
@RequiredArgsConstructor
public class UserService {



    private final UserRepository userRepository;
    private final ImageService imageService;
    private final UserProfileRepository userProfileRepository;

    @Autowired
    private final JwtTokenizer jwtTokenizer;
    private final PasswordEncoder passwordEncoder;




    // 유저 생성
    public User createUser(User user, MultipartFile profileimg) {
        verifyExistEmail(user.getEmail());
        verifyExistNickname(user.getNickname());


        // 비밀번호 유효성 검사 추가
        if (!isValidPassword(user.getPassword())) {
            throw new BusinessLogicException(ExceptionCode.INVALID_PASSWORD);
        }

        // 비밀번호 암호화
        String encryptedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encryptedPassword);


        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        String formattedDateTime = LocalDateTime.now().format(formatter);

        LocalDateTime createdAt = LocalDateTime.parse(formattedDateTime, formatter);

        user.setCreatedAt(createdAt);


        // 프로필 사진 업로드 및 이미지 엔티티와 관계 설정
        if (profileimg != null && !profileimg.isEmpty()) {
            Image profileImage = new Image();
            String imageUrl = imageService.createImage(profileimg);
            profileImage.setImageUrl(imageUrl);
            profileImage.setUser(user);
            user.setProfileimg(profileImage);
        } else {
            // 이미지가 없는 경우, 이미지 URL이 있는지 확인
            if (user.getProfileimg() == null || user.getProfileimg().getImageUrl() == null) {
                // 이미지 URL도 없는 경우 기본 이미지 URL을 설정
                Image defaultProfileImage = new Image();
                defaultProfileImage.setImageUrl("https://fitfolio-photo.s3.ap-northeast-2.amazonaws.com/default+image/default.png");
                defaultProfileImage.setUser(user);
                user.setProfileimg(defaultProfileImage);
            }
        }

        // UserProfile 생성 및 설정
        UserProfile userProfile = new UserProfile();
        userProfile.setUser(user);
        // 여기서 다른 UserProfile 필드 값들도 설정할 수 있음
        userProfile.setFeedCount(0L);
        userProfile.setFollowerCount(0L);
        userProfile.setFollowCount(0L);
        user.setUserProfile(userProfile);


        Authentication authentication = new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword());
        SecurityContextHolder.getContext().setAuthentication(authentication);


        return userRepository.save(user);
    }


    public User createUserOAuth2(User user) {

        String newName = verifyExistNickName(user.getNickname());
        user.setNickname(newName);

        return userRepository.save(user);
    }


    // 유저 정보 변경
    public User updateUser(Long loginId, User user, MultipartFile profileimg) {

        // 여기에서 loginId와 user를 사용한 검증 로직을 수행합니다.
        verifyPermission(loginId, user.getUserId());

        // 검증이 완료되면 업데이트를 처리합니다.
        User findUser = findVerifiedUser(user.getUserId());

        if(user.getNickname()!=findUser.getNickname()){
            findUser.setNickname(verifyExistNickName(user.getNickname()));
        }

        if (user.getWeight() != null) {
            findUser.setWeight(user.getWeight());
        }

        if (user.getHeight() != null) {
            findUser.setHeight(user.getHeight());
        }

        // 이미지 업데이트
        String newImageUrl = updateProfileImage(findUser, profileimg);
        if (newImageUrl != null) {
            findUser.getProfileimg().setImageUrl(newImageUrl);
        }


        if (user.getSport() != null) {
            findUser.setSport(user.getSport());
        }

        if (user.getBio() != null) {
            findUser.setBio(user.getBio());
        }

        if (user.getPrice() != null) {
            findUser.setPrice(user.getPrice());
        }

        if (user.getPassword() != null) {
            // 비밀번호 유효성 검사를 추가
            if (!isValidPassword(user.getPassword())) {
                throw new BusinessLogicException(ExceptionCode.INVALID_PASSWORD);
            }
            findUser.setPassword(user.getPassword());
        }

        if (user.getLocation() != null) {
            findUser.setLocation(user.getLocation());
        }

        // 업데이트 시간 포맷팅
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String formattedDateTime = LocalDateTime.now().format(formatter);

        // String을 LocalDateTime으로 변환
        LocalDateTime modifiedAt = LocalDateTime.parse(formattedDateTime, formatter);

        findUser.setModifiedAt(modifiedAt);

        return userRepository.save(findUser);
    }

    private String updateProfileImage(User user, MultipartFile profileimg) {
        Image profileImage = user.getProfileimg();
        if (profileImage != null) {
            Long imageId = profileImage.getImageId();
            // 새로운 이미지 업로드 및 URL 저장
            if (profileimg != null && !profileimg.isEmpty()) {
                String newImageUrl = imageService.updateImage(imageId, profileimg);
                return newImageUrl;
            }
        }
        return null; // 프로필 이미지가 업데이트되지 않은 경우
    }



    // 유저 조회
    public User findUser(long userId) {
        User user =  findVerifiedUser(userId);
        Hibernate.initialize(user.getRoles());
        return user;
    }


    // 유저 전체 조회
    public Page<User> findUsers(int page, int size) {
        return userRepository.findAll(PageRequest.of(page, size,
                Sort.by("userId").descending()));
    }


    // 유저 삭제
    public void deleteUser(Long userId) {
        User existingUser = findVerifiedUser(userId);

        // 프로필 이미지 삭제
        Image profileImage = existingUser.getProfileimg();
        if (profileImage != null) {
            String profileImageUrl = profileImage.getImageUrl();
            if (profileImageUrl != null) {
                // 이미지 서비스를 호출하여 해당 URL에 해당하는 이미지 정보를 조회
                Image image = imageService.findImageByImageUrl(profileImageUrl);
                if (image != null) {
                    imageService.deleteImage(image.getImageId());
                }
            }
        }

        userRepository.delete(existingUser);

    }


    public void verifyPermission(Long loginId, long userId) {
        User findUser = findVerifiedUser(loginId);
        if (!findUser.getRoles().contains("ADMIN")) {
            if (loginId != userId) {
                throw new BusinessLogicException(ExceptionCode.NO_PERMISSION_EDITING_POST);
            }
        }
    }


    // userId를 사용하여 유저를 조회
    public User findVerifiedUser(long userId) {
        Optional<User> optionalUser =  userRepository.findById(userId);
        User findUser = optionalUser.orElseThrow(() ->
                new BusinessLogicException(ExceptionCode.USER_NOT_FOUND));

        return findUser;
    }


     // 이메일 사용하여 유저를 조회
    public User findVerifiedUser(String email) {
        Optional<User> optionalUser =  userRepository.findByEmail(email);
        User findUser = optionalUser.orElseThrow(() ->
                new BusinessLogicException(ExceptionCode.USER_NOT_FOUND));

        return findUser;
    }

    // oauth2로 로그인 했을 때 같은 이름이 있을 때 1~1000까지의 랜덤숫자를 생성
    private String verifyExistNickName(String nickname){
        String newNickName = nickname;
        Optional<User> optionalUser = userRepository.findByNickname(nickname);
        if(optionalUser.isPresent()){
            Random random = new Random();
            int randomNumber = random.nextInt(10000) + 1;
            newNickName = nickname + randomNumber;
        }

        return newNickName;
    }


    // 이메일 중복이 있는지 조회
    private void verifyExistEmail(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent())
            throw new BusinessLogicException(ExceptionCode.USER_EXISTS);
    }


    // 닉네임 중복이 있는지 조회
    private void verifyExistNickname(String nickname) {
        Optional<User> user = userRepository.findByNickname(nickname);
        if (user.isPresent())
            throw new BusinessLogicException(ExceptionCode.NICKNAME_EXISTS);
    }


    // 비밀번호 유효성 검증
    private boolean isValidPassword(String password) {
        // 비밀번호는 최소 6자 이상, 영문 대소문자 및 숫자를 포함해야 유효하다고 가정하는 로직
        return password != null && password.length() >= 8 &&
                password.matches(".*[a-zA-Z].*") &&
                password.matches(".*\\d.*");
    }



    public Boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public String delegateAccessToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getUserId());
        claims.put("roles", user.getRoles());


        String subject = user.getEmail();
        Date expiration = jwtTokenizer.getTokenExpiration(jwtTokenizer.getAccessTokenExpirationMinutes());

        String base64EncodedSecretKey = jwtTokenizer.encodeBase64SecretKey(jwtTokenizer.getSecretKey());

        String accessToken = jwtTokenizer.generateAccessToken(claims, subject, expiration, base64EncodedSecretKey);

        return accessToken;
    }


    public String delegateRefreshToken(User user) {


        String subject = user.getEmail();
        Date expiration = jwtTokenizer.getTokenExpiration(jwtTokenizer.getRefreshTokenExpirationMinutes());
        String base64EncodedSecretKey = jwtTokenizer.encodeBase64SecretKey(jwtTokenizer.getSecretKey());

        String refreshToken = jwtTokenizer.generateRefreshToken(subject, expiration, base64EncodedSecretKey);

        return refreshToken;
    }

    // 사용자 저장 또는 업데이트
    public User saveUser(User user) {
        return userRepository.save(user);
    }


//    // 이미지 ID를 가져오는 메서드
//    private Long getImageIdFromUser(User user) {
//        if (user != null && user.getProfileimg() != null) {
//            // user.getProfileimg()는 이미지 URL이라고 가정
//            String imageUrl = user.getProfileimg().getImageUrl();
//
//            // 이미지 서비스를 호출하여 해당 URL에 해당하는 이미지 정보를 조회
//            Image image = imageService.findImageByImageUrl(imageUrl);
//
//            // 조회한 이미지에서 이미지 ID를 반환
//            if (image != null) {
//                return image.getImageId();
//            }
//        }
//        return null;
//    }




}
