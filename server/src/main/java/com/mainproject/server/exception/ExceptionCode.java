package com.mainproject.server.exception;

import lombok.Getter;

public enum ExceptionCode {
    USER_NOT_FOUND(404, "회원을 찾을 수 없습니다"),
    USER_EXISTS(409, "회원이 존재합니다"),
    NICKNAME_EXISTS(409, "닉네임이 존재합니다");






    private int status;
    @Getter
    private String message;
    ExceptionCode(int code, String message) {
        this.status = code;
        this.message = message;
    }
}
