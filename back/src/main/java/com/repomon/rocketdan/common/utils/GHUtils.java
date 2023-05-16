package com.repomon.rocketdan.common.utils;


import com.repomon.rocketdan.domain.repo.app.GrowthFactor;
import com.repomon.rocketdan.domain.repo.app.UserCardDetail;
import com.repomon.rocketdan.domain.repo.entity.RepoEntity;
import com.repomon.rocketdan.domain.repo.entity.RepoHistoryEntity;
import com.repomon.rocketdan.domain.repo.repository.RepoHistoryRepository;
import com.repomon.rocketdan.domain.repo.repository.RepoRepository;
import com.repomon.rocketdan.exception.CustomException;
import com.repomon.rocketdan.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.kohsuke.github.*;
import org.kohsuke.github.GHIssueQueryBuilder.Sort;
import org.kohsuke.github.GHRepositoryStatistics.CodeFrequency;
import org.kohsuke.github.GHRepositoryStatistics.ContributorStats;
import org.kohsuke.github.GHRepositoryStatistics.ContributorStats.Week;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.time.LocalDate;
import java.util.*;


@Component @Slf4j
@RequiredArgsConstructor
public class GHUtils {

	@Value("${github.accessToken}")
	private List<String> accessTokens;
	public GitHub gitHub;
	private final Integer maxStarAndFork = 200;
	private final RepoRepository repoRepository;
	private final RepoHistoryRepository repoHistoryRepository;


	@PostConstruct
	private void init() {
		for(String accessToken : accessTokens){
			try {
				gitHub = new GitHubBuilder().withOAuthToken(accessToken).withRateLimitChecker(RateLimitChecker.NONE).build();
				GHRateLimit rateLimit = gitHub.getRateLimit();
				if(rateLimit.getCore().getRemaining() > 0) break;
			} catch (IOException e) {
				log.info("사용할 수 없는 토큰!! => {} ", accessToken);
			}
		}
	}

	public void changeUserToken() {
		for(String accessToken : accessTokens){
			try {
				gitHub = new GitHubBuilder().withOAuthToken(accessToken).withRateLimitChecker(RateLimitChecker.NONE).build();
				GHRateLimit rateLimit = gitHub.getRateLimit();
				if(rateLimit.getCore().getRemaining() > 0) break;
			} catch (IOException e) {
				log.info("사용할 수 없는 토큰!! => {} ", accessToken);
			}
		}
		log.info("교체 완료!");
	}


	public String getOrganizationFirstOwner(String orgName) {
		try {
			return gitHub.getOrganization(orgName).listMembersWithRole("Owner").toList().get(0).getLogin();
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}


	public Map<String, GHRepository> getRepositoriesWithName(String name) {
		try {
			GHUser user = gitHub.getUser(name);
			Map<String, GHRepository> repositories = getRepositoriesInPublicOrganization(user);
			repositories.putAll(getRepositories(user));
			return repositories;
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}


	private Map<String, GHRepository> getRepositories(GHUser user) throws IOException {
		String name = user.getLogin().toLowerCase();

		Map<String, GHRepository> repositories = new HashMap<>(user.getRepositories());
		Map<String, GHRepository> repositoriesWithNodeKey = new HashMap<>();

		repositories.forEach((s, ghRepository) -> {
			if (!s.equals(name) && !ghRepository.isFork() && !s.equals(name + ".github.io")) {
				repositoriesWithNodeKey.put(ghRepository.getNodeId(), ghRepository);
			}
		});

		return repositoriesWithNodeKey;
	}


	private Map<String, GHRepository> getRepositoriesInPublicOrganization(GHUser user)
		throws IOException {
		GHPersonSet<GHOrganization> organizations = user.getOrganizations();
		if (organizations != null) {
			Map<String, GHRepository> repositoriesWithNodeId = new HashMap<>();
			for (GHOrganization ghOrganization : organizations) {
				Map<String, GHRepository> repositories = ghOrganization.getRepositories();
				repositories.forEach((s, ghRepository) -> repositoriesWithNodeId.put(ghRepository.getNodeId(), ghRepository));
			}
			return repositoriesWithNodeId;
		}
		return new HashMap<>();
	}


	public Collection<RepoHistoryEntity> GHCommitToHistory(GHRepository ghRepository, RepoEntity repoEntity, Date date)
		throws IOException, InterruptedException {
		Map<LocalDate, RepoHistoryEntity> histories = new HashMap<>();

		PagedIterable<GHCommit> ghCommits = date == null
			? ghRepository.queryCommits().list()
			: ghRepository.queryCommits()
				.since(date)
				.list();

		PagedIterator<GHCommit> iterator = ghCommits._iterator(100);

		while (iterator.hasNext()) {
			List<GHCommit> commitList = iterator.nextPage();
			for (GHCommit commit : commitList) {
				if (commit.getParentSHA1s().size() > 1) continue;
				LocalDate commitAt = DateUtils.dateToLocalDate(commit.getCommitDate());
				configureRepoInfo(histories, commitAt, repoEntity, GrowthFactor.COMMIT, 1);
			}
		}
		return histories.values();
	}


	public Collection<RepoHistoryEntity> GHPullRequestAndReviewAndIssueToHistory(GHRepository ghRepository, RepoEntity repoEntity, Date date)
		throws IOException {
		Map<LocalDate, RepoHistoryEntity> histories = new HashMap<>();

		PagedIterable<GHIssue> issues = date == null
			? ghRepository.queryIssues()
			.direction((GHDirection.DESC))
			.state(GHIssueState.CLOSED)
			.list()
			: ghRepository.queryIssues()
				.direction(GHDirection.DESC)
				.state(GHIssueState.CLOSED)
				.since(date)
				.list();

		for (GHIssue issue : issues) {
			Date closedAt = issue.getClosedAt();
			if (date == null || closedAt.after(date)) {
				if (issue.isPullRequest()) {
					GHPullRequest pullRequest = ghRepository.getPullRequest(issue.getNumber());
					LocalDate prDate = DateUtils.dateToLocalDate(pullRequest.getClosedAt());

					configureRepoInfo(histories, prDate, repoEntity, GrowthFactor.MERGE, 1);
					PagedIterable<GHPullRequestReviewComment> reviewComments = pullRequest.listReviewComments();

					for (GHPullRequestReviewComment reviewComment : reviewComments) {
						Date reviewCreatedAt = reviewComment.getCreatedAt();
						if (date == null || reviewCreatedAt.after(date)) {
							LocalDate reviewDate = DateUtils.dateToLocalDate(reviewComment.getCreatedAt());

							configureRepoInfo(histories, reviewDate, repoEntity, GrowthFactor.REVIEW, 1);
						}
					}
				} else {
					LocalDate issueClosedAt = DateUtils.dateToLocalDate(issue.getClosedAt());

					configureRepoInfo(histories, issueClosedAt, repoEntity, GrowthFactor.ISSUE, 1);
				}
			} else {
				return histories.values();
			}
		}

		return histories.values();
	}


	public Collection<RepoHistoryEntity> GHForkToHistory(GHRepository ghRepository, RepoEntity repoEntity, LocalDate fromDate)
		throws IOException {
		Map<LocalDate, RepoHistoryEntity> histories = new HashMap<>();

		Integer forkCnt = repoEntity.getForkCnt();
		int forksCount = ghRepository.getForksCount();

		if (forkCnt >= forksCount) return histories.values();
		forksCount -= forkCnt;

		if (forkCnt + forksCount >= maxStarAndFork && forkCnt >= maxStarAndFork) {
			configureRepoInfo(histories, fromDate, repoEntity, GrowthFactor.FORK, 0);
		} else {
			int tmp = forksCount;
			if (tmp >= maxStarAndFork) tmp = maxStarAndFork;
			configureRepoInfo(histories, fromDate, repoEntity, GrowthFactor.FORK, tmp);
		}

		repoEntity.updateForkCnt(forksCount);

		return histories.values();
	}


	public Collection<RepoHistoryEntity> GHStarToHistory(GHRepository ghRepository, RepoEntity repoEntity, LocalDate fromDate)
		throws IOException {
		Map<LocalDate, RepoHistoryEntity> histories = new HashMap<>();

		Integer starCnt = repoEntity.getStarCnt();
		int stargazersCount = ghRepository.getStargazersCount();

		if (starCnt >= stargazersCount) return histories.values();
		stargazersCount -= starCnt;

		if (starCnt + stargazersCount >= maxStarAndFork && starCnt >= maxStarAndFork) {
			configureRepoInfo(histories, fromDate, repoEntity, GrowthFactor.STAR, 0);
		} else {
			int tmp = stargazersCount;
			if (tmp >= maxStarAndFork) tmp = maxStarAndFork;
			configureRepoInfo(histories, fromDate, repoEntity, GrowthFactor.STAR, tmp);
		}

		repoEntity.updateStarCnt(stargazersCount);
		return histories.values();
	}


	private void configureRepoInfo(Map<LocalDate, RepoHistoryEntity> histories, LocalDate date, RepoEntity repoEntity, GrowthFactor factor, int cnt) {
		if (histories.containsKey(date)) {
			RepoHistoryEntity repoHistoryEntity = histories.get(date);
			repoHistoryEntity.updateExp(factor.getExp());
		} else {
			histories.put(date, RepoHistoryEntity.ofGHInfo(date, repoEntity, factor, cnt));
		}
	}


	public Map<String, String> getUser(String userName) {
		try {
			GHUser githubUser = gitHub.getUser(userName);
			Map<String, String> userInfo = new HashMap<>();
			userInfo.put("username", githubUser.getLogin());
			userInfo.put("avatarUrl", githubUser.getAvatarUrl());
			userInfo.put("nickname", githubUser.getName() == null ? githubUser.getLogin() : githubUser.getName());
			userInfo.put("description", githubUser.getBio());
			return userInfo;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}


	public Long getTotalLineCount(GHRepositoryStatistics statistics) throws IOException, InterruptedException {
		long totalLineCount = 0L;
		List<CodeFrequency> codeFrequencies = statistics.getCodeFrequency();
		for (CodeFrequency codeFrequency : codeFrequencies) {
			totalLineCount += codeFrequency.getAdditions();
			totalLineCount += codeFrequency.getDeletions();
		}

		return totalLineCount;
	}


	public int getTotalCommitCount(GHRepositoryStatistics statistics)
		throws IOException, InterruptedException {
		List<ContributorStats> contributorStats = statistics.getContributorStats()
			.toList();

		int totalCommitCount = 0;
		for (ContributorStats contributorStat : contributorStats) {
			totalCommitCount += contributorStat.getTotal();
		}

		return totalCommitCount;
	}


	public Map<String, Integer> getCommitterInfoMap(GHRepositoryStatistics statistics) throws IOException, InterruptedException {
		Map<String, Integer> commitCountMap = new HashMap<>();
		List<ContributorStats> contributorStatList = statistics
			.getContributorStats().toList();

		for (ContributorStats contributorStats : contributorStatList) {
			String author = contributorStats.getAuthor().getLogin();
			int authorCommitCnt = contributorStats.getTotal();
			commitCountMap.put(author, authorCommitCnt);

		}

		return commitCountMap;
	}


	/**
	 * 유저 이름의 총 라인 수
	 *
	 * @param statistics
	 * @param userName
	 * @return
	 * @throws IOException
	 * @throws InterruptedException
	 */
	public Long getLineCountWithUser(GHRepositoryStatistics statistics, String userName) throws IOException, InterruptedException {
		long lineCount = 0L;
		List<ContributorStats> contributorStatList = statistics
			.getContributorStats().toList();

		for (ContributorStats contributorStats : contributorStatList) {
			String author = contributorStats.getAuthor().getLogin();
			if (author.equals(userName)) {
				for (Week week : contributorStats.getWeeks()) {
					lineCount += week.getNumberOfAdditions();
					lineCount += week.getNumberOfDeletions();
				}
			}
		}
		return lineCount;
	}


	/**
	 * 유저 이름의 총 커밋 수
	 *
	 * @param statistics
	 * @param userName
	 * @return
	 * @throws IOException
	 * @throws InterruptedException
	 */
	public Long getCommitCountWithUser(GHRepositoryStatistics statistics, String userName)
		throws IOException, InterruptedException {
		Long commitCount = 0L;
		List<ContributorStats> contributorStatList = statistics.getContributorStats()
			.toList();

		for (ContributorStats contributorStats : contributorStatList) {
			String author = contributorStats.getAuthor().getLogin();
			if (author.equals(userName)) {
				commitCount = Long.valueOf(contributorStats.getTotal());
				break;
			}
		}

		return commitCount;
	}


	/**
	 * 유저 이름의 총 이슈 수
	 */
	public Integer getMyIssueToHistory(GHRepository ghRepository, Date date, String username) throws IOException {

		int issueCount = 0;
		List<GHIssue> allIssues = ghRepository.queryIssues()
			.creator(username)
			.sort(Sort.CREATED)
			.list()
			.toList();

		if (date == null) return allIssues.size();
		for (GHIssue issue : allIssues) {
			Date createdAt = issue.getCreatedAt();
			if (createdAt.before(date)) {
				issueCount++;
				continue;
			}
			break;
		}
		return issueCount;
	}


	/**
	 * 유저 이름의 총 머지, 리뷰 수
	 */
	public List<Integer> getMyMergeToHistory(GHRepository ghRepository, Date date, String username) throws IOException {
		int myMerge = 0;
		int myReview = 0;

		PagedIterable<GHIssue> ghIssues = ghRepository.queryIssues()
			.creator(username)
			.direction(GHDirection.ASC)
			.state(GHIssueState.CLOSED)
			.list();

		PagedIterator<GHIssue> iterator = ghIssues._iterator(100);

		while (iterator.hasNext()) {
			List<GHIssue> issues = iterator.nextPage();
			for (GHIssue ghIssue : issues) {
				if (!ghIssue.isPullRequest()) continue;
				if (date == null || date.after(ghIssue.getClosedAt())) {
					myMerge++;
				}

				GHPullRequest pr = ghRepository.getPullRequest(ghIssue.getNumber());

				List<GHPullRequestReviewComment> reviewComments = pr.listReviewComments().toList();
				for (GHPullRequestReviewComment reviewComment : reviewComments) {
					String author = reviewComment.getUser().getLogin();
					if (author.equals(username) && (date == null || date.after(reviewComment.getCreatedAt()))) {
						myReview++;
					}
				}
			}
		}

		return List.of(myMerge, myReview);
	}


	/**
	 * 유저 모든 레포지터리에서 본인의 커밋 수 총 합
	 *
	 * @param repos
	 * @param userName
	 * @return
	 * @throws IOException
	 * @throws InterruptedException
	 */
	public Long getTotalCommitCountByUser(Map<String, GHRepository> repos, String userName) throws IOException, InterruptedException {
		Long totalCommitCount = 0L;
		for (GHRepository repo : repos.values()) {
			GHRepositoryStatistics statistics = repo.getStatistics();
			Long commitCountWithUser = getCommitCountWithUser(statistics, userName);
			totalCommitCount += commitCountWithUser;
		}
		return totalCommitCount;
	}


	/**
	 * 유저 모든 레포지터리에서 이슈 조회
	 */
	public Long getTotalIssueCountByUser(String userName) throws IOException {
		GHUser user = gitHub.getUser(userName);

		Map<String, GHRepository> map = getRepositoriesInPublicOrganization(user);
		map.putAll(getRepositories(user));

		Long totalIssueCount = 0L;
		for (GHRepository repo : map.values()) {
			List<GHIssue> issues = repo.getIssues(GHIssueState.CLOSED);
			for (GHIssue issue : issues) {
				if (issue.isPullRequest()) continue;
				String author = issue.getAssignee().getLogin();
				if (author.equals(userName)) {
					totalIssueCount++;
				}
			}
		}
		return totalIssueCount;
	}


	/**
	 * 유저 모든 레포지터리에서 라인 수 조회
	 *
	 * @param repos
	 * @param userName
	 * @return
	 * @throws IOException
	 * @throws InterruptedException
	 */
	public Long getTotalCodeLineCountByUser(Map<String, GHRepository> repos, String userName) throws IOException, InterruptedException {
		try {
			Long totalCodeLineCount = 0L;
			for (GHRepository repo : repos.values()) {
				GHRepositoryStatistics statistics = repo.getStatistics();
				totalCodeLineCount += getLineCountWithUser(statistics, userName);
			}
			return totalCodeLineCount;
		} catch (IOException | InterruptedException e) {
			return getTotalCodeLineCountByUser(repos, userName);
		}
	}


	/**
	 * 유저 모든 레포지터리에서 언어 조회
	 */
	public List<String> getLanguagesByUser(String userName) throws IOException {
		GHUser user = gitHub.getUser(userName);
		Map<String, GHRepository> repos = getRepositoriesInPublicOrganization(user);
		repos.putAll(getRepositories(user));

		Set<String> languages = new HashSet<>();
		for (GHRepository repo : repos.values()) {
			Map<String, Long> repoLanguages = repo.listLanguages();
			languages.addAll(repoLanguages.keySet());
		}
		return new ArrayList<>(languages);
	}


	/**
	 * 유저 모든 레포지터리에서 평균 기여도 조회
	 *
	 * @param userName
	 * @return
	 * @throws IOException
	 * @throws InterruptedException
	 */
	public Long getAvgContributionByUser(Map<String, GHRepository> repos, String userName) {
		try {
			double avgContribution = 0;
			for (GHRepository repo : repos.values()) {
				GHRepositoryStatistics statistics = repo.getStatistics();
				double totalCommitCount = getTotalCommitCount(statistics);
				double myCommitCount = getCommitCountWithUser(statistics, userName);
				if (totalCommitCount == 0.0) {
					avgContribution += 100.0;
				} else {
					avgContribution += myCommitCount / totalCommitCount * 100;
				}
			}
			return Math.round(avgContribution / repos.size());
		} catch (IOException | InterruptedException e) {
			return getAvgContributionByUser(repos, userName);
		}
	}


	/**
	 * 유저 모든 레포지터리에서 스타, 포크 조회
	 */

	public List<Long> getStarAndForkByUser(Map<String, GHRepository> repos) {
		Long StarCount = 0L;
		Long ForkCount = 0L;

		for (GHRepository repo : repos.values()) {
			String nodeId = repo.getNodeId();
			RepoEntity repoEntity = repoRepository.findByRepoKey(nodeId).orElse(null);
			if(repoEntity == null) continue;
			StarCount += repoEntity.getStarCnt();
			ForkCount += repoEntity.getForkCnt();
		}
		return List.of(StarCount, ForkCount);
	}


	/**
	 * 유저 모든 레포지터리에서 머지, 리뷰 조회
	 *
	 * @param repos
	 * @param userName
	 * @return
	 * @throws IOException
	 * @throws InterruptedException
	 */
	public List<Long> getMergeAndReviewByUser(Map<String, GHRepository> repos, String userName) throws IOException {
		Long totalMergeCount = 0L;
		Long totalReviewCount = 0L;

		for (GHRepository repo : repos.values()) {
			String nodeId = repo.getNodeId();
			RepoEntity repoEntity = repoRepository.findByRepoKey(nodeId).orElse(null);
			if(repoEntity == null) continue;

			RepoHistoryEntity history = repoHistoryRepository.findFirstByRepoOrderByWorkedAtDesc(
				repoEntity).orElse(null);

			Date lastDate = history == null ? null : DateUtils.LocalDateToDate(history.getWorkedAt());
			List<Integer> myMergeToHistory = getMyMergeToHistory(repo, lastDate, userName);
			totalMergeCount += myMergeToHistory.get(0);
			totalReviewCount += myMergeToHistory.get(1);
		}
		return List.of(totalMergeCount, totalReviewCount);
	}


	/**
	 * 유저 카드 정보 조회
	 *
	 * @param userName
	 * @return
	 * @throws IOException
	 */
	public UserCardDetail getUserCardInfo(String userName) throws IOException, InterruptedException {
		UserCardDetail userCardInfo = new UserCardDetail();

		GHUser user = gitHub.getUser(userName);
		Map<String, GHRepository> repos = getRepositoriesInPublicOrganization(user);
		repos.putAll(getRepositories(user));

		userCardInfo.setUserName(userName);
		userCardInfo.setAvatarUrl(user.getAvatarUrl());
		userCardInfo.setIntroduce(user.getBio());

		userCardInfo.setRepoCount(repos.size());
		userCardInfo.setTotalCommitCount(getTotalCommitCountByUser(repos, userName));
		userCardInfo.setTotalCodeLineCount(getTotalCodeLineCountByUser(repos, userName));

		userCardInfo.setAvgContribution(getAvgContributionByUser(repos, userName));
		userCardInfo.setTotalIssueExp(getTotalIssueCountByUser(userName) * GrowthFactor.ISSUE.getExp());

		List<Long> starAndForkByUser = getStarAndForkByUser(repos);
		userCardInfo.setStarExp(starAndForkByUser.get(0) * GrowthFactor.STAR.getExp());
		userCardInfo.setForkExp(starAndForkByUser.get(1) * GrowthFactor.FORK.getExp());

		List<Long> mergeAndReviewByUser = getMergeAndReviewByUser(repos, userName);
		userCardInfo.setTotalMergeExp(mergeAndReviewByUser.get(0) * GrowthFactor.MERGE.getExp());
		userCardInfo.setTotalReviewExp(mergeAndReviewByUser.get(1) * GrowthFactor.REVIEW.getExp());
		userCardInfo.setTotalCommitExp(getTotalCommitCountByUser(repos, userName) * GrowthFactor.COMMIT.getExp());

		return userCardInfo;
	}
}
