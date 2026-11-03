import type { Config } from "jest";

const config: Config = {
  preset: "jest-expo",

  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],

  testMatch: ["<rootDir>/tests/**/*.jest.ts", "<rootDir>/tests/**/*.jest.tsx"],

  collectCoverageFrom: ["src/**/*.{ts,tsx}", "app/**/*.{ts,tsx}", "!**/*.d.ts"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  clearMocks: true,

  testPathIgnorePatterns: ["/node_modules/", "/android/", "/ios/"],

  testEnvironmentOptions: {
    customExportConditions: ["node"],
  },

  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
    "^.+\\.mjs$": "babel-jest",
  },

  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo-modules-core|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|msw|@mswjs|rettime|until-async|@open-draft|@bundled-es-modules|headers-polyfill|strict-event-emitter|outvariant)/)",
  ],
};

export default config;
