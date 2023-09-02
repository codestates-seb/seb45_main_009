package com.mainproject.server.photo;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.mainproject.server.exception.BusinessLogicException;
import com.mainproject.server.exception.ExceptionCode;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@RequiredArgsConstructor // 클래스의 final 필드나 @NonNull 어노테이션이 붙은 필드에 대한 생성자를 자동으로 생성해줌
@Service
public class S3UploadService {

    @Value("${cloud.aws.s3.bucket}") // application.yml에 설정된 값을 주입받음
    private String bucket; // S3 버킷 이름을 저장할 필드

    private final AmazonS3 amazonS3;

    // MultipartFile을 이용하여 이미지를 S3 버킷에 업로드하고, 업로드된 이미지의 URL을 반환하는 메서드
//    public String upload(MultipartFile multipartFile) throws IOException {
//
//        // 이미지 파일 이름을 랜덤한 UUID와 원본 파일 이름을 조합하여 생성
//        String s3FileName = UUID.randomUUID() + "-" + multipartFile.getOriginalFilename();
//
//        // 업로드할 이미지의 메타데이터를 생성
//        ObjectMetadata objMeta = new ObjectMetadata();
//        objMeta.setContentLength(multipartFile.getInputStream().available()); // 파일 사이즈를 ContentLength로 알려줌
//
//        // puObject(S3 API 메소드)를 이용해 파일 steam을 열어서 s3에 파일 업로드
//        // getInputStream() 메서드는 해당 multipartFile에서 파일 데이터를 읽어오기 위한 InputStream을 반환
//        amazonS3.putObject(bucket, s3FileName, multipartFile.getInputStream(), objMeta);
//
//        // 업로드된 이미지의 URL을 생성하여 반환
//        return amazonS3.getUrl(bucket, s3FileName).toString();
//    }

    // MultipartFile을 이용하여 이미지를 S3 버킷에 업로드하고, 업로드된 이미지의 URL을 반환하는 메서드
    public String upload(MultipartFile multipartFile) {
        try {

            if (multipartFile == null || multipartFile.isEmpty()) {
                // 이미지 파일이 없는 경우 처리
                throw new BusinessLogicException(ExceptionCode.PHOTO_NOT_FOUND);
            }

            // 이미지 파일 이름을 랜덤한 UUID와 원본 파일 이름을 조합하여 생성
            String s3FileName = UUID.randomUUID() + "-" + multipartFile.getOriginalFilename();

            // 업로드할 이미지의 메타데이터를 생성
            ObjectMetadata objMeta = new ObjectMetadata();
            objMeta.setContentLength(multipartFile.getInputStream().available()); // 파일 사이즈를 ContentLength로 알려줌

            // puObject(S3 API 메소드)를 이용해 파일 steam을 열어서 s3에 파일 업로드
            // getInputStream() 메서드는 해당 multipartFile에서 파일 데이터를 읽어오기 위한 InputStream을 반환
            amazonS3.putObject(bucket, s3FileName, multipartFile.getInputStream(), objMeta);

            // 업로드된 이미지의 URL을 생성하여 반환
            return amazonS3.getUrl(bucket, s3FileName).toString();
        } catch (IOException e) {
            // 예외가 발생한 경우에 대한 처리
            e.printStackTrace(); // 예외를 출력하거나 로깅할 수 있음
            // 이미지 파일 업로드 중 발생하는 에러 처리
            throw new BusinessLogicException(ExceptionCode.PHOTO_UPLOAD_ERROR);
        }
    }

}
