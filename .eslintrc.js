// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: [
    "expo",
    "prettier",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  globals: {
    __dirname: true,
  },
  env: {
    node: true,
  },
  plugins: ["@typescript-eslint", "react", "prettier"],
  parser: "@typescript-eslint/parser",
  rules: {
    "prettier/prettier": 1,
    "@typescript-eslint/ban-types": 0,
    "@typescript-eslint/no-require-imports": 0,
    "@typescript-eslint/no-explicit-any": 0,
  },
};
