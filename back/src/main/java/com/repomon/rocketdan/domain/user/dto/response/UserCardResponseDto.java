package com.repomon.rocketdan.domain.user.dto.response;


import com.repomon.rocketdan.common.utils.GHUtils;
import com.repomon.rocketdan.domain.repo.app.UserCardDetail;
import com.repomon.rocketdan.domain.repo.entity.RepoEntity;
import com.repomon.rocketdan.domain.repo.repository.RepoRepository;
import com.repomon.rocketdan.domain.user.entity.UserEntity;
import com.repomon.rocketdan.exception.CustomException;
import com.repomon.rocketdan.exception.ErrorCode;
import lombok.*;
import org.kohsuke.github.GHUser;
import org.kohsuke.github.GitHub;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;


@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class UserCardResponseDto {

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


	public static UserCardResponseDto fromEntity(UserCardDetail userCardDetail, UserEntity user, RepoEntity representrepo, List<String> languages) throws IOException {


		return UserCardResponseDto.builder()
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
