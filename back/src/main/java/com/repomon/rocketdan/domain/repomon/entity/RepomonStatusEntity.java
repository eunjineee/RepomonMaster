package com.repomon.rocketdan.domain.repomon.entity;


import com.repomon.rocketdan.domain.repo.entity.RepoEntity;
import com.repomon.rocketdan.domain.repo.entity.RepomonEntity;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.kohsuke.github.GHRepository;

import javax.persistence.Entity;
import javax.persistence.Table;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;


@Entity
@Getter
@SuperBuilder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Table(name = "repomon_status")
public class RepomonStatusEntity extends RepoEntity {

	private Integer winCnt;
	private Integer loseCnt;
	private Integer startAtk;
	private Integer startDodge;
	private Integer startDef;
	private Integer startCritical;
	private Integer startHit;
	private Integer atkPoint;
	private Integer dodgePoint;
	private Integer defPoint;
	private Integer criticalPoint;
	private Integer hitPoint;


	public void updateStatus(int atk, int dodge, int def, int critical, int hit) {
		this.atkPoint += atk;
		this.dodgePoint += dodge;
		this.defPoint += def;
		this.criticalPoint += critical;
		this.hitPoint += hit;
	}


	public void setStartStatus(int atk, int dodge, int def, int critical, int hit) {
		this.startAtk = atk;
		this.startDodge = dodge;
		this.startDef = def;
		this.startCritical = critical;
		this.startHit = hit;
	}


	public void updateWinCnt() {
		this.winCnt++;
	}


	public void updateLoseCnt() {
		this.loseCnt++;
	}


	public static RepomonStatusEntity fromGHRepository(String ownerName, GHRepository ghRepository, RepomonEntity repomonEntity) {
		LocalDateTime repoCreatedAt = null;

		try {
			repoCreatedAt = ghRepository.getCreatedAt().toInstant()
				.atZone(ZoneId.systemDefault())
				.toLocalDateTime();
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
		LocalDateTime now = LocalDateTime.now();

		return RepomonStatusEntity.builder()
			.repoName(ghRepository.getName())
			.repoOwner(ownerName)
			.repomonNickname(repomonEntity.getRepomonName())
			.repoExp(0L)
			.forkCnt(0)
			.starCnt(0)
			.repoKey(ghRepository.getNodeId())
			.repoStart(repoCreatedAt)
			.repoEnd(null)
			.createdAt(now)
			.updatedAt(now)
			.rating(1000)
			.isActive(false)
			.repomon(repomonEntity)
			.winCnt(0)
			.loseCnt(0)
			.startAtk(0)
			.startDodge(0)
			.startDef(0)
			.startCritical(0)
			.startHit(0)
			.atkPoint(0)
			.dodgePoint(0)
			.defPoint(0)
			.criticalPoint(0)
			.hitPoint(0)
			.build();
	}

}
