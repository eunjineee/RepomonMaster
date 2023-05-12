package com.repomon.rocketdan.domain.repo.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.repomon.rocketdan.domain.repo.entity.RepoEntity;

import java.util.HashMap;
import java.util.Map;
import javax.persistence.Column;
import javax.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

@Getter @Builder
@RedisHash(value = "repo-contribute", timeToLive = 86400)
@NoArgsConstructor
@AllArgsConstructor
public class RepoContributeResponseDto {

    @Id @JsonIgnore
    private Long id;
    @Indexed
    @Column(unique = true)
    private Long repoId;
    private String repoOwner;
    private int totalCommitCount;
    private long totalLineCount;
    private Map<String, Integer> committers = new HashMap<>();
    private String mvp;


    public static RepoContributeResponseDto of(int totalCommitCount, long totalLineCount,
        Map<String, Integer> committers, String mvp, RepoEntity repoEntity) {
        return RepoContributeResponseDto.builder()
            .totalCommitCount(totalCommitCount)
            .totalLineCount(totalLineCount)
            .committers(committers)
            .mvp(mvp)
            .repoId(repoEntity.getRepoId())
            .repoOwner(repoEntity.getRepoOwner())
            .build();
    }
}


