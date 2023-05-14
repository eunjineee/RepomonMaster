import { conventionType, RepoInitType } from "@/types/repoRegist";
import { http } from "./axios";

// 유저 정보 조회
// GET
export const getUserDetail = async (userId: number) => {
  const res = await http.get(`/user/${userId}`);

  return res;
};

// 개별 레포 디테일 조회
// GET
export const getRepoDetail = async (repoId: number) => {
  const res = await http.get(`/repo/${repoId}/info`);

  return res;
};

// 개별 레포 정보 갱신
// PUT
export const refreshDetail = async (repoId: number) => {
  const res = await http.put(`/repo/${repoId}/info`);

  return res;
};

// 모든 레포 갱신
// PUT
export const refreshAllRepo = async (userId: number) => {
  const res = await http.put(`/repo/${userId}/reload`);

  return res.data.resultCode;
};

// 레포지토리 활성화 설정
// PUT
export const setRepoActive = async (repoId: number) => {
  const res = await http.put(`/repo/${repoId}/info/active`);

  return res;
};

// 개별 레포 랭킹정보 조회
// GET
export const getRankingInfo = async (repoId: number) => {
  const res = await http.get(`/repo/${repoId}/info/battle`);
  return res;
};

// 개별 레포 기여도 조회
// GET
export const getRepoConts = async (repoId: number) => {
  const res = await http.get(`/repo/${repoId}/info/contribute`);
  return res;
};

// 개별 레포 컨벤션 정보 조회
// GET
export const getRepoConvenInfo = async (repoId: number) => {
  const res = await http.get(`/repo/${repoId}/info/convention`);
  return res;
};

// 전체 레포 리스트 조회
// GET
export const getTotalRepoList = async (
  userId: number,
  pageNum: number,
  sizeNum: number
) => {
  const res = await http.get(`/repo/${userId}?page=${pageNum}&size=${sizeNum}`);
  return res;
};

// 레포몬 초기 등록
export const setRepoInit = async (data: RepoInitType) => {
  const res = await http.post(`/repomon/start`, data);
  return res;
};

// 커밋 컨벤션 등록-수정
export const setCommitConvention = async (
  commitDataList: conventionType[],
  repoId: number
) => {
  const putData = {
    conventions: commitDataList,
  };
  const res = await http.put(`/repo/${repoId}/info/convention`, putData);
  return res;
};

// 레포몬 랜덤 3개 요청
export const getRandomRepo = async () => {
  const res = await http.get(`/repo/repomon`);
  return res;
};

// 레포지터리 Active 변경
export const setActiveRepo = async (repoId: number) => {
  const res = await http.put(`/repo/${repoId}/info/active`);
  return res;
};

// User Ranking 조회
export const getUserRanking = async (userId: number) => {
  const fetchData = {};
  const res = await http.get(`/rank/user`);
};

/** 유저 카드 갱신 */
export const axiosUpdateUserCard = async (userId: number) => {
  const res = await http.get(`user/${userId}/card`);

  return res;
};

/** 유저가 사용한 전체 언어 조회 */
export const axiosGetUserLan = async (userId: number) => {
  const res = await http.get(`user/${userId}/card/language`);

  return res;
};

/** 유저 카드에 적용 중인 언어 조회 */
export const axiosGetUserCardLan = async (userId: number) => {
  const res = await http.get(`user/${userId}/card/language/now`);

  return res;
};

/** 유저 카드 언어 설정 */
export const axiosSetUserCardLan = async (
  userId: number,
  languages: string[]
) => {
  const data = {
    languages,
  };

  const res = await http.put(`user/${userId}/card/language`, data);

  return res;
};
