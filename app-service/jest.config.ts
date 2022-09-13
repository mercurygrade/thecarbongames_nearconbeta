export default {
    moduleFileExtensions: ["ts", "tsx","js"],
    transform: {
      "^.+\\.(ts|tsx|js)$": "ts-jest",
    },
    testMatch: [
      "**/tests/**/*.spec.ts",
      "**/tests/**/*.test.ts",
    ],
    testEnvironment: "node",
    testTimeout: 20000

  };
  