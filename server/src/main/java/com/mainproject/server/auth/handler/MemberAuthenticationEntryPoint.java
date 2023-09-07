package com.mainproject.server.auth.handler;

import com.mainproject.server.auth.utils.ErrorResponder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;


@Slf4j
@Component
public class MemberAuthenticationEntryPoint implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws ServletException, IOException {
        Exception exception = (Exception) request.getAttribute("exception");

        // 예외 메시지와 함께 더 많은 정보를 반환하거나 로그에 기록합니다.
        logExceptionMessage(authException, exception);

        // 예외 메시지를 클라이언트에게 반환합니다.
        ErrorResponder.sendErrorResponse(response, HttpStatus.UNAUTHORIZED, "Unauthorized: " + authException.getMessage());
    }

    private void logExceptionMessage(AuthenticationException authException, Exception exception) {
        String message = exception != null ? exception.getMessage() : authException.getMessage();
        log.warn("Unauthorized error happened: {}", message);
    }
}