export const pretreatModelUrl = (url: string) => {
  if (url && url.indexOf("/") && url.indexOf(".")) {
    const slashIndex = url.lastIndexOf("/");
    const dotIndex = url.lastIndexOf(".");

    return url.substring(slashIndex + 1, dotIndex);
  }
};
