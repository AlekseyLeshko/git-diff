export const parseGitOutput = (shellOutput: string) =>
  purgeShellOutput(shellOutput)
    .split('\n')
    .filter(line => line)
    .map((diffChage) => diffChage.split('\t'))
    .map(([insertionStr, deletionStr, path]) => ({
      insertions: parseChange(insertionStr),
      deletions: parseChange(deletionStr),
      path,
    }));

const parseChange = (changeStr: string) => isBinaryFile(changeStr) ? changeStr : parseInt(changeStr, 10);

const isBinaryFile = (changeStr: string) => changeStr === '-';

export const purgeShellOutput = (shellOutput: string) => shellOutput.replace(/\n$/g, '')
