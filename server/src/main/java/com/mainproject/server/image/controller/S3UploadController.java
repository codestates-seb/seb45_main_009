package com.mainproject.server.image.controller;


import com.mainproject.server.image.service.S3UploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RequiredArgsConstructor
@RestController
public class S3UploadController {

    private final S3UploadService s3UploadService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("images") MultipartFile imageFile) {
            String imageUrl = s3UploadService.upload(imageFile);
            return ResponseEntity.ok("Image uploaded successfully. Image URL: " + imageUrl);
    }
}