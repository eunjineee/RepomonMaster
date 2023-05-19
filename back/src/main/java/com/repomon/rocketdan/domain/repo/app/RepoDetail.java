package com.repomon.rocketdan.domain.repo.app;

import com.repomon.rocketdan.domain.repo.entity.RepoEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RepoDetail {
    private RepoEntity repoEntity;
    private String description;
    private Boolean isActive;
    private Boolean isPrivate;
}
