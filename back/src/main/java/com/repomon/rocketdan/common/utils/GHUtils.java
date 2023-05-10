package com.repomon.rocketdan.common.utils;


import com.repomon.rocketdan.domain.repo.app.GrowthFactor;
import com.repomon.rocketdan.domain.repo.app.UserCardDetail;
import com.repomon.rocketdan.domain.repo.entity.RepoEntity;
import com.repomon.rocketdan.domain.repo.entity.RepoHistoryEntity;
import java.util.List;

import java.util.*;
import org.kohsuke.github.*;
import org.kohsuke.github.GHRepositoryStatistics.CodeFrequency;
import org.kohsuke.github.GHRepositoryStatistics.CommitActivity;
import org.kohsuke.github.GHRepositoryStatistics.ContributorStats;
import org.kohsuke.github.GHRepositoryStatistics.ContributorStats.Week;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.time.LocalDate;
import java.time.ZoneId;


import org.kohsuke.github.GHIssue;
import org.kohsuke.github.GHOrganization;
import org.kohsuke.github.GHPersonSet;
import org.kohsuke.github.GHPullRequest;
import org.kohsuke.github.GHPullRequestReviewComment;
import org.kohsuke.github.GHRepository;
import org.kohsuke.github.GHUser;
import org.kohsuke.github.GitHub;
import org.kohsuke.github.GitHubBuilder;
import org.kohsuke.github.PagedIterable;


@Component
public class GHUtils {

    @Value("${github.accessToken}")
    private String accessToken;
    public GitHub gitHub;

    private int pageSize = 1;

    @PostConstruct
    private void init() throws IOException {
        RateLimitChecker limitChecker = RateLimitChecker.NONE;
        gitHub = new GitHubBuilder().withOAuthToken(accessToken).withRateLimitChecker(limitChecker).build();
    }

    public String getOrganizationFirstOwner(String orgName) {
        try {
            return gitHub.getOrganization(orgName).listMembersWithRole("Owner").toList().get(0).getLogin();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public Map<String, GHRepository> getRepositoriesWithName(String name){
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
        String name = user.getLogin();

        Map<String, GHRepository> repositories = new HashMap<>(user.getRepositories());
        Map<String, GHRepository> repositoriesWithNodeKey = new HashMap<>();

        repositories.forEach((s, ghRepository) -> {
            if(!s.equals(name) && !ghRepository.isFork() && !s.equals(name + ".github.io")){
                repositoriesWithNodeKey.put(ghRepository.getNodeId(), ghRepository);
            }
        });

        return repositoriesWithNodeKey;
    }

    private Map<String, GHRepository> getRepositoriesInPublicOrganization(GHUser user)
        throws IOException {
        GHPersonSet<GHOrganization> organizations = user.getOrganizations();
        if(organizations != null) {
            Map<String, GHRepository> repositoriesWithNodeId = new HashMap<>();
            for(GHOrganization ghOrganization : organizations){
                Map<String, GHRepository> repositories = ghOrganization.getRepositories();
                repositories.forEach((s, ghRepository) -> repositoriesWithNodeId.put(ghRepository.getNodeId(), ghRepository));
            }
            return repositoriesWithNodeId;
        }
        return new HashMap<>();
    }


    public Collection<RepoHistoryEntity> GHCommitToHistory(GHRepositoryStatistics statistics, RepoEntity repoEntity, Date date)
        throws IOException, InterruptedException {
        Map<LocalDate, RepoHistoryEntity> histories = new HashMap<>();

        List<CommitActivity> commitActivities = statistics
            .getCommitActivity().toList();

        for(CommitActivity commitActivity : commitActivities){
            long week = commitActivity.getWeek();
            Date weekAt = new Date(week * 1000L);

            Calendar instance = Calendar.getInstance();
            instance.setTime(weekAt);
            instance.add(Calendar.DATE, 6);
            weekAt = Date.from(instance.toInstant());

            if(weekAt.before(date)) continue;

            List<Integer> days = commitActivity.getDays();
            for (int i = 0; i < 7; i++) {
                Integer commitCount = days.get(i);
                Date createdAt = new Date(week * 1000L);

                instance = Calendar.getInstance();
                instance.setTime(createdAt);
                instance.add(Calendar.DATE, i);
                createdAt = Date.from(instance.toInstant());

                if (createdAt.after(date) && commitCount > 0) {
                    LocalDate commitDate = createdAt.toInstant()
                        .atZone(ZoneId.systemDefault())
                        .toLocalDate();

                    configureRepoInfo(histories, commitDate, repoEntity, GrowthFactor.COMMIT, commitCount);
                }
            }
        }

        return histories.values();
    }

    public Collection<RepoHistoryEntity> GHPullRequestToHistory(GHRepository ghRepository, RepoEntity repoEntity, Date date)
        throws IOException {
        Map<LocalDate, RepoHistoryEntity> histories = new HashMap<>();

        PagedIterable<GHPullRequest> pullRequests = ghRepository.queryPullRequests()
            .state(GHIssueState.CLOSED)
            .direction(GHDirection.DESC)
            .list();

        for (GHPullRequest pr : pullRequests) {
            Date closedAt = pr.getClosedAt();
            if (closedAt.after(date)) {
                LocalDate prDate = pr.getClosedAt().toInstant()
                    .atZone(ZoneId.systemDefault())
                    .toLocalDate();

                configureRepoInfo(histories, prDate, repoEntity, GrowthFactor.MERGE, 1);

                PagedIterable<GHPullRequestReviewComment> reviewComments = pr.listReviewComments();

                for (GHPullRequestReviewComment reviewComment : reviewComments) {
                    Date reviewCreatedAt = reviewComment.getCreatedAt();
                    if (reviewCreatedAt.after(date)) {
                        LocalDate reviewDate = reviewComment.getCreatedAt().toInstant()
                            .atZone(ZoneId.systemDefault())
                            .toLocalDate();

                        configureRepoInfo(histories, reviewDate, repoEntity, GrowthFactor.REVIEW,
                            1);
                    }
                }
            } else {
                return histories.values();
            }
        }

        return histories.values();
    }


    public Collection<RepoHistoryEntity> GHIssueToHistory(GHRepository ghRepository, RepoEntity repoEntity, Date date)
        throws IOException {
        Map<LocalDate, RepoHistoryEntity> histories = new HashMap<>();

        PagedIterable<GHIssue> issues = ghRepository.queryIssues()
            .direction(GHDirection.DESC)
            .state(GHIssueState.CLOSED)
            .since(date)
            .list();

        for (GHIssue issue : issues) {
            Date closedAt = issue.getClosedAt();
            if (closedAt.after(date)) {

                LocalDate issueClosedAt = issue.getClosedAt().toInstant()
                    .atZone(ZoneId.systemDefault())
                    .toLocalDate();

                configureRepoInfo(histories, issueClosedAt, repoEntity, GrowthFactor.ISSUE, 1);
            } else {
                return histories.values();
            }
        }

        return histories.values();
    }


    public Collection<RepoHistoryEntity> GHForkToHistory(GHRepository ghRepository, RepoEntity repoEntity, Date fromDate)
        throws IOException {
        Map<LocalDate, RepoHistoryEntity> histories = new HashMap<>();

        PagedIterable<GHRepository> ghRepositories = ghRepository
            .listForks().withPageSize(100);

        PagedIterator<GHRepository> iterator = ghRepositories.iterator();
        while(iterator.hasNext()){
            List<GHRepository> repositories = iterator.nextPage();
            for (GHRepository repo : repositories) {
                Date createdAt = repo.getCreatedAt();
                if (createdAt.after(fromDate)) {
                    LocalDate forkedAt = createdAt.toInstant()
                        .atZone(ZoneId.systemDefault())
                        .toLocalDate();

                    configureRepoInfo(histories, forkedAt, repoEntity, GrowthFactor.FORK, 1);
                } else {
                    return histories.values();
                }
            }
        }

        return histories.values();
    }


    public Collection<RepoHistoryEntity> GHStarToHistory(GHRepository ghRepository, RepoEntity repoEntity, Date fromDate)
        throws IOException {
        Map<LocalDate, RepoHistoryEntity> histories = new HashMap<>();

        PagedIterable<GHStargazer> ghStargazers = ghRepository
            .listStargazers2().withPageSize(100);

        PagedIterator<GHStargazer> iterator = ghStargazers.iterator();
        while(iterator.hasNext()){
            List<GHStargazer> stargazers = iterator.nextPage();
            Collections.reverse(stargazers);
            for (GHStargazer stargazer : stargazers) {
                Date starredAt = stargazer.getStarredAt();
                if (starredAt.after(fromDate)) {
                    LocalDate starredDate = starredAt.toInstant()
                        .atZone(ZoneId.systemDefault())
                        .toLocalDate();

                    configureRepoInfo(histories, starredDate, repoEntity, GrowthFactor.STAR, 1);
                    continue;
                }
                break;
            }
        }

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

    public int getTotalCommitCount(GHRepositoryStatistics statistics) throws IOException {
        PagedIterable<CommitActivity> commitActivities = statistics.getCommitActivity();

        int totalCommitCount = 0;
        for(CommitActivity commitActivity : commitActivities){
            totalCommitCount += commitActivity.getTotal();
        }

        return totalCommitCount;
    }
    public Map<String, Integer> getCommitterInfoMap(GHRepositoryStatistics statistics) throws IOException, InterruptedException {
        Map<String, Integer> commitCountMap = new HashMap<>();
        PagedIterable<ContributorStats> contributorStatList = statistics
            .getContributorStats();

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
        PagedIterable<ContributorStats> contributorStatList = statistics
            .getContributorStats();

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
        PagedIterable<ContributorStats> contributorStatList = statistics.getContributorStats();
        for (ContributorStats contributorStats : contributorStatList) {
            String author = contributorStats.getAuthor().getLogin();
            if (author.equals(userName)) {
                commitCount = (long) contributorStats.getTotal();
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
        List<GHIssue> allIssues = ghRepository.queryIssues().list()
            .toList();

        for (GHIssue issue : allIssues) {
            if (issue.getCreatedAt().after(date) && issue.getUser().getName().equals(username)) {
                issueCount++;
            }
        }
        return issueCount;
    }

    /**
     * 유저 이름의 총 머지, 리뷰 수
     */
    public List<Integer> getMyMergeToHistory(GHRepository ghRepository, Date date, String username) throws IOException {
        int mymerge = 0;
        int myreview = 0;

        PagedIterable<GHPullRequest> pullRequests = ghRepository.queryPullRequests()
            .list();

        for(GHPullRequest pr : pullRequests){
            Date prDate = pr.getMergedAt();

            if(prDate.before(date)) {
                if (pr.getUser().getLogin().equals(username)){
                    mymerge += 1;
                }

                PagedIterable<GHPullRequestReviewComment> reviewComments = pr.listReviewComments();

                for(GHPullRequestReviewComment reviewComment : reviewComments){
                    if (reviewComment.getUser().getLogin().equals(username)){
                        myreview += 1;
                    }
                }
            }
        }

        return List.of(mymerge, myreview);
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
                    if (issue.getAssignee() != null && issue.getAssignee().getLogin().equals(userName)) {
                        totalIssueCount++;
                    }
                }
            }
            System.out.println("totalIssueCount = " + totalIssueCount);
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
        Long totalCodeLineCount = 0L;
        for (GHRepository repo : repos.values()) {
            GHRepositoryStatistics statistics = repo.getStatistics();
            totalCodeLineCount += getLineCountWithUser(statistics, userName);
        }
        return totalCodeLineCount;
    }


    /**
     * 유저 모든 레포지터리에서 언어 조회
     *
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
    public Long getAvgContributionByUser(Map<String, GHRepository> repos, String userName) throws IOException, InterruptedException {
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
    }

    /**
     * 유저 모든 레포지터리에서 스타, 포크 조회
     */
    public List<Long> getStarAndForkByUser(Map<String, GHRepository> repos){
        Long StarCount = 0L;
        Long ForkCount = 0L;
        for (GHRepository repo : repos.values()) {
            StarCount += repo.getStargazersCount();
            ForkCount += repo.getForksCount();
        }
        return List.of(StarCount,ForkCount);
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
    public List<Long> getMergeAndReviewByUser(Map<String, GHRepository> repos, String userName) throws IOException, InterruptedException {
        Long totalMergeCount = 0L;
        Long totalReviewCount = 0L;
        for (GHRepository repo : repos.values()) {
            Calendar calendar = Calendar.getInstance();
            calendar.add(Calendar.YEAR, -1);
            Date date = calendar.getTime();

            totalMergeCount += getMyMergeToHistory(repo, date, userName).get(0);
            totalReviewCount += getMyMergeToHistory(repo, date, userName).get(1);
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
        userCardInfo.setTotalIssueExp(getTotalIssueCountByUser(userName)* GrowthFactor.idxToEnum(3).getExp());
        userCardInfo.setStarExp(getStarAndForkByUser(repos).get(0)* GrowthFactor.idxToEnum(5).getExp());
        userCardInfo.setForkExp(getStarAndForkByUser(repos).get(1)* GrowthFactor.idxToEnum(6).getExp());
        userCardInfo.setTotalMergeExp(getMergeAndReviewByUser(repos, userName).get(0)* GrowthFactor.idxToEnum(2).getExp());
        userCardInfo.setTotalReviewExp(getMergeAndReviewByUser(repos, userName).get(1)* GrowthFactor.idxToEnum(4).getExp());
        userCardInfo.setTotalCommitExp(getTotalCommitCountByUser(repos, userName)* GrowthFactor.idxToEnum(1).getExp());

        return userCardInfo;
    }
}
