module.exports = {
    "preset": "react-native",
    "moduleDirectories": [
      "node_modules",
      "src"
    ],
    "roots": [
      "<rootDir>/src"
    ],
    "transform": {
      "^.+\\.ts?$": "ts-jest",
      "^.+\\.tsx?$": "ts-jest",
      "^.+\\.js$": "<rootDir>/node_modules/react-native/jest/preprocessor.js"
    },
    "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
    "moduleFileExtensions": [
      "ts",
      "tsx",
      "js",
      "jsx",
      "json",
      "node"
    ],
    "snapshotSerializers": ["enzyme-to-json/serializer"],
    "setupFilesAfterEnv": ["<rootDir>/src/setupEnzyme.ts"],
    "transformIgnorePatterns": []
  }
  