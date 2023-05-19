package com.repomon.rocketdan.domain.repo.dto.response;

import com.repomon.rocketdan.domain.repo.entity.RepoEntity;
import com.repomon.rocketdan.domain.repo.entity.RepomonEntity;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter @Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExtensionRepoListResponseDto {

    private List<ExtensionRepoListItem> repoList;
    public static ExtensionRepoListResponseDto fromEntites(List<RepoEntity> repoEntities) {
        List<ExtensionRepoListItem> list = repoEntities.stream()
            .map(ExtensionRepoListItem::of)
            .collect(Collectors.toList());

        return new ExtensionRepoListResponseDto(list);
    }

    @Builder
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    private static class ExtensionRepoListItem{
        private Long repoId;
        private String repomonUrl;
        private String repoName;
        private String repomonName;

        public static ExtensionRepoListItem of(RepoEntity repoEntity){
            RepomonEntity repomon = repoEntity.getRepomon();
            String repomonUrl = repomon.getRepomonUrl();

            return ExtensionRepoListItem.builder()
                .repoId(repoEntity.getRepoId())
                .repomonUrl(repomonUrl)
                .repoName(repoEntity.getRepoName())
                .repomonName(repoEntity.getRepomonNickname())
                .build();
        }
    }
}
