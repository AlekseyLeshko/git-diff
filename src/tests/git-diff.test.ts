import { getGitDiff } from '../index';

describe('git diff', () => {
  it('should return an empty object', () => {
    const actual = getGitDiff();

    expect(actual).toEqual({});
  });
});
