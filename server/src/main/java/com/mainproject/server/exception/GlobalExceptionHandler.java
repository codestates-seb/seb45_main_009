package com.mainproject.server.exception;

import com.mainproject.server.response.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessLogicException.class)
    public ResponseEntity<ErrorResponse> handleBusinessLogicException(BusinessLogicException ex) {
        ExceptionCode exceptionCode = ex.getExceptionCode();
        HttpStatus status = HttpStatus.valueOf(exceptionCode.getStatus());
        ErrorResponse errorResponse = new ErrorResponse(status.value(), exceptionCode.getMessage());
        return new ResponseEntity<>(errorResponse, status);
    }
}