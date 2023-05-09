package com.repomon.rocketdan.domain.repo.dto.response;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.repomon.rocketdan.domain.repo.entity.RepoConventionEntity;
import com.repomon.rocketdan.domain.repo.entity.RepoEntity;
import java.util.ArrayList;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

import javax.persistence.Id;
import java.util.List;
import java.util.stream.Collectors;


@Getter
@RedisHash(value = "repo-convention", timeToLive = 86400)
@AllArgsConstructor
public class RepoConventionResponseDto {

	@Id
	@JsonIgnore
	private Long id;
	@Indexed
	private Long repoId;
	private String repoOwner;
	private List<ConventionInfo> conventions = new ArrayList<>();
	private int totalCnt;
	private int collectCnt;


	public static RepoConventionResponseDto fromEntities(RepoEntity repoEntity, List<RepoConventionEntity> conventions,
		int totalCnt, int collectCnt) {

		List<ConventionInfo> collect = conventions.stream().map(ConventionInfo::of)
			.collect(Collectors.toList());

		return new RepoConventionResponseDto(null, repoEntity.getRepoId(), repoEntity.getRepoOwner(), collect, totalCnt, collectCnt);
	}


	@Getter
	@AllArgsConstructor
	private static class ConventionInfo {

		private String prefix;
		private String description;


		private static ConventionInfo of(RepoConventionEntity conventionEntity) {
			return new ConventionInfo(conventionEntity.getRepoConventionType(), conventionEntity.getRepoConventionDes());
		}

	}

}




