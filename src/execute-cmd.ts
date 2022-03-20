import { execSync } from 'child_process';

export const executeCmd = (cmd: string) => {
  const shellOutput = execSync(cmd).toString();
  return shellOutput;
}
