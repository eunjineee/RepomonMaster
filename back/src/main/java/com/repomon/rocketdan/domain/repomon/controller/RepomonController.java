package com.repomon.rocketdan.domain.repomon.controller;


import com.repomon.rocketdan.common.dto.ResultDto;
import com.repomon.rocketdan.domain.repomon.dto.request.BattleLogRequestDto;
import com.repomon.rocketdan.domain.repomon.dto.request.RepomonNicknameRequestDto;
import com.repomon.rocketdan.domain.repomon.dto.request.RepomonStartStatusRequestDto;
import com.repomon.rocketdan.domain.repomon.dto.request.RepomonStatusRequestDto;
import com.repomon.rocketdan.domain.repomon.dto.response.BattleLogListResponseDto;
import com.repomon.rocketdan.domain.repomon.dto.response.BattleLogResponseDto;
import com.repomon.rocketdan.domain.repomon.dto.response.RepomonStatusResponseDto;
import com.repomon.rocketdan.domain.repomon.dto.response.RepomonUrlResponseDto;
import com.repomon.rocketdan.domain.repomon.service.RepomonService;
import com.repomon.rocketdan.exception.CustomException;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

import static com.repomon.rocketdan.exception.ErrorCode.DATA_BAD_REQUEST;


@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/repomon")
public class RepomonController {

	private final RepomonService repomonService;


	@PostMapping("/start")
	@ApiOperation(value = "레포몬의 초기 정보를 등록합니다.")
	public ResponseEntity<ResultDto<Boolean>> createRepomonStatus(
		@Valid @RequestBody RepomonStartStatusRequestDto repomonStartStatusRequestDto, BindingResult bindingResult) {
		if (bindingResult.hasErrors()) {
			throw new CustomException(DATA_BAD_REQUEST);
		}
		repomonService.createRepomonStatus(repomonStartStatusRequestDto);

		return ResponseEntity.ok().body(ResultDto.ofSuccess());
	}


	@GetMapping("/{repoId}")
	@ApiOperation(value = "레포몬의 정보를 조회합니다.")
	public ResponseEntity<ResultDto<RepomonStatusResponseDto>> getRepomonInfo(
		@PathVariable("repoId") Long repoId) {
		RepomonStatusResponseDto repomonStatusResponseDto = repomonService.getRepomonInfo(repoId);

		return ResponseEntity.ok().body(ResultDto.of(repomonStatusResponseDto));
	}


	@GetMapping("/{repoId}/match")
	@ApiOperation(value = "레포몬의 전투 상대를 매칭합니다.")
	public ResponseEntity<ResultDto<RepomonStatusResponseDto>> getBattleTarget(
		@PathVariable("repoId") Long repoId) {
		RepomonStatusResponseDto repomonStatusResponseDto = repomonService.getBattleTarget(repoId);
		return ResponseEntity.ok().body(ResultDto.of(repomonStatusResponseDto));
	}


	@PostMapping("/{repoId}/match")
	@ApiOperation(value = "레포몬의 전투 결과를 반환합니다.")
	public ResponseEntity<ResultDto<BattleLogResponseDto>> createBattleResult(
		@PathVariable("repoId") Long repoId,
		@RequestBody BattleLogRequestDto battleLogRequestDto) {
		BattleLogResponseDto battleLog = repomonService.createBattleResult(repoId,
			battleLogRequestDto);

		return ResponseEntity.ok().body(ResultDto.of(battleLog));
	}


	@GetMapping("/{repoId}/match/result")
	@ApiOperation(value = "상위 5개의 전투기록을 조회합니다.")
	public ResponseEntity<ResultDto<BattleLogListResponseDto>> getBattleLogList(
		@PathVariable("repoId") Long repoId) {
		BattleLogListResponseDto battleLog = repomonService.getBattleLogList(repoId);

		return ResponseEntity.ok().body(ResultDto.of(battleLog));
	}


	@PutMapping("/stat")
	@ApiOperation(value = "레포몬의 스텟을 변경합니다.")
	public ResponseEntity<ResultDto<Boolean>> modifyRepomonStatus(
		@Valid @RequestBody RepomonStatusRequestDto repomonStatusRequestDto, BindingResult bindingResult) {
		if (bindingResult.hasErrors()) {
			throw new CustomException(DATA_BAD_REQUEST);
		}

		repomonService.modifyRepomonStatus(repomonStatusRequestDto);

		return ResponseEntity.ok().body(ResultDto.ofSuccess());
	}


	@PutMapping("/nickname")
	@ApiOperation(value = "레포몬의 닉네임을 변경합니다.")
	public ResponseEntity<ResultDto<Boolean>> modifyRepomonNickname(
		@Valid @RequestBody RepomonNicknameRequestDto repomonNicknameRequestDto, BindingResult bindingResult) {

		if (bindingResult.hasErrors()) {
			throw new CustomException(DATA_BAD_REQUEST);
		}

		repomonService.modifyRepomonNickname(repomonNicknameRequestDto);

		return ResponseEntity.ok().body(ResultDto.ofSuccess());
	}


	@GetMapping("/")
	@ApiOperation(value = "랜덤 레포몬 url 조회")
	public ResponseEntity<RepomonUrlResponseDto> getRepomonUrls(){
		RepomonUrlResponseDto responseDto = repomonService.getRepomonUrls();
		return ResponseEntity.ok(responseDto);
	}
}
