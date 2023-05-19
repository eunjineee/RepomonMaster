package com.repomon.rocketdan.domain.user.dto.response;


import com.repomon.rocketdan.domain.repo.entity.RepoEntity;
import lombok.Builder;
import lombok.Data;


@Data
@Builder
public class RepomonRankResponseDto {
	private Long repoId;
	private Long userId;
	private String repoName;
	private Long repoExp;
	private String repoOwner;
	private String repomonNickname;
	private Integer rating;
	private Integer repomonTier;
	private Long repomonRank;
	private String repomonUrl;


	public static RepomonRankResponseDto fromEntity(RepoEntity repo, Long repomonRank, Long repoOwnerId) {
		return RepomonRankResponseDto.builder()
			.repoId(repo.getRepoId())
			.userId(repoOwnerId)
			.repoName(repo.getRepoName())
			.repoExp(repo.getRepoExp())
			.repoOwner(repo.getRepoOwner())
			.repomonNickname(repo.getRepomonNickname())
			.rating(repo.getRating())
			.repomonTier(repo.getRepomon().getRepomonTier())
			.repomonRank(repomonRank)
			.repomonUrl(repo.getRepomon().getRepomonUrl())
			.build();
	}
}
