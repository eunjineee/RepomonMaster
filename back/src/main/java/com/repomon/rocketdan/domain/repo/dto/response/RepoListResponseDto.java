package com.repomon.rocketdan.domain.repo.dto.response;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.repomon.rocketdan.domain.repo.app.RepoDetail;
import com.repomon.rocketdan.domain.repo.app.RepoListItem;
import java.util.ArrayList;
import javax.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;


@Getter
@NoArgsConstructor
@AllArgsConstructor
@RedisHash(value = "redis-repoList", timeToLive = 86400)
public class RepoListResponseDto {

    @Id @JsonIgnore
    private Long id;
    @Indexed
    @JsonIgnore
    private String userName;
    private int totalPages;
    private long totalElements;
    private List<RepoListItem> repoListItems = new ArrayList<>();

    public static RepoListResponseDto empty(String userName){
        return new RepoListResponseDto(null, userName, 0, 0L, new ArrayList<>());
    }

    public void updateFromDetails(List<RepoDetail> repoDetails, long totalElements, int totalPages) {
        List<RepoListItem> collect = repoDetails.stream()
            .map(RepoListItem::convertFromDetail)
            .collect(Collectors.toList());

        this.totalPages = totalPages;
        this.totalElements = totalElements;
        this.repoListItems = collect;
    }

}


