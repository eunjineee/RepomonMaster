package com.repomon.rocketdan.domain.user.controller;


import com.repomon.rocketdan.common.dto.ResultDto;
import com.repomon.rocketdan.domain.repo.dto.request.RepoCardRequestDto;
import com.repomon.rocketdan.domain.user.dto.request.RepresentRepomonRequestDto;
import com.repomon.rocketdan.domain.user.dto.response.UserCardResponseDto;
import com.repomon.rocketdan.domain.user.dto.response.UserResponseDto;
import com.repomon.rocketdan.domain.user.service.UserService;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {

	private final UserService userService;


	@ApiOperation("유저 정보를 조회합니다")
	@GetMapping("/{userId}")
	public ResponseEntity<ResultDto<UserResponseDto>> getUserInfo(@PathVariable("userId") Long userId) {

		UserResponseDto userResponseDto = userService.getUserInfo(userId);
		return ResponseEntity.ok().body(ResultDto.of(userResponseDto));
	}


	@ApiOperation(value = "대표 레포몬을 설정합니다.")
	@PutMapping("/{userId}/represent")
	public ResponseEntity<ResultDto<Boolean>> modifyRepresentRepo(@PathVariable("userId") Long userId,

		RepresentRepomonRequestDto requestDto) {
		userService.modifyRepresentRepo(userId, requestDto);
		return ResponseEntity.ok().body(ResultDto.ofSuccess());
	}


	@ApiOperation(value = "유저 카드 정보")
	@GetMapping("/{userId}/card")
	public ResponseEntity<UserCardResponseDto> getUserCard(@PathVariable("userId") Long userId) {
		UserCardResponseDto responseDto = userService.getUserCard(userId);
		return ResponseEntity.ok(responseDto);
	}

	@ApiOperation(value = "유저카드 언어 조회")
	@GetMapping("/{userId}/card/language")
	public ResponseEntity<ResultDto<List<String>>> getUserLanguage(@PathVariable Long userId) throws IOException {
		List<String> responseDto = userService.getUserRepoLanguage(userId);
		return ResponseEntity.ok().body(ResultDto.of(responseDto));
	}

	@ApiOperation(value = "유저카드 현재 설정된 언어 조회")
	@GetMapping("/{userId}/card/language/now")
	public ResponseEntity<ResultDto<List<String>>> getUserLanguageNow(@PathVariable Long userId){
		List<String> responseDto = userService.getUserRepoLanguageNow(userId);
		return ResponseEntity.ok().body(ResultDto.of(responseDto));
	}

	@ApiOperation(value = "유저카드 언어설정")
	@PutMapping("/{userId}/card/language")
	public ResponseEntity<ResultDto> modifyPersonalRepoCard(@PathVariable Long userId, @RequestBody RepoCardRequestDto requestDto) {
		userService.modifyUserRepo(userId, requestDto);
		return ResponseEntity.ok(ResultDto.ofSuccess());
	}
}
