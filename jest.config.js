module.exports = {
    testEnvironment: 'jsdom',
    testMatch: ['**/tests/ui/**/*.test.js'],
    setupFiles: ['./tests/jest.setup.js'],
    setupFilesAfterEnv: ['jest-extended', './tests/jest.setup-after-env.js'],
};
