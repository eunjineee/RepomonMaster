package com.repomon.rocketdan.domain.repo.app;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.repomon.rocketdan.common.utils.S3Utils;
import com.repomon.rocketdan.domain.repo.entity.RepoEntity;
import com.repomon.rocketdan.domain.repo.entity.RepomonEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class RepoListItem {
	private Long repoId;
	private Long repomonId;
	private String repomonUrl;
	private String repoName;
	private String repomonName;
	private String repoDescription;
	private Long repoExp;
	private Integer repoRating;
	private Boolean isActive;
	private Boolean isPrivate;

	public static RepoListItem convertFromDetail(RepoDetail repoDetail){
		RepoEntity repo = repoDetail.getRepoEntity();
		RepomonEntity repomon = repo.getRepomon();

		return RepoListItem.builder()
			.repoId(repo.getRepoId())
			.repomonId(repomon.getRepomonId())
			.repomonUrl(S3Utils.modelUrl(repomon.getRepomonUrl()))
			.repoName(repo.getRepoName())
			.repomonName(repo.getRepomonNickname())
			.repoDescription(repoDetail.getDescription())
			.repoExp(repo.getRepoExp())
			.repoRating(repo.getRating())
			.isActive(repoDetail.getIsActive())
			.isPrivate(repoDetail.getIsPrivate())
			.build();
	}
}
