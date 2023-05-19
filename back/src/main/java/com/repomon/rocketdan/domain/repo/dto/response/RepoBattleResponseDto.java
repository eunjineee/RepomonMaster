package com.repomon.rocketdan.domain.repo.dto.response;

import com.repomon.rocketdan.domain.repomon.app.BattleLogic;
import com.repomon.rocketdan.domain.repomon.entity.RepomonStatusEntity;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RepoBattleResponseDto {

    private int rating;
    private Long rank;
    private int winCnt;
    private int loseCnt;
    private Map<String, Float> status;

    public static RepoBattleResponseDto fromStatusEntity(RepomonStatusEntity statusEntity,
        Long rank) {

        return RepoBattleResponseDto.builder()
            .rating(statusEntity.getRating())
            .rank(rank)
            .winCnt(statusEntity.getWinCnt())
            .loseCnt(statusEntity.getLoseCnt())
            .status(BattleLogic.createStatus(statusEntity))
            .build();
    }
}