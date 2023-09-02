package com.mainproject.server.user.entity;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDate;
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


    @Column(nullable = false)
    private boolean usertype;

    @Column(nullable = false)
    private LocalDate birth;

    @Column(nullable= false)
    private ArrayList<String> sport = new ArrayList<>();


    @Column
    private String location;
    //위치를 업체 위치 태그에서 가져올 것인지 상의가 필요

    @Column
    private int height;

    @Column
    private int weight;

    @Column
    private String profileimg;
    //profile_photo  =>  profileimg 변경

    @Column
    private String bio;


    @Column
    private String price;

    @Column(nullable = false)
    private boolean gender;

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> roles = new ArrayList<>();






}
