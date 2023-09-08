package com.mainproject.server.user.entity;



import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.mainproject.server.image.entity.Image;
import lombok.*;


import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Getter
@Setter
@Entity
@Table
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String nickname;

    @Column(nullable = false, name = "CREATED_AT")
    private LocalDateTime createdAt = LocalDateTime.now();


    @Column(nullable = false, name = "MODIFIED_AT")
    private LocalDateTime modifiedAt = LocalDateTime.now();




    @Column
    private String sport;


    @Column
    private String location;
    //위치를 업체 위치 태그에서 가져올 것인지 상의가 필요

    @Column
    private int height;

    @Column
    private int weight;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    @JoinColumn(name = "imageId")
    @JsonManagedReference// 이미지와의 관계를 설정
    private Image profileimg;

    @Column
    private String bio;


    @Column
    private String price;




    @Column(nullable = false)
    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> roles = new ArrayList<>();





}