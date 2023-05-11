export type RepresentRepoType = {
  battleRank: number;
  repoExp: number;
  repoId: number;
  repoName: string;
  repoRank: number;
  repoRating: number;
  repomonNickName: string;
  repomon: RepomonType;
};

export type UserInfoType = {
  avatarUrl: string;
  nickname: string;
  representRepo: RepresentRepoType;
  totalExp: number;
  userDescription: string;
  activeRepoCnt: number;
  userId: number;
  username: string;
  userRank: number;
};

export type RepoListType = {
  repoListItems: RepoListItemType[];
  totalElements: number;
  totalPages: number;
};

export type RepoListItemType = {
  isActive: boolean;
  isPrivate: boolean;
  repoExp: number;
  repoId: number;
  repomonId: number;
  repoName: string;
  repomonName: string;
  repoDescription: string;
  repoRating: number;
  repomonUrl: string;
};

export type RepomonType = {
  repomonId: number;
  repomonUrl: string;
  repomonName: string;
  repomonSkillUrl: number;
  repomonSkillName: string;
  repomonTier: number;
};
