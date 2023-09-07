package com.mainproject.server.exception;

import lombok.Getter;

public enum ExceptionCode {
    USER_NOT_FOUND(404, "회원을 찾을 수 없습니다"),
    USER_EXISTS(409, "회원이 존재합니다"), //이메일이 존재합니다.,
    NICKNAME_EXISTS(409, "닉네임이 존재합니다"),
    NO_PERMISSION_EDITING_POST(403, "게시물을 편집할 권한이 없습니다."),
    NO_PERMISSION_EDITING_USER(403, "사용자 정보를 편집할 권한이 없습니다."),

    INVALID_INPUT(400, "잘못된 입력입니다."),
    INVALID_PASSWORD(400, "비밀번호가 유효하지 않습니다"), // 비밀번호 유효성 검사 실패 예외 코드 추가
    FEED_NOT_FOUND(404, "피드를 찾을 수 없습니다."),
    ACCESS_DENIED(401, "권한이 없습니다."),
    JWT_TOKEN_EXPIRED(404, "토큰이 만료되었습니다");

    @Getter
    private int status;

    @Getter
    private String message;

    ExceptionCode(int status, String message) {
        this.status = status;
        this.message = message;
    }
}

