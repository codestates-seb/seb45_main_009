package com.mainproject.server.user.service;


import com.mainproject.server.exception.BusinessLogicException;
import com.mainproject.server.exception.ExceptionCode;
import com.mainproject.server.user.dto.UserDto;
import com.mainproject.server.user.entity.User;
import com.mainproject.server.user.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository){
        this.userRepository = userRepository;
    }


    //유저 생성
    public User createUser(User user) {
        verifyExistEmail(user.getEmail());
        verifyExistNickname(user.getNickname());

        // 비밀번호 유효성 검사 추가
        if (!isValidPassword(user.getPassword())) {
            throw new BusinessLogicException(ExceptionCode.INVALID_PASSWORD);
        }

        user.setCreatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }



    //유저 정보 변경
    public User updateUser(Long userId, UserDto.PatchDto patchDto) {
        User existingUser = findVerifiedUser(userId);

        if (patchDto.getNickname() != null) {
            existingUser.setNickname(patchDto.getNickname());
        }

        if (patchDto.getProfileimg() != null) {
            existingUser.setProfileimg(patchDto.getProfileimg());
        }

        if (patchDto.getSport() != null) {
            existingUser.setSport(patchDto.getSport());
        }

        if (patchDto.getBio() != null) {
            existingUser.setBio(patchDto.getBio());
        }

        if (patchDto.getPrice() != null) {
            existingUser.setPrice(patchDto.getPrice());
        }

        if (patchDto.getPassword() != null) {
            existingUser.setPassword(patchDto.getPassword());
        }

        if (patchDto.getLocation() != null) {
            existingUser.setLocation(patchDto.getLocation());
        }

        return userRepository.save(existingUser);
    }


    //유저 조회
    public User findUser(long userId) {
        return findVerifiedUser(userId);
    }

    //유저 전체 조회
    public Page<User> findUsers(int page, int size) {
        return userRepository.findAll(PageRequest.of(page, size,
                Sort.by("userId").descending()));
    }


    //유저 삭제
    public void deleteUser(Long userId) {
        User existingUser = findVerifiedUser(userId);
        userRepository.delete(existingUser);
    }


    public User findVerifiedUser(long userId) {
        Optional<User> optionalUser =  userRepository.findById(userId);
        User findUser = optionalUser.orElseThrow(() ->
                new BusinessLogicException(ExceptionCode.USER_NOT_FOUND));

        return findUser;
    }

    public User findVerifiedUser(String email) {
        Optional<User> optionalUser =  userRepository.findByEmail(email);
        User findUser = optionalUser.orElseThrow(() ->
                new BusinessLogicException(ExceptionCode.USER_NOT_FOUND));

        return findUser;
    }



    private void verifyExistEmail(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent())
            throw new BusinessLogicException(ExceptionCode.USER_EXISTS);
    }

    private void verifyExistNickname(String nickname) {
        Optional<User> user = userRepository.findByNickname(nickname);
        if (user.isPresent())
            throw new BusinessLogicException(ExceptionCode.NICKNAME_EXISTS);
    }




    private boolean isValidPassword(String password) {
        // 비밀번호는 최소 6자 이상, 영문 대소문자 및 숫자를 포함해야 유효하다고 가정하는 로직
        return password != null && password.length() >= 6 &&
                password.matches(".*[a-zA-Z].*") &&
                password.matches(".*\\d.*");
    }


}
