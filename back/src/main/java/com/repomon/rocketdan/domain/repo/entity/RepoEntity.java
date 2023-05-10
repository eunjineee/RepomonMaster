package com.repomon.rocketdan.domain.repo.entity;


import com.repomon.rocketdan.common.entity.CommonEntity;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.kohsuke.github.GHRepository;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Entity
@Getter
@SuperBuilder
@Inheritance(strategy = InheritanceType.JOINED)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Table(name = "repo")
public class RepoEntity extends CommonEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "repo_id")
	private Long repoId;

	private String repoName;
	private String repoOwner;
	private String repomonNickname;
	private Integer starCnt;
	private Integer forkCnt;
	private Long repoExp;
	private String repoKey;
	private LocalDateTime repoStart;
	private LocalDateTime repoEnd;
	private Integer rating;

	private Boolean isActive;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "repomon_id")
	private RepomonEntity repomon;

	@Builder.Default
	@OneToMany(mappedBy = "repo", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<RepoConventionEntity> repoConventionList = new ArrayList<>();


	public void updateNickname(String nickname) {
		this.repomonNickname = nickname;
	}


	public void updateRating(int score) {
		this.rating += score;
	}


	public void updateRepomon(RepomonEntity repomon) {
		this.repomon = repomon;
	}




	public void updateExp(Long totalExp) {
		this.repoExp += totalExp;
	}


	public void activate() {
		this.isActive = true;
	}


	public void deActivate() {
		this.isActive = false;
	}


	public void updatePeriod(LocalDateTime startAt, LocalDateTime endAt) {
		this.repoStart = startAt;
		this.repoEnd = endAt;
	}

	public void updateForkCnt(int forksCount) {
		this.forkCnt += forksCount;
	}

	public void updateStarCnt(int starCnt){
		this.starCnt += starCnt;
	}
}
