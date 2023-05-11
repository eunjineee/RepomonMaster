// 레포몬 배틀 타입

export type BattleResultResponseDataType = {
  data: BattleResultDataType;
  resultCode: string;
};

export type BattleResultDataType = {
  isWin: boolean;
  attackPoint: number;
  defensePoint: number;
  startPlayer: boolean;
  battleLog: BattleLogType[];
  attackRepo: RepoDataType;
  defenseRepo: RepoDataType;
};

export type BattleLogType = {
  attack_act: number;
  damage: number;
  defense_act: number;
  attacker: number;
  turn: number;
  defender: number;
};

export type ScriptType = {
  turn: string;
  attackerScript: string;
  defenderScript: string;
  damageScript: string;
};

export type RepoDataType = {
  repoName: string;
  repomonNickname: string;
  repomonTier: number;
  rating: number;
  statPoint: number;
  winCnt: number;
  loseCnt: number;
  repomon: RepomonType;
  atk: number;
  dodge: number;
  def: number;
  critical: number;
  hit: number;
  hp: number;
  atkPoint: number;
  dodgePoint: number;
  defPoint: number;
  criticalPoint: number;
  hitPoint: number;
  increaseAtk: number;
  increaseDodge: number;
  increaseDef: number;
  increaseCritical: number;
  increaseHit: number;
};

export type RepomonType = {
  repomonId: number;
  repomonUrl: string;
  repomonName: string;
  repomonSkill: number;
  repomonSkillName: string;
  selectRepomonList: null;
};
