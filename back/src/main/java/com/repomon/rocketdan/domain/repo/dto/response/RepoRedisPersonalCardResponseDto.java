package com.repomon.rocketdan.domain.repo.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.repomon.rocketdan.domain.repo.app.GrowthFactor;
import com.repomon.rocketdan.domain.repo.entity.RepoEntity;
import com.repomon.rocketdan.domain.repo.entity.RepoHistoryEntity;
import lombok.*;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

import javax.persistence.Column;
import javax.persistence.Id;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;


@Getter
@Builder
@RedisHash(value = "repo-personal-card")
@ToString @NoArgsConstructor
@AllArgsConstructor
public class RepoRedisPersonalCardResponseDto {
    /**
     * -------레포 개인 카드 detail------
     * 레포 이름 repoName
     * 레포 기간 repoStart repoEnd
     * 레포 언어 languages
     * -----------그래프 ----------
     * 커밋 commits
     * 머지 merges
     * 이슈 issues
     * 리뷰 reviews
     * 레포 포크, 스타  starCnt forkCnt
     *-----------그래프 ----------
     * 커밋 mycommits
     * 머지 mymerges
     * 이슈 myissues
     * 리뷰 myreviews
     * 전체 커밋 mytotalcommit
     * 전체 코드 mytotalcode
     * 기여도 my contribution
     * --------------------------
     * 레포몬 repomonId
     * 전체 경험치 repoExp
     * 컨트리뷰터 수 contributers >> 레디스
     * --------------------------
     * 깃허브 아이디 gitname
     * 깃허브 사진 git img
     */
    @Id
    @JsonIgnore
    private Long id;
    @Column(unique = true)
    @Indexed
    private Long repoId;
    @Column(unique = true)
    @Indexed
    private Long userId;
    private Long repomonId;
    private Long repoExp;
    private int repomonTier;
    private Long contribution;

    private String repoName;
    private int contributers;
    private LocalDateTime repoStart;
    private LocalDateTime repoEnd;
    private List<String> languages;

    private int totalcommit;
    private Long totalcode;
    private int mytotalcommit;
    private Long mytotalcode;
    private int conventionrate;

    private int starCnt;
    private int forkCnt;
    private Long commits;
    private Long issues;
    private Long merges;
    private Long reviews;

    private int mycommit;
    private int myissues;
    private int mymerges;
    private int myreviews;

    private String userName;
    private String avatarUrl;


    public static RepoRedisPersonalCardResponseDto fromEntityAndOthers(Long userId, RepoEntity repoEntity, List<RepoHistoryEntity> historyEntityList, Integer contributers, Map<String, String> userInfo, RepoContributeResponseDto contributeResponse, Integer myissue, Long mytotalcode, List<Integer> mymerges, Double conventionrate, List<String> languages) {
        Long commitsExp = 0L;
        Long mergesExp = 0L;
        Long issuesExp = 0L;
        Long reviewsExp = 0L;

        for (RepoHistoryEntity repoHistory : historyEntityList) {
            Integer repoHistoryType = repoHistory.getRepoHistoryType();
            GrowthFactor growthFactor = GrowthFactor.idxToEnum(repoHistoryType);

            switch(repoHistoryType){
                case 1:
                    commitsExp += growthFactor.getExp();
                    break;
                case 2:
                    mergesExp += growthFactor.getExp();
                    break;
                case 3:
                    issuesExp += growthFactor.getExp();
                    break;
                case 4:
                    reviewsExp += growthFactor.getExp();
                    break;
            }
        }

        int convention = (int) Math.round(conventionrate);

        long myContribution;
        int myTotalCommit;
        String username = userInfo.get("username");
        if (null == contributeResponse.getCommitters().get(username) | contributeResponse.getTotalCommitCount()==0) {
            myContribution = 0;
            myTotalCommit = 0;
        }else{
            myTotalCommit = contributeResponse.getCommitters().get(username);
            Double contribution = ((double) myTotalCommit/ (double) contributeResponse.getTotalCommitCount())*100 ;
            myContribution = Math.round(contribution);
        }
        int myCommitExp = (int) (myTotalCommit * GrowthFactor.idxToEnum(1).getExp());
        int myIssueExp = (int) (myissue * GrowthFactor.idxToEnum(3).getExp());
        int myMergeExp = (int) (mymerges.get(0) * GrowthFactor.idxToEnum(2).getExp());
        int myReviewExp = (int) (mymerges.get(1) * GrowthFactor.idxToEnum(4).getExp());

return RepoRedisPersonalCardResponseDto.builder()
                .repoId(repoEntity.getRepoId())
                .userId(userId)
                .repomonId(repoEntity.getRepomon().getRepomonId())
                .repomonTier(repoEntity.getRepomon().getRepomonTier())
                .contribution(myContribution)
                .repoExp(repoEntity.getRepoExp())

                .repoName(repoEntity.getRepoName())
                .contributers(contributers)
                .repoStart(repoEntity.getRepoStart())
                .repoEnd(repoEntity.getRepoEnd())
                .languages(languages)

                .starCnt(repoEntity.getStarCnt())
                .forkCnt(repoEntity.getForkCnt())
                .commits(commitsExp)
                .issues(issuesExp)
                .merges(mergesExp)
                .reviews(reviewsExp)

                .mycommit(myCommitExp)
                .myissues(myIssueExp)
                .mymerges(myMergeExp)
                .myreviews(myReviewExp)

                .totalcommit(contributeResponse.getTotalCommitCount())
                .totalcode(contributeResponse.getTotalLineCount())
                .mytotalcommit(myTotalCommit)
                .mytotalcode(mytotalcode)
                .conventionrate(convention)

                .userName(username)
                .avatarUrl(userInfo.get("avatarUrl"))
                .build();
    }
}
