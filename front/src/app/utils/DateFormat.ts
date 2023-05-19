export const dateFormat = (date: Date) => {
  let month: number | string = date.getMonth() + 1;
  let day: number | string = date.getDate();

  month = month >= 10 ? month : "0" + month;
  day = day >= 10 ? day : "0" + day;

  return date.getFullYear().toString() + "-" + month + "-" + day;
};
