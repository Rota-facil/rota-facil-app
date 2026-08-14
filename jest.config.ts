import type { Config } from "jest";

const config: Config = {
  preset: "jest-expo",

  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],

  testMatch: ["<rootDir>/tests/**/*.test.ts", "<rootDir>/tests/**/*.test.tsx"],

  collectCoverageFrom: ["src/**/*.{ts,tsx}", "app/**/*.{ts,tsx}", "!**/*.d.ts"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  clearMocks: true,

  testPathIgnorePatterns: ["/node_modules/", "/android/", "/ios/"],
};

export default config;
