type RankInfoType = {
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: {
    page: number;
    size: number;
  };
  size: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  totalElements: number;
  totalPages: number;
};

export type RepoRankContentType = {
  repoId: number;
  repoName: string;
  repoExp: number;
  repoOwner: string;
  repomonNickname: string;
  rating: number;
  repomonTier: number;
  repoRank?: number;
  repomonRank?: number;
  repomonUrl: string;
};

export type UserRankContentType = {
  activeRepoCount: number;
  totalExp: number;
  userId: number;
  userRank: number;
  username: string;
  avatarUrl: string;
};

export type RepoRankInfoType = RankInfoType & {
  content: RepoRankContentType[];
};

export type UserRankInfoType = RankInfoType & {
  content: UserRankContentType[];
};
