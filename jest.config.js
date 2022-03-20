module.exports = {
  collectCoverage: true,
  coverageReporters: ['html', 'text-summary'],
  modulePathIgnorePatterns: ['dist'],
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
};
