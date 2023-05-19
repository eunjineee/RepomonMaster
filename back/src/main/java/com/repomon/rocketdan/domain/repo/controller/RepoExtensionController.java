package com.repomon.rocketdan.domain.repo.controller;

import com.repomon.rocketdan.domain.repo.dto.response.ExtensionRepoListResponseDto;
import com.repomon.rocketdan.domain.repo.service.RepoExtensionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/repo/ext")
@RestController
@RequiredArgsConstructor
public class RepoExtensionController {

    private final RepoExtensionService repoExtensionService;
    @GetMapping("/{userId}")
    public ResponseEntity<ExtensionRepoListResponseDto> getRepoListForExtension(@PathVariable Long userId){
        ExtensionRepoListResponseDto responseDto = repoExtensionService.getRepoList(userId);
        return ResponseEntity.ok(responseDto);
    }
}
