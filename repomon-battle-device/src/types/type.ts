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

export type BattleInfoType = {
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
  attackRepo: BattleInfoType;
  defensePoint: number;
  defenseRepo: BattleInfoType;
  isWin: boolean;
};
