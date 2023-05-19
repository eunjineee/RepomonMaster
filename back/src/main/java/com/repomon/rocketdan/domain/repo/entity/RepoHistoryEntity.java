package com.repomon.rocketdan.domain.repo.entity;


import com.repomon.rocketdan.domain.repo.app.GrowthFactor;
import java.time.LocalDate;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Table(name = "repo_history")
public class RepoHistoryEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "repo_history_id")
    private Long repoHistoryId;

    private Long repoHistoryExp;
    private Integer repoHistoryType;
    private LocalDate workedAt;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repo_id")
    private RepoEntity repo;

    public void updateExp(Long exp){
        this.repoHistoryExp += exp;
    }
    public static RepoHistoryEntity ofGHInfo(LocalDate date, RepoEntity repoEntity, GrowthFactor factor, int cnt){
        return RepoHistoryEntity.builder()
            .repoHistoryExp(factor.getExp() * cnt)
            .repoHistoryType(factor.getIdx())
            .repo(repoEntity)
            .workedAt(date)
            .build();
    }

    public static RepoHistoryEntity empty() {
        return RepoHistoryEntity.builder()
            .workedAt(LocalDate.now())
            .build();
    }
}
