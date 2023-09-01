package com.mainproject.server.exception;

import lombok.Getter;

public enum ExceptionCode {
    USER_NOT_FOUND(404, "회원을 찾을 수 없습니다"),
    USER_EXISTS(409, "회원이 존재합니다"),
    NICKNAME_EXISTS(409, "닉네임이 존재합니다"),
    INVALID_PASSWORD(400, "비밀번호가 유효하지 않습니다"); // 비밀번호 유효성 검사 실패 예외 코드 추가






    private int status;
    @Getter
    private String message;
    ExceptionCode(int code, String message) {
        this.status = code;
        this.message = message;
    }
}
