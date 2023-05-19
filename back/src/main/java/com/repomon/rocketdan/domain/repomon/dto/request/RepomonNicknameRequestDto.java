package com.repomon.rocketdan.domain.repomon.dto.request;


import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;


@Data
public class RepomonNicknameRequestDto {

	private Long repoId;

	@NotBlank(message = "닉네임은 필수값입니다.")
	@Pattern(regexp = "^[가-힣a-zA-Z0-9]*$", message = "닉네임은 한글, 영문, 숫자만 입력할 수 있습니다.")
	@Size(min = 2, max = 10, message = "2자 이상 10자 이하의 문자열을 입력하세요.")
	private String repomonNickname;

}
