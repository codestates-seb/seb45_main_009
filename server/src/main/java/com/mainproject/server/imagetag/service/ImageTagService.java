package com.mainproject.server.imagetag.service;

import com.mainproject.server.exception.BusinessLogicException;
import com.mainproject.server.exception.ExceptionCode;
import com.mainproject.server.image.entity.Image;
import com.mainproject.server.image.repository.ImageRepository;
import com.mainproject.server.image.service.ImageService;
import com.mainproject.server.imagetag.entity.ImageTag;
import com.mainproject.server.imagetag.repository.ImageTagRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ImageTagService {

    private final ImageTagRepository imageTagRepository;
    private final ImageService imageService;
    private final ImageRepository imageRepository;

    public ImageTagService(ImageTagRepository imageTagRepository, ImageService imageService, ImageRepository imageRepository) {
        this.imageTagRepository = imageTagRepository;
        this.imageService = imageService;
        this.imageRepository = imageRepository;
    }

    public ImageTag createImageTag(long imageId, ImageTag imageTag) {
        // 이미지를 찾아오기
        Image image = imageService.findImage(imageId);

        // 이미지 태그와 이미지 연결
        imageTag.setImage(image);

        // 이미지 태그를 데이터베이스에 저장
        ImageTag savedImageTag = imageTagRepository.save(imageTag);

        // 이미지 객체에 이미지 태그 추가
        image.getImageTags().add(savedImageTag);

        // 이미지를 데이터베이스에 저장 (이미지 객체에 변경이 있을 수 있으므로 저장 필요)
        imageRepository.save(image);

        return savedImageTag;
    }

    public ImageTag updateImageTag(Long imageTagId, ImageTag updatedImageTag) {
        // 수정하려는 이미지 태그를 데이터베이스에서 가져오기
        ImageTag existingImageTag = imageTagRepository.findById(imageTagId)
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.IMAGE_TAG_NOT_FOUND));

        // 기존 이미지 태그의 필드를 수정
        existingImageTag.setProductName(updatedImageTag.getProductName());
        existingImageTag.setProductPrice(updatedImageTag.getProductPrice());
        existingImageTag.setProductInfo(updatedImageTag.getProductInfo());
        existingImageTag.setPositionX(updatedImageTag.getPositionX());
        existingImageTag.setPositionY(updatedImageTag.getPositionY());

        // 이미지 태그를 데이터베이스에 저장
        ImageTag updatedTag = imageTagRepository.save(existingImageTag);

        return updatedTag;
    }

    // 이미지태그ID로 이미지 조회
    public ImageTag findImageTag(long imageTagId) {
        Optional<ImageTag> optionalImage = imageTagRepository.findById(imageTagId);
        return optionalImage.orElseThrow(() -> new BusinessLogicException(ExceptionCode.IMAGE_TAG_NOT_FOUND));
    }

    public void deleteImageTag(long imageTagId) {
        // 삭제하려는 이미지 태그를 데이터베이스에서 가져오기
        ImageTag existingImageTag = imageTagRepository.findById(imageTagId)
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.IMAGE_TAG_NOT_FOUND));

        verifyAccess(existingImageTag.getImage().getImageId(), existingImageTag);

        imageTagRepository.deleteById(imageTagId);
    }

    public void verifyAccess(long imageId, ImageTag imageTag) {
        if(imageId != imageTag.getImage().getImageId()) {
            throw  new BusinessLogicException(ExceptionCode.IMAGE_TAG_NOT_FOUND);
        }
    }
}