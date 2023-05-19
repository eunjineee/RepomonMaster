package com.repomon.rocketdan.domain.repomon.dto.request;


import lombok.Data;

import javax.validation.constraints.PositiveOrZero;


@Data
public class RepomonStatusRequestDto {

	private Long repoId;

	@PositiveOrZero
	private Integer atkPoint = 0;
	@PositiveOrZero
	private Integer dodgePoint = 0;
	@PositiveOrZero
	private Integer defPoint = 0;
	@PositiveOrZero
	private Integer criticalPoint = 0;
	@PositiveOrZero
	private Integer hitPoint = 0;

}
