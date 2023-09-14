package com.mainproject.server.auth.utils;

import org.springframework.http.HttpStatus;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

public class ErrorResponder {
    public static void sendErrorResponse(HttpServletResponse response, HttpStatus status) throws IOException {
        sendErrorResponse(response, status, null);
    }

    public static void sendErrorResponse(HttpServletResponse response, HttpStatus status, String message) throws IOException {
        response.setStatus(status.value());
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        PrintWriter writer = response.getWriter();
        if (message != null) {
            writer.write("{\"error\": \"" + message + "\"}");
        } else {
            writer.write("{\"error\": \"" + status.getReasonPhrase() + "\"}");
        }
        writer.flush();
        writer.close();
    }
}