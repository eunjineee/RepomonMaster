import { http } from "./axios";

// 레포몬 랜덤 생성을 위한 전체 모델 리스트
export const getModelLists = async () => {
  const res = await http.get(`/repomon/`);
  return res;
};
