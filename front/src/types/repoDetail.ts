export type RepoDetailType = {
  myPresentRepo: boolean;
  forkCnt: number;
  myRepo: boolean;
  languages: string[];
  repoEnd: string;
  repoExp: number;
  repoName: string;
  repoDescription: string;
  repoStart: string;
  repomonId: number;
  repomonName: string;
  repomonUrl: string;
  starCnt: number;
  tags: string[];
};

export type GrowthFactorType = {
  [factor: string]: number;
};

export type HistoryType = {
  [key: string]: number;
};

export type RepoDetailResearchType = {
  growthFactor: GrowthFactorType;
  histories: HistoryType;
  rank: number;
  repoExp: number;
  totalGetExp: number;
};

export type ExpAnaysisChartType = {
  labels: string[];
  datasets: {
    label: string;
    data: string[];
    backgroundColor: string;
    borderColor: string;
    pointBackgroundColor: string;
    borderWidth: number;
    color: string;
  }[];
};

export type DatasetType = {
  label: string;
  data: string[];
  borderColor: string;
  backgroundColor: string;
};

export type GrowthChartType = {
  labels: string[];
  datasets: DatasetType[];
};

export type RepomonType = {
  repomonId: number;
  repomonName: string;
  repomonSkillName: string;
  repomonSkillUrl: string;
  repomonTier: number;
  repomonUrl: string;
};

type DetailRepomonType = RepomonType & {
  selectRepomonList?: {
    repomonId: number;
    repomonName: string;
    repomonUrl: string;
  }[];
};

export type RepoDetailBattleType = {
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
  repomon: DetailRepomonType;
  repomonNickname: string;
  statPoint: number;
  winCnt: number;
};

type BattleRepoType = {
  repoId: number;
  repoName: string;
  repomonNickname: string;
  repomonUrl: string;
  repomonTier: number;
  rating: number;
  statPoint: number;
  winCnt: number;
  loseCnt: number;
  repomon: DetailRepomonType;
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

export type BattleRecordType = {
  attackPoint: number;
  attackRepo: BattleRepoType;
  defensePoint: number;
  defenseRepo: BattleRepoType;
  isWin: boolean;
};

export type StatType = {
  [key: string]: number;
  atkPoint: number;
  defPoint: number;
  criticalPoint: number;
  dodgePoint: number;
  hitPoint: number;
};

export type RepoDetailConventionType = {
  description: string;
  prefix: string;
};

export type RepoDetailConventionInfoType = {
  collectCnt: number;
  conventions: RepoDetailConventionType[];
  repoOwner: string;
  totalCnt: number;
  conventionInfo: {
    [prefix: string]: number;
  };
};

export type RepoDetailContributionInfoType = {
  committers: {
    [commiter: string]: number;
  };
  mvp: string;
  repoId: number;
  repoOwner: string;
  totalCommitCount: number;
  totalLineCount: number;
};

export type ContributionChartType = {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
    borderWidth: number;
  }[];
};

export type ConventionChartType = {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
    borderWidth: number;
  }[];
};

export type EditConventionType = {
  id: number;
  prefix: string;
  description: string;
  isEditting: boolean;
};
