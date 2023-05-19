package com.repomon.rocketdan.domain.repo.dto.response;


import com.repomon.rocketdan.common.utils.S3Utils;
import com.repomon.rocketdan.domain.repo.entity.RepomonEntity;
import lombok.*;

import java.util.List;
import java.util.stream.Collectors;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString
@Builder
public class RepomonSelectResponseDto {

	private List<SelectRepomon> selectRepomonList;


	public static RepomonSelectResponseDto createSelectRepomon(List<RepomonEntity> repomonList) {
		List<SelectRepomon> selectRepomons = repomonList.stream()
			.map(SelectRepomon::fromEntity)
			.collect(Collectors.toList());

		return RepomonSelectResponseDto.builder()
			.selectRepomonList(selectRepomons)
			.build();
	}


	@Getter
	@Builder
	@AllArgsConstructor
	@NoArgsConstructor
	private static class SelectRepomon {

		private Long repomonId;
		private String repomonUrl;
		private String repomonName;


		public static SelectRepomon fromEntity(RepomonEntity repomon) {
			return SelectRepomon.builder()
				.repomonId(repomon.getRepomonId())
				.repomonName(repomon.getRepomonName())
				.repomonUrl(S3Utils.modelUrl(repomon.getRepomonUrl()))
				.build();
		}

	}

}
