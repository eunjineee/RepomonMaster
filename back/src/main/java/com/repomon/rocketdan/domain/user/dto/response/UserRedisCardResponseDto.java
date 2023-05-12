package com.repomon.rocketdan.domain.user.dto.response;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.repomon.rocketdan.domain.repo.app.UserCardDetail;
import com.repomon.rocketdan.domain.repo.entity.RepoEntity;
import com.repomon.rocketdan.domain.user.entity.UserEntity;
import lombok.*;

import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

import javax.persistence.Column;
import javax.persistence.Id;
import java.io.IOException;
import java.util.List;


@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
@RedisHash(value = "user-card")
public class UserRedisCardResponseDto {
	@Id
	@JsonIgnore
	private Long id;
	@Column(unique = true)
	@Indexed
	private Long userId;
	private final Long myrepomonId;
	private final Long myrepoExp;
	private final int myrepomonTier;
	private final String myrepoName;

	private final Long totalExp;

	private final String userName;
	private final String avatarUrl;
	private final String introduce;
	private final Integer repoCount;

	private final Long totalCommitCount;
	private final Long totalCodeLineCount;
	private final List<String> languages;
	private final Long avgContribution;

	private final Long totalCommitExp;
	private final Long totalMergeExp;
	private final Long totalReviewExp;
	private final Long totalIssueExp;
	private final Long starExp;
	private final Long forkExp;


	public static UserRedisCardResponseDto fromEntity(UserCardDetail userCardDetail, UserEntity user, RepoEntity representrepo, List<String> languages) throws IOException {


		return UserRedisCardResponseDto.builder()
			.userId(user.getUserId())
			.userName(userCardDetail.getUserName())
			.avatarUrl(userCardDetail.getAvatarUrl())
			.totalExp(user.getTotalExp())
			.introduce(userCardDetail.getIntroduce())
			.repoCount(userCardDetail.getRepoCount())
				.myrepoExp(representrepo.getRepoExp())
				.myrepomonId(representrepo.getRepomon().getRepomonId())
				.myrepoName(representrepo.getRepoName())
				.myrepomonTier(representrepo.getRepomon().getRepomonTier())
			.totalCommitCount(userCardDetail.getTotalCommitCount())
			.totalCodeLineCount(userCardDetail.getTotalCodeLineCount())
			.languages(languages)
			.avgContribution(userCardDetail.getAvgContribution())
			.totalCommitExp(userCardDetail.getTotalCommitExp())
			.totalMergeExp(userCardDetail.getTotalMergeExp())
			.totalReviewExp(userCardDetail.getTotalReviewExp())
			.totalIssueExp(userCardDetail.getTotalIssueExp())
			.starExp(userCardDetail.getStarExp())
			.forkExp(userCardDetail.getForkExp())
			.build();
	}

}
