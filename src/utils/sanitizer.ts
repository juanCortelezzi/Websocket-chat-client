function noLeadOrTrailWhites(str: string): string {
  const noLeadOrTrailWhites = /(^\s+|\s+$)/g;
  return str.replace(noLeadOrTrailWhites, "");
}

export default noLeadOrTrailWhites;
