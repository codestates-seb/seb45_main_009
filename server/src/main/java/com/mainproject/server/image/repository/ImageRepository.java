package com.mainproject.server.image.repository;

import com.mainproject.server.image.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {

    // 이미지 URL로 이미지 조회
    Image findByImageUrl(String imageUrl);

}
