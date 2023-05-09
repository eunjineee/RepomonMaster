package com.repomon.rocketdan.domain.repo.controller;


import com.repomon.rocketdan.common.dto.ResultDto;
import com.repomon.rocketdan.domain.repo.dto.request.RepoCardRequestDto;
import com.repomon.rocketdan.domain.repo.dto.request.RepoConventionRequestDto;
import com.repomon.rocketdan.domain.repo.dto.request.RepoPeriodRequestDto;
import com.repomon.rocketdan.domain.repo.dto.request.RepoRequestDto;
import com.repomon.rocketdan.domain.repo.dto.response.*;
import com.repomon.rocketdan.domain.repo.service.RepoService;
import com.repomon.rocketdan.exception.CustomException;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

import static com.repomon.rocketdan.exception.ErrorCode.DATA_CONVENTION_TOO_SHORT;
import static com.repomon.rocketdan.exception.ErrorCode.DUPLICATE_RESOURCE;


@RestController
@RequestMapping("/repo")
@RequiredArgsConstructor
public class RepoController {

	private final RepoService repoService;


	@ApiOperation(value = "전체 레포 리스트 조회")
	@GetMapping("/{userId}")
	public ResponseEntity<RepoListResponseDto> getUserRepoList(@PathVariable Long userId, @PageableDefault(size = 6, direction = Direction.DESC) Pageable pageable) {
		RepoListResponseDto responseDto = repoService.getUserRepoList(userId, pageable);
		return ResponseEntity.ok(responseDto);
	}


	@ApiOperation(value = "개별 레포 디테일 조회")
	@GetMapping({"/{repoId}/info/{userId}", "/{repoId}/info"})
	public ResponseEntity<RepoResponseDto> getRepoInfo(@PathVariable Long repoId, @PathVariable(required = false) Long userId) {
		RepoResponseDto responseDto = repoService.getUserRepoInfo(repoId, userId);
		return ResponseEntity.ok(responseDto);
	}


	/**
	 * TODO 카테고리별로 총 API 4개 추가해야함
	 *
	 * @param repoId
	 * @return
	 */
	@ApiOperation(value = "개별 레포 분석 조회")
	@GetMapping("/{repoId}/info/research")
	public ResponseEntity<RepoResearchResponseDto> getRepoResearchInfo(@PathVariable Long repoId) {
		RepoResearchResponseDto responseDto = repoService.getRepoResearchInfo(repoId);
		return ResponseEntity.ok(responseDto);
	}


	@ApiOperation(value = "개별 레포 랭킹정보 조회")
	@GetMapping("/{repoId}/info/battle")
	public ResponseEntity<RepoBattleResponseDto> getRepoBattleInfo(@PathVariable Long repoId) {
		RepoBattleResponseDto responseDto = repoService.getRepoBattleInfo(repoId);
		return ResponseEntity.ok(responseDto);
	}


	@ApiOperation(value = "개별 레포 컨벤션 정보 조회")
	@GetMapping("/{repoId}/info/convention")
	public ResponseEntity<RepoConventionResponseDto> getRepoConventionInfo(@PathVariable Long repoId) {
		RepoConventionResponseDto responseDto = repoService.getRepoConventionInfo(repoId);
		return ResponseEntity.ok(responseDto);
	}


	@ApiOperation(value = "개별 레포 기여도 조회")
	@GetMapping("/{repoId}/info/contribute")
	public ResponseEntity<RepoContributeResponseDto> getRepoContributeInfo(@PathVariable Long repoId) {
		RepoContributeResponseDto responseDto = repoService.getRepoContributeInfo(repoId);
		return ResponseEntity.ok(responseDto);
	}



	@ApiOperation(value = "모든 레포지토리 갱신")
	@PutMapping ("/{userId}/reload")
	public ResponseEntity<ResultDto> modifyAllRepo(@PathVariable Long userId) {
		repoService.modifyAllRepo(userId);
		return ResponseEntity.ok(ResultDto.ofSuccess());
	}

	@ApiOperation(value = "개별 레포 정보 갱신")
	@PutMapping("/{repoId}/info")
	public ResponseEntity<ResultDto> modifyRepoInfo(@PathVariable Long repoId) {
		repoService.modifyRepoInfo(repoId);
		return ResponseEntity.ok(ResultDto.ofSuccess());
	}


	@ApiOperation(value = "레포지토리 기간 설정")
	@PutMapping("/{repoId}/info/period")
	public ResponseEntity modifyRepoPeriod(@PathVariable Long repoId, @RequestBody RepoPeriodRequestDto requestDto) {
		repoService.modifyRepoPeriod(repoId, requestDto);
		return ResponseEntity.ok().build();
	}


	@ApiOperation(value = "레포지토리 컨벤션 설정")
	@PutMapping("/{repoId}/info/convention")
	public ResponseEntity<ResultDto> modifyRepoConvention(@PathVariable Long repoId, @ModelAttribute RepoConventionRequestDto requestDto, BindingResult bindingResult) {
		if (bindingResult.hasErrors()) {
			throw new CustomException(DATA_CONVENTION_TOO_SHORT);
		}

		repoService.modifyRepoConvention(repoId, requestDto);
		return ResponseEntity.ok(ResultDto.ofSuccess());
	}


	@ApiOperation(value = "레포지토리 활성화 설정")
	@PutMapping("/{repoId}/info/active")
	public ResponseEntity<ResultDto> modifyRepoActive(@PathVariable Long repoId) {
		repoService.activateRepo(repoId);
		return ResponseEntity.ok(ResultDto.ofSuccess());
	}


	@ApiOperation(value = "대표레포카드 조회 및 발급")
	@GetMapping("/{repoId}/card")
	public ResponseEntity<RepoCardResponseDto> getRepoCard(Long repoId) {
		return ResponseEntity.ok().build();
	}

	@ApiOperation(value = "레포카드 정보")
	@GetMapping("/{repoId}/card/detail")
	public ResponseEntity<RepoCardResponseDto> getRepoCardDetail(@PathVariable Long repoId) {
		RepoCardResponseDto responseDto = repoService.RepoCardDetail(repoId);
		return ResponseEntity.ok(responseDto);
	}


	@ApiOperation(value = "래포개인카드 정보")
	@GetMapping("/{repoId}/card/personal")
	public ResponseEntity<RepoPersonalCardResponseDto> getPersonalRepoCard(@PathVariable Long repoId, @PathVariable Long userId) throws IOException, InterruptedException {
		RepoPersonalCardResponseDto responseDto = repoService.RepoPersonalCardDetail(repoId, userId);
		return ResponseEntity.ok(responseDto);
	}


	@ApiOperation(value = "레포개인카드 언어설정")
	@PutMapping("/{repoId}/card/personal")
	public ResponseEntity<ResultDto> modifyPersonalRepoCard(@PathVariable Long repoId, @RequestBody RepoCardRequestDto requestDto) {
		repoService.modifyPersonalRepo(repoId,requestDto);
		return ResponseEntity.ok(ResultDto.ofSuccess());
	}


	@ApiOperation(value = "닉네임 중복 확인")
	@PostMapping("/nickname")
 	public ResponseEntity<ResultDto<Boolean>> checkRepomonNickname(@RequestBody RepoRequestDto repoRequestDto) {
		if (!repoService.checkRepomonNickname(repoRequestDto.getRepomonNickname())) {
			return ResponseEntity.ok().body(ResultDto.ofSuccess());
		}
		throw new CustomException(DUPLICATE_RESOURCE);
	}


	@ApiOperation(value = "레포몬 선택지 반환")
	@GetMapping("/repomon")
	public ResponseEntity<ResultDto<RepomonSelectResponseDto>> createSelectRepomon() {

		RepomonSelectResponseDto repomonSelectResponseDto = repoService.createSelectRepomon();

		return ResponseEntity.ok().body(ResultDto.of(repomonSelectResponseDto));
	}

}
