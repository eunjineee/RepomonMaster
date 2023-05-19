import { http } from "./axios";

export const axiosGetRepoList = async (userId: string) => {
  const res = await http.get(`repo/ext/${userId}`);

  return res;
};

export const axiosGetBattleInfo = async (repoId: number) => {
  const res = await http.get(`repomon/${repoId}`);

  return res;
};

export const axiosGetBattleRanking = async (repoId: number) => {
  const res = await http.get(`repo/${repoId}/info/battle`);

  return res;
};

export const axiosGetBattleRecord = async (repoId: number) => {
  const res = await http.get(`repomon/${repoId}/match/result`);

  return res;
};

export const axiosGetOppo = async (repoId: number) => {
  const res = await http.get(`repomon/${repoId}/match`);

  return res;
};

export const axiosBattle = async (repoId: number, oppoId: number) => {
  const data = {
    opponentRepoId: oppoId,
  };

  const res = await http.post(`repomon/${repoId}/match`, data);

  return res;
};
