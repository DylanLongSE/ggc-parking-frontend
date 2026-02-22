import type { Config } from "jest";
import nextJest from "next/jest";

const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^leaflet$": "<rootDir>/__mocks__/leaflet.ts",
    "^react-leaflet$": "<rootDir>/__mocks__/react-leaflet.tsx",
  },
};

export default createJestConfig(config);
