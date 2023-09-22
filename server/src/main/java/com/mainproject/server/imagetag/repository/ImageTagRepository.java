package com.mainproject.server.imagetag.repository;

import com.mainproject.server.imagetag.entity.ImageTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImageTagRepository extends JpaRepository<ImageTag, Long> {
}
