package com.mainproject.server.search.controller;


import com.mainproject.server.search.dto.SearchDto;
import com.mainproject.server.search.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/feed")
public class SearchController {

    private final SearchService searchService;

    @Autowired
    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    @GetMapping("/search")
    public ResponseEntity<SearchDto> searchUsersAndFeeds(@RequestParam String keyword) {
        SearchDto searchResult = searchService.searchByKeyword(keyword);
        return ResponseEntity.ok(searchResult);
    }
}
