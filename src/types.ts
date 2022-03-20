export type Compare = {
  from?: string;
  to: string;
}

export type FileChange = {
  insertions: number | string,
  deletions: number | string,
  path: string,
}
