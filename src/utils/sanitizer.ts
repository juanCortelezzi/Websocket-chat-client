function noLeadOrTrailWhites(str: string): string {
  const noLeadOrTrailWhites = /(^\s+|\s+$)/;
  return str.replace(noLeadOrTrailWhites, "");
}

export default noLeadOrTrailWhites;
