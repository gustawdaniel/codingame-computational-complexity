module.exports = {
    roots: ['<rootDir>'],
    testMatch: ['**/__tests__/**/*.+(ts|tsx)', '**/?(*.)+(spec|test).+(ts|tsx)'],
    transform: {
        '^.+\\.(ts|tsx)$': ['esbuild-jest', {
            target: 'ESNext'
        }],
    },
    setupFilesAfterEnv: ["jest-extended/all"],
    testEnvironment: 'node'
}
