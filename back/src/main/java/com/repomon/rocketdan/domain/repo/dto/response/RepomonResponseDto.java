package com.repomon.rocketdan.domain.repo.dto.response;


import com.repomon.rocketdan.common.utils.S3Utils;
import com.repomon.rocketdan.domain.repo.entity.RepomonEntity;
import lombok.*;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString
@Builder
public class RepomonResponseDto {

	private Long repomonId;
	private String repomonUrl;
	private String repomonName;
	private String repomonSkillUrl;
	private String repomonSkillName;
	private Integer repomonTier;


	public static RepomonResponseDto fromEntity(RepomonEntity repomon) {
		return RepomonResponseDto.builder()
			.repomonId(repomon.getRepomonId())
			.repomonName(repomon.getRepomonName())
			.repomonUrl(S3Utils.modelUrl(repomon.getRepomonUrl()))
			.repomonTier(repomon.getRepomonTier())
			.repomonSkillUrl(S3Utils.skillUrl(repomon.getRepomonSkillUrl()))
			.repomonSkillName(repomon.getRepomonSkillName())
			.build();
	}

}
