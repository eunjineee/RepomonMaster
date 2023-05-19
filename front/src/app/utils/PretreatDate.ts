export const pretreatDate = (date: string | null) => {
  if (!date) {
    return;
  }
  const TPos = date.indexOf("T");
  return date.substring(0, TPos);
};
