export type UserType = {
  accessToken: string;
  refreshToken: string;
  userId: number;
  userName: string;
  avatarUrl: string;
};

export type RepoType = {
  repoId: number;
  repoName: string;
  repomonName: string;
  repomonUrl: string;
};

export type RepomonType = {
  repomonId: number;
  repomonName: string;
  repomonSkillName: string;
  repomonSkillUrl: string;
  repomonTier: number;
  repomonUrl: string;
};

export type RepomonBattleInfoType = {
  atk: number;
  atkPoint: number;
  critical: number;
  criticalPoint: number;
  def: number;
  defPoint: number;
  dodge: number;
  dodgePoint: number;
  hit: number;
  hitPoint: number;
  hp: number;
  increaseAtk: number;
  increaseCritical: number;
  increaseDef: number;
  increaseDodge: number;
  increaseHit: number;
  loseCnt: number;
  rating: number;
  repoId: number;
  repoName: string;
  repomon: RepomonType;
  repomonNickname: string;
  statPoint: number;
  winCnt: number;
};

export type BattleRecordType = {
  attackPoint: number;
  attackRepo: RepomonBattleInfoType;
  defensePoint: number;
  defenseRepo: RepomonBattleInfoType;
  isWin: boolean;
};

export type BattleLogType = {
  attack_act: number;
  damage: number;
  defense_act: number;
  defense_log: string;
  attack_log: string;
  attacker: number;
  turn: number;
  defender: number;
};

export type BattleType = {
  isWin: boolean;
  attackPoint: number;
  defensePoint: number;
  startPlayer: boolean;
  battleLog: BattleLogType[];
  attackRepo: RepomonBattleInfoType;
  defenseRepo: RepomonBattleInfoType;
};

export type BattleHpLogType = {
  hp: number;
  oppoHp: number;
};
