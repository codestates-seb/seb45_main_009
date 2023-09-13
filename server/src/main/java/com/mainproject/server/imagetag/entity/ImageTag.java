package com.mainproject.server.imagetag.entity;

import com.mainproject.server.feed.enitiy.Feed;
import com.mainproject.server.image.entity.Image;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@NoArgsConstructor
@Getter
@Setter
@Entity
public class ImageTag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long imageTagId;

    @Column
    private String productName;

    @Column
    private String productPrice;

    @Column
    private String productInfo;

    @Column
    private Double positionX;

    @Column
    private Double positionY;

    //image와 매핑(다대일)
    @ManyToOne
    @JoinColumn
    private Image image;
}

