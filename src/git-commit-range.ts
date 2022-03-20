import { Compare } from './types';
import { getDefaultBranch } from './get-default-branch';

export const getCommitRange = (comparisons?: Compare) => {
  const defaultBranchName = getDefaultBranch();
  const { from, to = defaultBranchName } = comparisons || {};
  if (from && to) {
    return [from, to].join('...');
  }

  return to;
}
