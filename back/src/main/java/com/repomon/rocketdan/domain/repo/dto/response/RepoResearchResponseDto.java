package com.repomon.rocketdan.domain.repo.dto.response;

import com.repomon.rocketdan.domain.repo.app.GrowthFactor;
import com.repomon.rocketdan.domain.repo.entity.RepoHistoryEntity;
import java.time.LocalDate;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RepoResearchResponseDto {

    private Long rank;
    private Long repoExp;
    private Long totalGetExp;
    private Map<String, Long> growthFactor;
    private Map<LocalDate, Long> histories;

    public static RepoResearchResponseDto fromHistoryAndRank(
        List<RepoHistoryEntity> historyEntityList, Long rank, Long repoExp) {

        List<HistoryInfo> historyInfos = historyEntityList.stream()
            .map(HistoryInfo::fromEntity)
            .collect(Collectors.toList());

        Long totalGetExp = 0L;
        Map<String, Long> growthFactor = new HashMap<>();
        for(HistoryInfo historyInfo : historyInfos){
            totalGetExp += historyInfo.exp;

            if(growthFactor.containsKey(historyInfo.type)){
                Long prevExp = growthFactor.get(historyInfo.type);
                growthFactor.replace(historyInfo.type, prevExp + historyInfo.exp);
            }else{
                growthFactor.put(historyInfo.type, historyInfo.exp);
            }
        }

        Map<LocalDate, Long> histories = new TreeMap<>(LocalDate::compareTo);
        historyInfos.forEach(historyInfo -> {
            LocalDate workedAt = historyInfo.getWorkedAt();
            if(histories.containsKey(workedAt)){
                histories.replace(workedAt, histories.get(workedAt) + historyInfo.exp);
            }else{
                histories.put(workedAt, historyInfo.exp);
            }
        });

        return RepoResearchResponseDto.builder()
            .rank(rank)
            .repoExp(repoExp)
            .totalGetExp(totalGetExp)
            .growthFactor(growthFactor)
            .histories(histories)
            .build();
    }

    @Getter
    @AllArgsConstructor
    private static class HistoryInfo{

        private Long exp;
        private String type;
        private LocalDate workedAt;
        public static HistoryInfo fromEntity(RepoHistoryEntity historyEntity){
            Integer repoHistoryType = historyEntity.getRepoHistoryType();
            return new HistoryInfo(historyEntity.getRepoHistoryExp(), GrowthFactor.idxToEnum(repoHistoryType).name(), historyEntity.getWorkedAt());
        }
    }
}
