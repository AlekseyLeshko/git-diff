import { Compare, FileChange } from './types';
import { getCommitRange } from './git-commit-range';
import { parseGitOutput } from './parser';
import { executeCmd } from './execute-cmd';

export const getGitDiff = (comparisons?: Compare): FileChange[] => {
  const cmd = getCmd(comparisons);
  const shellOutput = executeCmd(cmd);
  const changes = parseGitOutput(shellOutput);
  return changes;
};

const getCmd = (comparisons?: Compare) => {
  const commitRange = getCommitRange(comparisons);
  const cmd = `git diff ${commitRange} --numstat`;
  return cmd;
}
