package com.repomon.rocketdan.domain.repo.app;


import lombok.*;

import java.util.List;


@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserCardDetail {

	private Long myrepomonId;
	private Long myrepoExp;
	private int myrepomonTier;
	private String myrepoName;

	private Long totalExp;

	private String userName;
	private String avatarUrl;
	private String introduce;
	private Integer repoCount;

	private Long totalCommitCount;
	private Long totalCodeLineCount;
	private List<String> languages;
	private Long avgContribution;
	private Long totalCommitExp;
	private Long totalMergeExp;
	private Long totalReviewExp;
	private Long totalIssueExp;
	private Long starExp;
	private Long forkExp;
}
