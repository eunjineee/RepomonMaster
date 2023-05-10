// repo 등록 페이지 param
export type PageProps = {
  params: {
    userId: string;
    repoId: string;
  };
};

export type buttonType = {
  msg: string;
};

// 등록 페이지 깃 컨벤션 인터페이스
export interface Todo {
  id: number;
  title: string;
  description: string;
}

// 레포 최초 등록 타입
export type RepoInitType = {
  repoId: number;
  repomonId: number;
  repomonNickname: string;
  startAtk: number;
  startCritical: number;
  startDef: number;
  startDodge: number;
  startHit: number;
};

// 랜덤 레포몬 요청 타입

export type RandomRepoType = {
  selectRepomonList: RandomRepo[];
};

export type RandomRepo = {
  repomonId: number;
  repomonUrl: string;
  repomonName: string;
};

// 커밋 컨벤션 타입

export type conventionType = {
  type: string;
  desc: string;
};
