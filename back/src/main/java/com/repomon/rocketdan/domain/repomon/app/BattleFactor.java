package com.repomon.rocketdan.domain.repomon.app;


import lombok.AllArgsConstructor;
import lombok.Getter;


@AllArgsConstructor
@Getter
public enum BattleFactor {
	ATTACK(1), CRITICAL(2), SKILL(3), DODGE(1), ATTACKED(2);

	Integer idx;

}
