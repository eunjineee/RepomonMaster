package com.repomon.rocketdan.domain.repomon.dto.response;

import com.repomon.rocketdan.common.utils.S3Utils;
import com.repomon.rocketdan.domain.repo.entity.RepomonEntity;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class RepomonUrlResponseDto {
    private String repomonUrls;

    public static RepomonUrlResponseDto fromEntities(List<RepomonEntity> exceptEgg) {
        int size = exceptEgg.size();
        int idx = (int)((Math.random() * 10000)%size);
        String fileName = exceptEgg.get(idx).getRepomonUrl();
        return new RepomonUrlResponseDto(S3Utils.modelUrl(fileName));
    }
}
