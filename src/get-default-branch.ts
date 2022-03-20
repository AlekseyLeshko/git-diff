import { purgeShellOutput } from './parser';
import { executeCmd } from './execute-cmd';

export const getDefaultBranch = () => {
  const cmd = getCmd();
  const shellOutput = executeCmd(cmd);
  const defaultBranchName = purgeShellOutput(shellOutput);
  return defaultBranchName;
}

const getCmd = () => {
  const getGitRefForHead = 'git symbolic-ref refs/remotes/origin/HEAD';
  const takeBranchNameFromRef = "sed 's@^refs/remotes/origin/@@'";
  const cmd = `${getGitRefForHead} | ${takeBranchNameFromRef}`;
  return cmd;
}
