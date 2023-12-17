package com.mainproject.server.user.service;


import com.mainproject.server.auth.jwt.JwtTokenizer;
import com.mainproject.server.exception.BusinessLogicException;
import com.mainproject.server.exception.ExceptionCode;
import com.mainproject.server.image.entity.Image;
import com.mainproject.server.image.service.ImageService;
import com.mainproject.server.user.entity.User;
import com.mainproject.server.user.repository.UserRepository;
import com.mainproject.server.userprofile.entity.UserProfile;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;


@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private static final String DEFAULT_PROFILE_IMAGE_URL = "https://fitfolio-photo.s3.ap-northeast-2.amazonaws.com/Defaultimage/defaultImage.png";
    private static final String DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm";

    private final UserRepository userRepository;
    private final ImageService imageService;
    private final JwtTokenizer jwtTokenizer;
    private final PasswordEncoder passwordEncoder;

    // 유저 생성
    public User createUser(User user, MultipartFile profileimg) {
        verifyExistEmail(user.getEmail());
        verifyExistNickname(user.getNickname());
        validatePassword(user.getPassword());
        encryptPassword(user);

        user.setCreatedAt(generateCurrentDateTime());
        handleProfileImage(user, profileimg);
        createUserProfile(user);
        setAuthentication(user);

        return saveUser(user);
    }

    private void handleProfileImage(User user, MultipartFile profileimg) {
        handleOrUpdateProfileImage(user, profileimg);

        // 이미지가 없는 경우, 이미지 URL이 있는지 확인
        if (user.getProfileimg() == null || user.getProfileimg().getImageUrl() == null) {
            Image defaultProfileImage = new Image();
            defaultProfileImage.setImageUrl(DEFAULT_PROFILE_IMAGE_URL);
            defaultProfileImage.setUser(user);
            user.setProfileimg(defaultProfileImage);
        }
    }

    private void handleOrUpdateProfileImage(User user, MultipartFile profileimg) {
        Image profileImage = user.getProfileimg();

        if (profileImage == null) {
            profileImage = new Image();
        }

        if (profileimg != null && !profileimg.isEmpty()) {
            String imageUrl = imageService.updateImage(profileImage.getImageId(), profileimg);
            profileImage.setImageUrl(imageUrl);
        }

        profileImage.setUser(user);
        user.setProfileimg(profileImage);
    }

    private void validatePassword(String password) {
        if (!isValidPassword(password)) {
            throw new BusinessLogicException(ExceptionCode.INVALID_PASSWORD);
        }
    }

    // 비밀번호 암호화를 처리하는 메서드
    private void encryptPassword(User user) {
        String encryptedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encryptedPassword);
    }

    public User createUserOAuth2(User user, String image) {

        String newName = verifyExistKakaoNickName(user.getNickname());
        user.setNickname(newName);

        Image profileImage = new Image();
        user.getProfileimg().setUser(user);

        createUserProfile(user);

        return saveUser(user);
    }

    // 현재 시간을 생성하는 메서드
    private LocalDateTime generateCurrentDateTime() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(DATE_TIME_FORMAT);
        String formattedDateTime = LocalDateTime.now().format(formatter);
        return LocalDateTime.parse(formattedDateTime, formatter);
    }

    // 유저 정보 변경
    public User updateUser(Long loginId, User user, MultipartFile profileimg) {
        verifyPermission(loginId, user.getUserId());
        User findUser = findVerifiedUser(user.getUserId());

        updateNickname(findUser, user.getNickname());
        updateWeight(findUser, user.getWeight());
        updateHeight(findUser, user.getHeight());
        updateProfileImage(findUser, profileimg);
        updateSport(findUser, user.getSport());
        updateBio(findUser, user.getBio());
        updatePrice(findUser, user.getPrice());
        updatePassword(findUser, user.getPassword());
        updateLocation(findUser, user.getLocation());
        updateModifiedAt(findUser);

        return saveUser(findUser);
    }

    private void updateNickname(User user, String newNickname) {
        if (newNickname != null && !newNickname.equals(user.getNickname())) {
            verifyExistNickname(newNickname);
            user.setNickname(newNickname);
        }
    }

    private void updateWeight(User user, Integer newWeight) {
        if (newWeight != null) {
            user.setWeight(newWeight);
        }
    }

    private void updateHeight(User user, Integer newHeight) {
        if (newHeight != null) {
            user.setHeight(newHeight);
        }
    }

    private void updateSport(User user, String newSport) {
        if (newSport != null) {
            user.setSport(newSport);
        }
    }

    private void updateBio(User user, String newBio) {
        if (newBio != null) {
            user.setBio(newBio);
        }
    }

    private void updatePrice(User user, String newPrice) {
        if (newPrice != null) {
            user.setPrice(newPrice);
        }
    }

    private void updatePassword(User user, String newPassword) {
        if (newPassword != null) {
            validatePassword(newPassword);
            encryptPassword(user);
            user.setPassword(newPassword);
        }
    }

    private void updateLocation(User user, String newLocation) {
        if (newLocation != null) {
            user.setLocation(newLocation);
        }
    }

    private void updateModifiedAt(User user) {
        user.setModifiedAt(generateCurrentDateTime());
    }


    private void updateProfileImage(User user, MultipartFile profileimg) {
        handleOrUpdateProfileImage(user, profileimg);
    }

    // Authentication 설정을 처리하는 메서드
    private void setAuthentication(User user) {
        Authentication authentication = new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword());
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    // UserProfile 생성 및 설정을 처리하는 메서드
    private void createUserProfile(User user) {
        UserProfile userProfile = new UserProfile();
        userProfile.setUser(user);
        userProfile.setFeedCount(0L);
        userProfile.setFollowerCount(0L);
        userProfile.setFollowCount(0L);
        user.setUserProfile(userProfile);
    }

    // 유저 조회
    public User findUser(long userId) {
        User user = findVerifiedUser(userId);
        Hibernate.initialize(user.getRoles());
        return user;
    }

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    // 유저 삭제
    public void deleteUser(Long userId) {
        User existingUser = findVerifiedUser(userId);

        // 프로필 이미지 삭제
        Image profileImage = existingUser.getProfileimg();
        if (profileImage != null) {
            String profileImageUrl = profileImage.getImageUrl();
            Image image = imageService.findImageByImageUrl(profileImageUrl);
            imageService.deleteImage(image.getImageId());
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
        Optional<User> optionalUser = userRepository.findById(userId);
        return optionalUser.orElseThrow(() ->
                new BusinessLogicException(ExceptionCode.USER_NOT_FOUND));
    }

    // 이메일 사용하여 유저를 조회
    public User findVerifiedUser(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);

        return optionalUser.orElseThrow(() ->
                new BusinessLogicException(ExceptionCode.USER_NOT_FOUND));
    }

    // oauth2로 로그인 했을 때 같은 이름이 있을 때 1~1000까지의 랜덤숫자를 생성
    private String verifyExistKakaoNickName(String nickname) {
        String newNickName = nickname;
        Optional<User> optionalUser = userRepository.findByNickname(nickname);
        if (optionalUser.isPresent()) {
            Random random = new Random();
            int randomNumber = random.nextInt(10000) + 1;
            newNickName = nickname + randomNumber;
        }
        return newNickName;
    }

    // 이메일 중복이 있는지 조회
    private void verifyExistEmail(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            throw new BusinessLogicException(ExceptionCode.USER_EXISTS);
        }
    }

    // 닉네임 중복이 있는지 조회
    private void verifyExistNickname(String nickname) {
        Optional<User> user = userRepository.findByNickname(nickname);
        if (user.isPresent()) {
            throw new BusinessLogicException(ExceptionCode.NICKNAME_EXISTS);
        }
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

        return jwtTokenizer.generateRefreshToken(subject, expiration, base64EncodedSecretKey);
    }

    // 사용자 저장 또는 업데이트
    public User saveUser(User user) {
        return userRepository.save(user);
    }

}
