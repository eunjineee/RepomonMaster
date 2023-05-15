package com.repomon.rocketdan.domain.repo.dto.response;


import com.repomon.rocketdan.common.utils.S3Utils;
import com.repomon.rocketdan.domain.repo.entity.RepoEntity;
import com.repomon.rocketdan.domain.repo.entity.RepomonEntity;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import org.kohsuke.github.GHRepository;
import org.kohsuke.github.GHTag;


@AllArgsConstructor
@Getter
@ToString
@Builder
public class RepoResponseDto {

	private String repoName;
	private Long repomonId;
	private String repomonName;
	private String repomonUrl;
	private String repoDescription;
	private Long repoExp;
	private int starCnt;
	private int forkCnt;
	private LocalDateTime repoStart;
	private LocalDateTime repoEnd;
	private List<String> languages;
	private List<String> tags;
	private boolean myRepo;
	private boolean myPresentRepo;

	public static RepoResponseDto fromEntityAndGHRepository(RepoEntity repoEntity, GHRepository ghRepository, boolean myRepo, boolean myPresentRepo) {
		try {
			Map<String, Long> languageMap = ghRepository.listLanguages();
			List<GHTag> ghTags = ghRepository.listTags().toList();

			List<String> languages = new ArrayList<>();
			List<String> tags = new ArrayList<>();

			languages.addAll(languageMap.keySet());
			tags.addAll(ghTags.stream().map(GHTag::getName).collect(Collectors.toList()));

			RepomonEntity repomon = repoEntity.getRepomon();
			return RepoResponseDto.builder()
				.repoName(repoEntity.getRepoName())
				.repomonId(repomon.getRepomonId())
				.repomonName(repoEntity.getRepomonNickname())
				.repomonUrl(S3Utils.modelUrl(repomon.getRepomonUrl()))
				.repoDescription(ghRepository.getDescription())
				.repoExp(repoEntity.getRepoExp())
				.starCnt(ghRepository.getStargazersCount())
				.forkCnt(ghRepository.getForksCount())
				.repoStart(repoEntity.getRepoStart())
				.repoEnd(repoEntity.getRepoEnd())
				.languages(languages)
				.tags(tags)
				.myRepo(myRepo)
				.myPresentRepo(myPresentRepo)
				.build();
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}
}
