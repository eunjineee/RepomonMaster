package com.repomon.rocketdan.domain.repomon.app;


import com.repomon.rocketdan.domain.repomon.entity.RepomonStatusEntity;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

import java.util.HashMap;
import java.util.Random;

import static com.repomon.rocketdan.domain.repomon.app.BattleFactor.*;


@Getter
@Slf4j
public class BattleLogic {

	// 기본값
	public static final Float defaultAtk = 10f;
	public static final Float defaultDodge = 20f;
	public static final Float defaultDef = 10f;
	public static final Float defaultCritical = 10f;
	public static final Float defaultHit = 10f;
	public static final Integer defaultHp = 100;

	// 증가치
	public static final Float atkValue = 1f;
	public static final Float dodgeValue = 0.5f;
	public static final Float defValue = 0.5f;
	public static final Float criticalValue = 1f;
	public static final Float hitValue = 1f;
	public static final Float hpValue = 0.05f;

	// 레이팅 최대값
	public static final Integer maxRating = 50;

	// 스킬 발동 확률
	public static final Integer skillProbability = 5;

	// 맥스 레벨 설정
	public static final Integer maxLevel = 1000;
	public static final Integer maxExp = maxLevel * 100;


	// 현재 해당 스텟 계산
	public static Float createAtk(Integer startPoint, Integer atkPoint) {
		return (startPoint + atkPoint) * atkValue + defaultAtk;
	}


	public static Float createDodge(Integer startPoint, Integer nowPoint) {
		return (startPoint + nowPoint) * dodgeValue + defaultDodge;
	}


	public static Float createDef(Integer startPoint, Integer nowPoint) {
		return (startPoint + nowPoint) * defValue + defaultDef;
	}


	public static Float createCritical(Integer startPoint, Integer nowPoint) {
		return (startPoint + nowPoint) * criticalValue + defaultCritical;
	}


	public static Float createHit(Integer startPoint, Integer nowPoint) {
		return (startPoint + nowPoint) * hitValue + defaultHit;
	}


	public static Integer createHp(Long exp) {
		return (int) (Math.min(exp, maxExp) * hpValue) + defaultHp;
	}


	public static HashMap<String, Float> createStatus(RepomonStatusEntity repomon) {

		Float attack = createAtk(repomon.getStartAtk(), repomon.getAtkPoint());
		Float dodge = createDodge(repomon.getStartDodge(), repomon.getDodgePoint());
		Float def = createDef(repomon.getStartDef(), repomon.getDefPoint());
		Float critical = createCritical(repomon.getStartCritical(), repomon.getCriticalPoint());
		Float hit = createHit(repomon.getStartHit(), repomon.getHitPoint());
		Float hp = (float) createHp(repomon.getRepoExp());

		return new HashMap<>() {
			{
				put("atk", attack);
				put("dodge", dodge);
				put("def", def);
				put("critical", critical);
				put("hit", hit);
				put("hp", hp);
			}
		};
	}


	/**
	 * 사용자가 투자한 전체 스텟 조회
	 *
	 * @param repomon
	 * @return
	 */
	public static Integer getAllStat(RepomonStatusEntity repomon) {
		return Math.max((repomon.getAtkPoint() + repomon.getDefPoint() + repomon.getDodgePoint()
			+ repomon.getCriticalPoint() + repomon.getHitPoint() + (int) ((Math.min(repomon.getRepoExp(), maxExp)) / 100)) + 1, 2);
	}


	/**
	 * MMR 계산을 위한 스탯 차이 계산
	 *
	 * @param offenseRepomon
	 * @param defenseRepomon
	 * @return
	 */
	public static Integer createGap(RepomonStatusEntity offenseRepomon,
		RepomonStatusEntity defenseRepomon) {
		return getAllStat(defenseRepomon) - getAllStat(offenseRepomon);

	}


	/**
	 * 개별 레포몬 공격 데미지 계산 공식 * 올스탯에 비례한 랜덤 난수 * 80~120퍼센트의 데미지 * (1 - 상대 방어율)
	 *
	 * @param repomon
	 * @return
	 */
	public static Float attackDamageCalc(RepomonStatusEntity repomon, Float def) {
		Random random = new Random();
		Integer allStat = getAllStat(repomon);
		float defense = Math.min(def, 90);
		Float attack = createAtk(repomon.getStartAtk(), repomon.getAtkPoint());

		Integer randomDmg = random.nextInt(allStat / 2); // 전체 스텟의 50%만큼 랜덤 데미지 추가
		float randomPercent = random.nextFloat() * 0.4f;
		return (((attack + randomDmg) * (0.8f + randomPercent)) * (1 - (defense
			/ 100)));

	}


	/**
	 * 스킬 데미지 계산
	 *
	 * @param repomon
	 * @return
	 */
	public static Float skillDamageCalc(RepomonStatusEntity repomon) {
		Integer allStat = getAllStat(repomon);
		Float attack = createAtk(repomon.getStartAtk(), repomon.getAtkPoint());
		return (attack + allStat) * 2;
	}


	public static HashMap<String, Object> battle(Integer turn, RepomonStatusEntity offenseRepomon,
		RepomonStatusEntity defenseRepomon, Float skillDmg) {
		HashMap<String, Float> offenseStatus = createStatus(offenseRepomon);
		HashMap<String, Float> defenseStatus = createStatus(defenseRepomon);
		Random random = new Random();

		int isSkilled = random.nextInt(100);
		// 스킬 발동 여부 확인
		if (isSkilled < skillProbability) {
			return useSkillLog(turn, offenseRepomon.getRepoId(), defenseRepomon.getRepoId(),
				skillDmg);

		} else {
			// 명중 여부 확인
			float dodgePercent = Math.min(defenseStatus.get("dodge") - offenseStatus.get("hit"), 90);
			int isDodge = random.nextInt(100);
			boolean dodge = (isDodge < dodgePercent);

			// 치명타 여부 확인
			int isCritical = random.nextInt(100);
			if (isCritical < offenseStatus.get("critical")) {
				Float dmg = attackDamageCalc(offenseRepomon, defenseStatus.get("def")) * 2;
				return dodge
					? useDodgeLog(turn, offenseRepomon.getRepoId(), defenseRepomon.getRepoId(), CRITICAL)
					: useAttackLog(turn, offenseRepomon.getRepoId(), defenseRepomon.getRepoId(), CRITICAL,
						dmg);
			} else {
				Float dmg = attackDamageCalc(offenseRepomon, defenseStatus.get("def"));
				return dodge
					? useDodgeLog(turn, offenseRepomon.getRepoId(), defenseRepomon.getRepoId(), ATTACK)
					: useAttackLog(turn, offenseRepomon.getRepoId(), defenseRepomon.getRepoId(), ATTACK,
						dmg);
			}

		}

	}


	public static HashMap<String, Object> useAttackLog(Integer turn, Long attackRepoId,
		Long defenseRepoId, BattleFactor battleFactor, Float dmg) {
		return new HashMap<>() {
			{
				put("turn", turn);
				put("attacker", attackRepoId);
				put("defender", defenseRepoId);
				put("attack_act", battleFactor.idx);
				put("defense_act", ATTACKED.idx);
				put("damage", dmg);
			}
		};
	}


	public static HashMap<String, Object> useDodgeLog(Integer turn, Long attackRepoId,
		Long defenseRepoId, BattleFactor battleFactor) {
		return new HashMap<>() {
			{
				put("turn", turn);
				put("attacker", attackRepoId);
				put("defender", defenseRepoId);
				put("attack_act", battleFactor.idx);
				put("defense_act", DODGE.idx);
				put("damage", 0);
			}
		};
	}


	public static HashMap<String, Object> useSkillLog(Integer turn, Long attackRepoId,
		Long defenseRepoId, Float skillDmg) {
		return new HashMap<>() {
			{
				put("turn", turn);
				put("attacker", attackRepoId);
				put("defender", defenseRepoId);
				put("attack_act", SKILL.idx);
				put("defense_act", ATTACKED.idx);
				put("damage", skillDmg);
			}
		};
	}


	public static Integer getResultPoint(RepomonStatusEntity myRepomon,
		RepomonStatusEntity yourRepomon) {
		// Elo 계산 때 사용하는 스탯 차이
		Integer statusGap = createGap(myRepomon, yourRepomon);

		return (int) Math.round((1 - (1 / (1 + Math.pow(10,
			((double) (yourRepomon.getRating() - myRepomon.getRating() - statusGap) / 400)))))
			* maxRating);

	}

}
