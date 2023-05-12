package com.repomon.rocketdan.domain.repo.dto.response;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.repomon.rocketdan.domain.repo.app.RepoDetail;
import com.repomon.rocketdan.domain.repo.app.RepoListItem;
import java.util.ArrayList;
import javax.persistence.Column;
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
@RedisHash(value = "redis-repoList")
public class RepoListResponseDto {

    @Id @JsonIgnore
    private Long id;

    @JsonIgnore
    @Column(unique = true)
    private String userName;

    @JsonIgnore
    @Column(unique = true)
    private int currentPage;
    private int totalPages;
    private long totalElements;
    private List<RepoListItem> repoListItems = new ArrayList<>();

    public static RepoListResponseDto empty(String userName, int currentPage){
        return new RepoListResponseDto(null, userName, currentPage, 0, 0L, new ArrayList<>());
    }

    public void updateFromDetails(List<RepoDetail> repoDetails, int currentPage, int totalPages, long totalElements) {
        List<RepoListItem> collect = repoDetails.stream()
            .map(RepoListItem::convertFromDetail)
            .collect(Collectors.toList());

        this.currentPage = currentPage;
        this.totalPages = totalPages;
        this.totalElements = totalElements;
        this.repoListItems = collect;
    }

}


