export function calcBattleDate(battleDate: string): string {
  const currentTime: Date = new Date();

  const newBattleDate: Date = new Date(battleDate);

  const timeDiff: number = currentTime.getTime() - newBattleDate.getTime();

  const hoursDiff: number = Math.floor(timeDiff / (1000 * 60 * 60));

  const minutesDiff: number = Math.floor(timeDiff / (1000 * 60));

  const daysDiff: number = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  const monthsDiff: number = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 30));

  if (minutesDiff < 60) {
    return `${minutesDiff}분 전`;
  } else if (hoursDiff < 24) {
    return `${hoursDiff}시간 전`;
  } else if (daysDiff < 30) {
    return `${daysDiff}일 전`;
  } else {
    return `${monthsDiff}달 전`;
  }
}
