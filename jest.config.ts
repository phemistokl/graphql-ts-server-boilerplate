module.exports = {
    transformIgnorePatterns: [
      "/node_modules/(?!graphql-request)/", // Исключите из игнорируемых папку graphql-request
    ],
    transform: {
      "^.+\\.[tj]sx?$": "babel-jest", // Убедитесь, что Jest использует Babel для трансформации
    },
  };