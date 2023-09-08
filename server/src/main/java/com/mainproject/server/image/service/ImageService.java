package com.mainproject.server.image.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.mainproject.server.image.entity.Image;
import com.mainproject.server.image.repository.ImageRepository;
import com.mainproject.server.user.entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.EntityNotFoundException;
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

        if (updateImage == null) {
            throw new EntityNotFoundException("ID " + imageId + "에 해당하는 이미지를 찾을 수 없습니다.");
        }

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
        return optionalImage.orElseThrow(() -> new EntityNotFoundException("Image not found with ID : " + imageId));
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

    // 이미지 URL로 이미지 조회
    public Image findImageByImageUrl(String imageUrl) {
        // 이미지 URL을 사용하여 이미지를 데이터베이스에서 조회
        Image image = imageRepository.findByImageUrl(imageUrl);
        if (image == null) {
            // 이미지가 존재하지 않을 경우 예외
            throw new EntityNotFoundException("Image not found with URL: " + imageUrl);
        }
        return image;
    }



}


// 이미지 엔티티를 생성하고 저장하는 로직 추가
//    public Image saveImage(String imageUrl) {
//        Image image = new Image();
//        List<String> imageUrls = new ArrayList<>();
//        imageUrls.add(imageUrl);
//        image.setImageUrls(imageUrls);
//        return imageRepository.save(image);
//    }
//}


//    public List<Image> createImages(List<MultipartFile> imageFiles) {
//        List<Image> savedImages = new ArrayList<>();
//
//        for (MultipartFile imageFile : imageFiles) {
//            String imageUrl = s3UploadService.upload(imageFile); // 이미지 업로드
//
//            // Image 엔티티 생성
//            Image image = new Image();
//            image.getImageUrls().add(imageUrl); // 업로드된 URL을 리스트에 추가
//
//            Image savedImage = imageRepository.save(image);
//            savedImages.add(savedImage);
//        }
//
//        return savedImages; // 저장된 이미지 엔티티 리스트 반환
//    }

//    // 모든 이미지 조회(ID, URL)
//    public List<ImageResponseDto> findImages() {
//        List<ImageResponseDto> imageList = new ArrayList<>();
//        List<Image> images = imageRepository.findAll();
//
//        for (Image image : images) {
//            List<String> findImagUrls = image.getImageUrls();
//            ImageResponseDto imageResponse = new ImageResponseDto(image.getImageId(), findImagUrls);
//            imageList.add(imageResponse);
//        }
//
//        return imageList;
//    }

//    // 모든 이미지 URL 조회
//    public List<String> findImages(){
//        List<String> imageUrls = new ArrayList<>();
//
//        List<Image> images = imageRepository.findAll();
//
//        for(Image image : images) {
//            List<String> findImageUrls = image.getImageUrls();
//            imageUrls.addAll(findImageUrls);
//        }
//
//        return imageUrls;
//    }

//        // 이미지를 피드에서 제거
//        Feed connectedFeed = deletedImage.getFeed();
//        if (connectedFeed != null) {
//            connectedFeed.getImages().remove(deletedImage);
//        }