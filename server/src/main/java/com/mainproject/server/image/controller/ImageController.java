//package com.mainproject.server.image.controller;
//
//import com.mainproject.server.image.service.ImageService;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/images")
//public class ImageController {
//
//    private final ImageService imageService;
//
//    public ImageController(ImageService imageService) {
//        this.imageService = imageService;
//    }
//
//    @DeleteMapping("/{image-id}")
//    public ResponseEntity deleteImage(@PathVariable("image-id") long imageId) {
//
//        imageService.deleteImage(imageId);
//        return new ResponseEntity(HttpStatus.NO_CONTENT);
//    }
//}
//
//
////    private final ImageMapper imageMapper;
////
////    private final ImageRepository imageRepository;
////
////    public ImageController(ImageService imageService, ImageMapper imageMapper, ImageRepository imageRepository) {
////        this.imageService = imageService;
////        this.imageMapper = imageMapper;
////        this.imageRepository = imageRepository;
////    }
//
//
////    @PostMapping("/upload")
////    public ResponseEntity uploadImages(@RequestPart("imageUrls") List<MultipartFile> imageFiles) {
////
////        List<Image> createImages = imageService.createImages(imageFiles);
////
////        return new ResponseEntity<>(imageMapper.imageToImageResponseDtos(createImages), HttpStatus.CREATED);
////    }
//
////    @PatchMapping("/update/{image-id}")
////    public ResponseEntity updateImages(@PathVariable("image-id") long imageId,
////                                       @RequestPart("imageUrls") List<MultipartFile> imageFiles) {
////
////        Image image = imageService.findImage(imageId);
////
////        List<String> updatedImages = imageService.updateImages(image, imageFiles);
////
////        image.setImageUrls(updatedImages);
////        imageRepository.save(image);
////
////
////        return new ResponseEntity<>(imageMapper.imageToImageResponseDto(image), HttpStatus.OK);
////    }
//
////    @GetMapping("/{image-id}")
////    public ResponseEntity getImage(@PathVariable("image-id") long imageId) {
////
////        Image updateImage = imageService.findImage(imageId);
////
////        return new ResponseEntity<>(imageMapper.imageToImageResponseDto(updateImage), HttpStatus.OK);
////    }
//
////    @GetMapping("/")
////    public ResponseEntity getImages() {
////
////        List<ImageResponseDto> images = imageService.findImages();
////
////        return new ResponseEntity<>(images, HttpStatus.OK);
////    }