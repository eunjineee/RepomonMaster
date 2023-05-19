package com.repomon.rocketdan.domain.repomon.dto.response;


import com.repomon.rocketdan.domain.repo.dto.response.RepomonResponseDto;
import com.repomon.rocketdan.domain.repomon.app.BattleLogic;
import com.repomon.rocketdan.domain.repomon.entity.RepomonStatusEntity;
import lombok.*;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString
@Builder
public class RepomonStatusResponseDto {

	private Long repoId;
	private String repoName;
	private String repomonNickname;
	private Integer rating;
	private Integer statPoint;
	private Integer winCnt;
	private Integer loseCnt;
	private RepomonResponseDto repomon;

	// 내부 공식으로 계산한 수치
	// 최초에 주사위 굴린 수치도 여기에 반영됨
	private Float atk;
	private Float dodge;
	private Float def;
	private Float critical;
	private Float hit;
	// 체력
	private Integer hp;

	// 현재까지 찍은 스탯값
	private Integer atkPoint;
	private Integer dodgePoint;
	private Integer defPoint;
	private Integer criticalPoint;
	private Integer hitPoint;

	// 증가치
	private Float increaseAtk;
	private Float increaseDodge;
	private Float increaseDef;
	private Float increaseCritical;
	private Float increaseHit;


	public static Integer remainStat(Long exp, int atk, int dodge, int def, int critical, int hit) {
		return (int) Math.min((exp / 100), BattleLogic.maxLevel) - (atk + dodge + def + critical + hit);
	}


	public static RepomonStatusResponseDto fromEntity(RepomonStatusEntity repomonStatus) {
		return RepomonStatusResponseDto.builder()
			.repoId(repomonStatus.getRepoId())
			.repoName(repomonStatus.getRepoName())
			.repomonNickname(repomonStatus.getRepomonNickname())
			.rating(repomonStatus.getRating())
			.statPoint(remainStat(repomonStatus.getRepoExp(),
				repomonStatus.getAtkPoint(),
				repomonStatus.getDodgePoint(),
				repomonStatus.getDefPoint(),
				repomonStatus.getCriticalPoint(),
				repomonStatus.getHitPoint()))
			.winCnt(repomonStatus.getWinCnt())
			.loseCnt(repomonStatus.getLoseCnt())
			.repomon(RepomonResponseDto.fromEntity(repomonStatus.getRepomon()))
			// 각 스탯에 찍은 포인트
			.atkPoint(repomonStatus.getAtkPoint())
			.dodgePoint(repomonStatus.getDodgePoint())
			.defPoint(repomonStatus.getDefPoint())
			.criticalPoint(repomonStatus.getCriticalPoint())
			.hitPoint(repomonStatus.getHitPoint())
			// 스탯의 현재 수치
			.atk(BattleLogic.createAtk(repomonStatus.getStartAtk(), repomonStatus.getAtkPoint()))
			.dodge(BattleLogic.createDodge(repomonStatus.getStartDodge(), repomonStatus.getDodgePoint()))
			.def(BattleLogic.createDef(repomonStatus.getStartDef(), repomonStatus.getDefPoint()))
			.critical(BattleLogic.createCritical(repomonStatus.getStartCritical(), repomonStatus.getCriticalPoint()))
			.hit(BattleLogic.createHit(repomonStatus.getStartHit(), repomonStatus.getHitPoint()))
			.hp(BattleLogic.createHp(repomonStatus.getRepoExp()))
			// 1포인트 당 증가 값
			.increaseAtk(BattleLogic.atkValue)
			.increaseDodge(BattleLogic.dodgeValue)
			.increaseDef(BattleLogic.defValue)
			.increaseCritical(BattleLogic.criticalValue)
			.increaseHit(BattleLogic.hitValue)
			.build();
	}

}
