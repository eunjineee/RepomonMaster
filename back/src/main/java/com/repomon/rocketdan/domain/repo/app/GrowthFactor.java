package com.repomon.rocketdan.domain.repo.app;

import java.util.Arrays;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum GrowthFactor {
    COMMIT(1, 10L), MERGE(2, 50L), ISSUE(3, 20L), REVIEW(4, 20L), STAR(5, 200L), FORK(6, 200L);

    Integer idx;
    Long exp;

    public static GrowthFactor idxToEnum(int idx){
        return Arrays.stream(GrowthFactor.values())
            .filter(growthFactor -> growthFactor.idx == idx)
            .findFirst().orElseThrow();
    }
}
