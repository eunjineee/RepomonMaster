package com.repomon.rocketdan.domain.user.controller;


import com.repomon.rocketdan.domain.user.dto.response.RepoRankResponseDto;
import com.repomon.rocketdan.domain.user.dto.response.RepomonRankResponseDto;
import com.repomon.rocketdan.domain.user.dto.response.UserRankResponseDto;
import com.repomon.rocketdan.domain.user.service.RankService;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/rank")
@RequiredArgsConstructor
public class RankController {

    private final RankService rankService;


    @ApiOperation(value = "유저 랭킹 조회")
    @GetMapping("/user")
    public ResponseEntity<Page<UserRankResponseDto>> getUserRankList(@RequestParam(name = "search", required = false, defaultValue = "") String search,
        @PageableDefault(sort = "totalExp", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<UserRankResponseDto> userRankResponseDtoList = rankService.getUserRankList(search, pageable);
        return ResponseEntity.ok().body(userRankResponseDtoList);
    }


    @ApiOperation(value = "레포 랭킹 조회")
    @GetMapping("/repo")
    public ResponseEntity<Page<RepoRankResponseDto>> getRepoRankList(@RequestParam(name = "search", required = false, defaultValue = "") String search,
        @PageableDefault(sort = "repoExp", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<RepoRankResponseDto> repoRankDtoList = rankService.getRepoRankList(search, pageable);
        return ResponseEntity.ok().body(repoRankDtoList);
    }


    @ApiOperation(value = "전투 랭킹 조회")
    @GetMapping("/repomon")
    public ResponseEntity<Page<RepomonRankResponseDto>> getRepomonRankList(@RequestParam(name = "search", required = false, defaultValue = "") String search,
        @PageableDefault(sort = "rating", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<RepomonRankResponseDto> repomonRankDtoList = rankService.getRepomonRankList(search, pageable);
        return ResponseEntity.ok().body(repomonRankDtoList);
    }
}
