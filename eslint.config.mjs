import globals from "globals";

export default [
  {files: ["**/*.js"], languageOptions: {sourceType: "module", ecmaVersion: 2021}},
  {files: ["**/*.mjs"], languageOptions: {sourceType: "module", ecmaVersion: 2021}},
  {languageOptions: { globals: globals.browser }},
  {rules: {
        "semi": ["error", "always"],
    }
  }
];