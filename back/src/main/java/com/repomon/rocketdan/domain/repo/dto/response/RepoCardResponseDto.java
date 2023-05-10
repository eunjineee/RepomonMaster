package com.repomon.rocketdan.domain.repo.dto.response;

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



    @AllArgsConstructor
    @Getter
    @ToString
    @Builder
    public class RepoCardResponseDto {
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

        public static RepoCardResponseDto fromEntityAndGHRepository(RepoEntity repoEntity, GHRepository ghRepository, List<RepoHistoryEntity> historyEntityList, Long totalcode, Integer contributers, Double conventionrate) {
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

                    switch(repoHistoryType){
                        case 1:
                            totalCommit += 1L;
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
                int starCnt = (int) (ghRepository.getStargazersCount() * GrowthFactor.idxToEnum(5).getExp());
                int forkCnt = (int) (ghRepository.getForksCount() * GrowthFactor.idxToEnum(6).getExp());
                int convention = (int) Math.round(conventionrate);
                return RepoCardResponseDto.builder()
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
                        .starCnt(starCnt)
                        .forkCnt(forkCnt)
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
