package com.repomon.rocketdan.domain.repomon.dto.request;


import lombok.Data;

import javax.validation.constraints.Max;
import javax.validation.constraints.PositiveOrZero;


@Data
public class RepomonStartStatusRequestDto {

	private Long repoId;
	private Long repomonId;
	private String repomonNickname;

	@Max(value = 10)
	@PositiveOrZero
	private Integer startAtk;

	@Max(value = 10)
	@PositiveOrZero
	private Integer startDodge;

	@Max(value = 10)
	@PositiveOrZero
	private Integer startDef;

	@Max(value = 10)
	@PositiveOrZero
	private Integer startCritical;

	@Max(value = 10)
	@PositiveOrZero
	private Integer startHit;


	public static boolean isValid(RepomonStartStatusRequestDto requestDto) {
		int totalPoint = requestDto.getStartAtk() + requestDto.getStartCritical() + requestDto.getStartDef() +
			requestDto.getStartDodge() + requestDto.getStartHit();

		return (totalPoint > 30);
	}

}
