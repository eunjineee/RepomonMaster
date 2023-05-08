export type RepomonRankContentType = {
  repoId: number;
  repoName: string;
  repoExp: number;
  repoOwner: string;
  repomonNickname: string;
  rating: number;
  repomonTier: number;
  repoRank: number;
  repomonUrl: string;
};

export type RepomonRankInfoType = {
  content: RepomonRankContentType[];
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
