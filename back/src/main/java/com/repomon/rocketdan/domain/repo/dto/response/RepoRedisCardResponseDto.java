package com.repomon.rocketdan.domain.repo.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.repomon.rocketdan.domain.repo.app.GrowthFactor;
import com.repomon.rocketdan.domain.repo.entity.RepoEntity;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;

import com.repomon.rocketdan.domain.repo.entity.RepoHistoryEntity;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import org.kohsuke.github.GHRepository;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

import javax.persistence.Column;
import javax.persistence.Id;


@Getter
@Builder
@RedisHash(value = "repo-card")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class RepoRedisCardResponseDto {
    /**
     * -------레포카드 detail------
     * 레포 이름 repoName
     * 레포 기간 repoStart repoEnd
     * 레포 언어 languages
     * -----------그래프 ----------
     * 커밋 commits
     * 머지 merges
     * 이슈 issues
     * 리뷰 reviews
     * 레포 포크, 스타  starCnt forkCnt
     * --------------------------
     * 전체 커밋 totalcommit
     * 전체 코드 totalcode
     * 레포몬 repomonId
     * 전체 경험치 repoExp
     * 컨트리뷰터 수 contributers
     */
    @Id
    @JsonIgnore
    private Long id;
    @Column(unique = true, nullable = false)
    @Indexed
    private Long repoId;
    private Long repomonId;
    private Long repoExp;
    private int repomonTier;

    private String repoName;
    private int contributers;
    private LocalDateTime repoStart;
    private LocalDateTime repoEnd;
    private List<String> languages;

    private Long totalcommit;
    private Long totalcode;
    private int conventionrate;

    private int starCnt;
    private int forkCnt;
    private Long commits;
    private Long issues;
    private Long merges;
    private Long reviews;

    public static RepoRedisCardResponseDto fromEntityAndGHRepository(Long repoId,RepoEntity repoEntity, GHRepository ghRepository, List<RepoHistoryEntity> historyEntityList, Long totalcode, Integer contributers, Double conventionrate) {
        try {
            Map<String, Long> languageMap = ghRepository.listLanguages();
            List<String> languages = new ArrayList<>();
            languages.addAll(languageMap.keySet());

            Long totalCommit = 0L;
            Long commitsExp = 0L;
            Long mergesExp = 0L;
            Long issuesExp = 0L;
            Long reviewsExp = 0L;

            for (RepoHistoryEntity repoHistory : historyEntityList) {
                Integer repoHistoryType = repoHistory.getRepoHistoryType();
                GrowthFactor growthFactor = GrowthFactor.idxToEnum(repoHistoryType);
                switch (repoHistoryType) {
                    case 1:
                        Long repoHistoryExp = repoHistory.getRepoHistoryExp();
                        totalCommit += (repoHistoryExp / growthFactor.getExp());
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
            return RepoRedisCardResponseDto.builder()
                .repoId(repoId)
                .repomonId(repoEntity.getRepomon().getRepomonId())
                .repoExp(repoEntity.getRepoExp())
                .repomonTier(repoEntity.getRepomon().getRepomonTier())
                .repoName(repoEntity.getRepoName())
                .contributers(contributers)
                .repoStart(repoEntity.getRepoStart())
                .repoEnd(repoEntity.getRepoEnd())
                .languages(languages)
                .totalcommit(totalCommit)
                .totalcode(totalcode)
                .conventionrate(convention)
                .starCnt(repoEntity.getStarCnt())
                .forkCnt(repoEntity.getForkCnt())
                .commits(commitsExp)
                .issues(issuesExp)
                .merges(mergesExp)
                .reviews(reviewsExp)
                .build();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
