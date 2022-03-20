import { execSync } from 'child_process';
import { getGitDiff } from '../index';

jest.mock('child_process')

describe('git diff', () => {
  beforeEach(() => {
    execSync.mockReset();
  });

  it.each([
    [
      'return an empty object when a git diff is empty',
      {
        changes: undefined,
        expected: [],
        gitDiffCmd: 'git diff main --numstat',
      },
    ],
    [
      'return an object for one changed file',
      {
        changes: [{
          insertions: 9,
          deletions: 0,
          path: 'x',
        }],
        expected: [{
          insertions: 9,
          deletions: 0,
          path: 'x',
        }],
        gitDiffCmd: 'git diff main --numstat',
      },
    ],
    [
      'skip a binary file when one was added',
      {
        changes: [{
          insertions: '-',
          deletions: 0,
          path: 'x',
        }],
        expected: [{
          insertions: '-',
          deletions: 0,
          path: 'x',
        }],
        gitDiffCmd: 'git diff main --numstat',
      },
    ],
    [
      'skip a binary file when one was deleted',
      {
        changes: [{
          insertions: 0,
          deletions: '-',
          path: 'x',
        }],
        expected: [{
          insertions: 0,
          deletions: '-',
          path: 'x',
        }],
        gitDiffCmd: 'git diff main --numstat',
      },
    ],
    [
      'return an object for two changed file',
      {
        changes: [{
          insertions: 9,
          deletions: 0,
          path: 'x',
        }, {
          insertions: 0,
          deletions: 10,
          path: 'y',
        }],
        expected: [{
          insertions: 9,
          deletions: 0,
          path: 'x',
        }, {
          insertions: 0,
          deletions: 10,
          path: 'y',
        }],
        gitDiffCmd: 'git diff main --numstat',
      },
    ],
    [
      'automatically use a default branch name',
      {
        changes: [],
        expected: [],
        gitDiffCmd: 'git diff extraordinary-branch-name --numstat',
        defaultBranchName: 'extraordinary-branch-name\n',
      },
    ],
    [
      'return an object of changes when a repo has the main as default branch with auto detect',
      {
        changes: [{
          insertions: 9,
          deletions: 0,
          path: 'x',
        }],
        expected: [{
          insertions: 9,
          deletions: 0,
          path: 'x',
        }],
        gitDiffCmd: 'git diff main --numstat',
      },
    ],
    [
      'return an object of changes when a repo has the main as default branch',
      {
        comparisons: {
          to: 'main',
        },
        changes: [{
          insertions: 9,
          deletions: 0,
          path: 'x',
        }],
        expected: [{
          insertions: 9,
          deletions: 0,
          path: 'x',
        }],
        gitDiffCmd: 'git diff main --numstat',
      },
    ],
    [
      'return an object of changes when a repo has the master as default branch with auto detect',
      {
        changes: [{
          insertions: 9,
          deletions: 0,
          path: 'x',
        }],
        expected: [{
          insertions: 9,
          deletions: 0,
          path: 'x',
        }],
        gitDiffCmd: 'git diff master --numstat',
        defaultBranchName: 'master\n',
      },
    ],
    [
      'return an object of changes when a repo has the master as default branch',
      {
        comparisons: {
          to: 'master',
        },
        changes: [{
          insertions: 9,
          deletions: 0,
          path: 'x',
        }],
        expected: [{
          insertions: 9,
          deletions: 0,
          path: 'x',
        }],
        gitDiffCmd: 'git diff master --numstat',
      },
    ],
    [
      'return an object of changes from two branches',
      {
        comparisons: {
          from: 'main',
          to: 'feature/test-branch-name',
        },
        changes: [{
          insertions: 9,
          deletions: 0,
          path: 'x',
        }],
        expected: [{
          insertions: 9,
          deletions: 0,
          path: 'x',
        }],
        gitDiffCmd: 'git diff main...feature/test-branch-name --numstat',
      },
    ],
    [
      'work fine with a shell command as a compare attribute',
      {
        comparisons: {
          from: '$(git merge-base main feature/test-branch-name)',
          to: 'feature/test-branch-name',
        },
        changes: [{
          insertions: 9,
          deletions: 0,
          path: 'x',
        }],
        expected: [{
          insertions: 9,
          deletions: 0,
          path: 'x',
        }],
        gitDiffCmd: 'git diff $(git merge-base main feature/test-branch-name)...feature/test-branch-name --numstat',
      },
    ],
  ])('should %s', (_, { changes, gitDiffCmd, defaultBranchName, comparisons, expected }) => {
    execSync.mockReturnValueOnce(defaultBranchName || 'main');

    const gitOutput = generateGitOutput(changes);
    execSync.mockReturnValueOnce(gitOutput);

    // Act
    const diffChages = getGitDiff(comparisons);

    // Asserts
    expect(execSync).toHaveBeenCalledTimes(2);
    expect(execSync).toHaveBeenCalledWith(getDefaultBranchNameCmd);
    expect(execSync).toHaveBeenCalledWith(gitDiffCmd);

    expect(diffChages).toEqual(expected);
  });
});

const generateGitOutput = (changes = []) =>
  changes.map(change => `${change.insertions}\t${change.deletions}\t${change.path}`).join('\n') + '\n';

const getDefaultBranchNameCmd = "git symbolic-ref refs/remotes/origin/HEAD | sed 's@^refs/remotes/origin/@@'";
