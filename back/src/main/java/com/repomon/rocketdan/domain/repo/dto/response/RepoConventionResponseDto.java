package com.repomon.rocketdan.domain.repo.dto.response;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.repomon.rocketdan.domain.repo.entity.RepoConventionEntity;
import com.repomon.rocketdan.domain.repo.entity.RepoEntity;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import javax.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

import javax.persistence.Id;
import java.util.List;
import java.util.stream.Collectors;


@Getter @Builder
@RedisHash(value = "repo-convention", timeToLive = 86400)
@NoArgsConstructor
@AllArgsConstructor
public class RepoConventionResponseDto {

	@Id
	@JsonIgnore
	private Long id;
	@Indexed
	@Column(unique = true)
	private Long repoId;
	private String repoOwner;
	private List<ConventionInfo> conventions = new ArrayList<>();
	private Map<String, Integer> conventionInfo = new HashMap<>();
	private int totalCnt;
	private int collectCnt;


	public static RepoConventionResponseDto fromEntities(RepoEntity repoEntity, List<RepoConventionEntity> conventions, Map<String, Integer> conventionInfo,
		int totalCnt, int collectCnt) {

		List<ConventionInfo> collect = conventions.isEmpty() ? new ArrayList<>()
			:conventions.stream()
				.map(ConventionInfo::of)
				.collect(Collectors.toList());

		return RepoConventionResponseDto.builder()
			.repoId(repoEntity.getRepoId())
			.repoOwner(repoEntity.getRepoOwner())
			.conventions(collect)
			.conventionInfo(conventionInfo)
			.totalCnt(totalCnt)
			.collectCnt(collectCnt)
			.build();
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




