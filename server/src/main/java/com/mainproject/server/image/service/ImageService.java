package com.mainproject.server.image.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.mainproject.server.exception.BusinessLogicException;
import com.mainproject.server.exception.ExceptionCode;
import com.mainproject.server.image.entity.Image;
import com.mainproject.server.image.repository.ImageRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.util.Optional;

@Service
public class ImageService {

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    private final ImageRepository imageRepository;

    private final S3UploadService s3UploadService;

    private final AmazonS3 amazonS3;

    public ImageService(ImageRepository imageRepository, S3UploadService s3UploadService, AmazonS3 amazonS3) {
        this.imageRepository = imageRepository;
        this.s3UploadService = s3UploadService;
        this.amazonS3 = amazonS3;
    }

    public String createImage(MultipartFile imageFile) {
        // 이미지 업로드
        String imageUrl = s3UploadService.upload(imageFile);

        return imageUrl; // 이미지 URL 반환
    }

    public String updateImage(Long imageId, MultipartFile imageFile) {
        Image updateImage = findImage(imageId);

        String oldImageUrl = updateImage.getImageUrl();

        // 이전 이미지를 S3에서 삭제
        if (oldImageUrl != null) {
            URI uri = URI.create(oldImageUrl);  // imageUrl 문자열을 URI 객체로 변환
            String key = uri.getPath().substring(1);
            amazonS3.deleteObject(new DeleteObjectRequest(bucket, key));
        }

        // 새로운 이미지 업로드 및 URL 저장
        String newImageUrl = s3UploadService.upload(imageFile);

        // 이미지 URL 업데이트
        updateImage.setImageUrl(newImageUrl);
        imageRepository.save(updateImage);

        // 새로운 이미지 URL 반환
        return newImageUrl;
    }


    // 이미지ID로 이미지 조회
    public Image findImage(long imageId) {

        Optional<Image> optionalImage = imageRepository.findById(imageId);
        return optionalImage.orElseThrow(() -> new BusinessLogicException(ExceptionCode.IMAGE_TAG_NOT_FOUND));
    }

    public void deleteImage(long imageId) {
        // 삭제할 이미지 찾기
        Image deletedImage = findImage(imageId);


        // image url 목록 가져오기
        String deleteImageUrl = deletedImage.getImageUrl();

        // 이미지 URL에 해당하는 S3 객체 삭제
        if (deleteImageUrl != null) {
            URI uri = URI.create(deleteImageUrl);  // imageUrl 문자열을 URI 객체로 변환
            String key = uri.getPath().substring(1);
            amazonS3.deleteObject(new DeleteObjectRequest(bucket, key));
        }

        imageRepository.delete(deletedImage);
    }
}


